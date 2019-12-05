//Dependancy
const http      = require('http');
const https      = require('https');
const url       = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs =      require('fs');

// Instantiate the HTTP server
const httpServer = http.createServer((req,res)=>{
    unifiedServer(req,res);
});
// Start the server, and have it listen on port 3000
httpServer.listen(config.httpPort,()=>{
    console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`);
});

// Instantiate the HTTP server
// code to generate openssl
// openssl req -newkey rsa:2048 -new -nodes  -x509 -days 3650 -keyout key.pem -out cert.pem

const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, (req,res)=>{
    unifiedServer(req,res);
})

httpsServer.listen(config.httpsPort,()=>{
    console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});

//handler object
const handler = {};

//sample handler
handler.ping = (data, callback) => {
    callback(200);
}

//not found handler
handler.notFound = (data, callback) =>{
    callback(404)
}

const router = {
    "callback":handler.callback,
    "notFound":handler.notFound
}



// all the server logic for both htttp and https server
const unifiedServer = (req,res)=>{
    //get the url and parse it
    let parsedUrl = url.parse(req.url, true);
    
    //get the url path 
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');
    
    //get query string parameter as an object
    let queryStringObject = parsedUrl.query;

    //get the http method
    let method = req.method.toLowerCase();

    //get the header as an object 
    let headers = req.headers;

    //get the payload, if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    //collecting buffed data and decode and store.
    req.on('data', (data)=>{
        buffer += decoder.write(data);
    });

    //Finishing the end request 
    req.on("end", ()=>{
        buffer += decoder.end();

        //call handler based on the request
        let currentHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound;
        
        //create data for handler
        let data = {
            'method':method,
            'header':headers,
            'query':queryStringObject,
            'payload':buffer,
        }

        //call current handler
        currentHandler(data, (statusCode, payload)=>{
            let code = typeof(statusCode) === 'number' ? statusCode : 200;
            let payloadObject = typeof(payload) === 'object' ? payload : {};

            //set header
            res.setHeader("content-type","application/json");
            res.writeHead(code);
            //send respond
            res.end(JSON.stringify(payloadObject));
        })

        //log the request path
        console.log("request received with this payload: ", data);

    })
}
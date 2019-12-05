//Dependancy
const http      = require('http');
const url       = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
// The server should response all requests with a string
const server = http.createServer((req,res)=>{
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
})

//handler object
const handler = {};

//sample handler
handler.callback = (data, callback) => {
    let payload = data;
    callback(200, payload);
}

//not found handler
handler.notFound = (data, callback) =>{
    callback(404)
}

const router = {
    "callback":handler.callback,
    "notFound":handler.notFound
}

// Start the server, and have it listen on port 3000
server.listen(config.port,()=>{
    console.log(`The server is listening on port ${config.port} in ${config.envName} mode`);
});

//execute commands
//terminal #1 - node .
//terminal #2 - user postman and add some headers

//LOAD DEPENDANCY
const http      = require("http");
const https     = require("https");
const url       = require('url');
const fs        = require('fs');

const config  = {
    httpPort:3000,
    httpsPort:3001,
    resHeaderContentType:'application/json',
    sslKeyPath:'./ssl/key.pem',
    sslCertPath:'./ssl/cert.pem'
}

//CREATE HTTP SERVER TO LISTEN REQUEST AND RESPOND ACCORDING TO THE REQUEST LIKE
const httpServer = http.createServer((req,res)=>{
    console.log(req);
    executeServerRequest(req,res);
})

//LISTEN HTTP SERVER FOR THE REQUESTS
httpServer.listen(config.httpPort, ()=>{
    console.log(`The HTTP server is listing on port ${config.httpsPort} now.`);
});

//CREATE OPENSSL FOR THE HTTPS SERVER, IT MUST REQUIRED TO USE HTTPS SERVER
//RUN BELOW COMMAD TO GENERATE OPEN SSL AFTER SUPPLYING FEW QUESTIONS. 
//COMMAND:- openssl req -newkey rsa:2048 -new -nodes  -x509 -days 3650 -keyout key.pem -out cert.pem

const httpsOption = {
    key:fs.readFileSync(config.sslKeyPath),
    cert:fs.readFileSync(config.sslCertPath),
}

//CREATE HTTPS SERVER TO LISTEN REQUEST AND RESPOND ACCORDING TO THE REQUEST LIKE
const httpsServer = https.createServer(httpsOption, (req,res)=>{
    executeServerRequest(req,res);
});

//LISTEN HTTPs SERVER FOR THE REQUESTS
httpsServer.listen(config.httpsPort, ()=>{
    console.log(`The HTTPS server is listing on port ${config.httpsPort} now.`);
});

//COMMON METHOD FOR HTTP AND HTTPS TO EXECUTE SERVER REQUEST AND RESPONSE
const executeServerRequest = function(req, res){
    //GET THE URL AND PARSE IT
    let parsedUrl = url.parse(req.url, true);
    
    //GET THE PATHNAME AND REPLACE INITIALS AND LAST FORWARD SLASH 
    //FROM THE PATHNAME TO HANDLE THE RESPONSE
    let pathname = parsedUrl.pathname;
    let path = pathname.replace(/^\/+|\/+$/g,'').toLowerCase();
    let queryString = parsedUrl.query;
    
    //CHECK IF ROUTE IS EXIST IF NOT THEN SET DEFAULT NOT FOUND ROUTE. 
    let currentRoute = typeof(route[path]) === 'undefined'? route.notfound : route[path];
    
    let payload = {
        pathname:pathname,
        query:queryString
    }

    //TRIGGER CURRENT ROUTE
    currentRoute(payload, (code, resData) => {
        //SET RESPONSE TYPE
        res.setHeader('content-type',config.resHeaderContentType);
        res.writeHead(code);
        let message = resData;
        res.end(JSON.stringify({message}))
    })
}

//ROUTE HANDLER
const handler = {}
handler.hello = (payload, callback)=> {
    let name = payload.query.name || "guest"
    callback(200, `Hello ${name}`)
};
handler.notfound  = (payload, callback)=> {
    callback(404, "Not found! Please try different")
};

//REQUEST ROUTES
const route = {
    hello:handler.hello, 
    notfound:handler.notfound // DEFAULT ROUTE IF ROUTE NOT MATCH OF CLIENT REQUEST 
}

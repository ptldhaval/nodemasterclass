//Dependancy
const http      = require('http');
const url       = require('url');

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

    //send the response
    res.end("Hello Word\n")

    //log the request path
    console.log("request received on path: " + trimmedPath + " with method: " + method + " and query string parameters: ", queryStringObject);
    
})

// Start the server, and have it listen on port 3000
server.listen(3000,()=>{
    console.log("The server is listening on port 3000 now");
});

//execute commands
//terminal #1 - node .
//terminal #2 - curl localhost:3000/user?username=dhaval

//Dependancy
const http      = require('http');
const url       = require('url');

// The server should response all requests with a string
const server = http.createServer((req,res)=>{
    //get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    
    //get the url path 
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //send the response
    res.end("Hello Word\n")

    //log the request path
    console.log("request received on path: " + trimmedPath);
})

// Start the server, and have it listen on port 3000
server.listen(3000,()=>{
    console.log("The server is listening on port 3000 now");
});

//execute commands
//terminal #1 - node .
//terminal #2 - curl localhost:3000/user
//OR
//terminal #3 - curl localhost:3000/user/

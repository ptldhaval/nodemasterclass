
//Dependancy
const http = require('http');

// The server should response all requests with a string
const server = http.createServer((req,res)=>{
    res.end("Hello Word\n")
})

// Start the server, and have it listen on port 3000
server.listen(3000,()=>{
    console.log("The server is listening on port 3000 now");
});

//execute commands
//terminal #1 - node .
//terminal #2 - curl localhost:3000

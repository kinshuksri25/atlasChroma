/*
*   Main server file
*/

//Depenedencies
const https = require('https');
const url = require('url');
const fs = require('fs');
const router = require("./lib/routes/centalRouter");
const stringDecoder = require('string_decoder').StringDecoder;

//server object definition
const server = {};

const decoder = new stringDecoder('utf-8');

//https certifications
server.certParams = {
    'key': fs.readFileSync('../lib/Certificates/serverKey.key'),
    'cert': fs.readFileSync('../lib/Certificates/serverCert.crt')
};

server.https = https.createServer(server.certParams, (req, res) => {

    server.unifiedServer(req, res);
                        
});

// combined server for all routes
server.unifiedServer = (req, res) => {

    //converting url to url object
    let parsedUrl = url.parse("https://" + req.rawHeaders[1] + req.url, true);
    //constructing required params for handlers
    let method = req.method;
    let route = parsedUrl.pathname;
    let queryStringObject = parsedUrl.query;
    let headers = req.headers;
    //function specific params
    let requestBodyString = "";
    let chosenHandler;
    let requestObject = {};
    
    //streaming in the req body in case of post req
    req.on("data", function(chunk) {
        requestBodyString += chunk;
    });
    //this is called regardless of the method of the req
    req.on("end", function() {
        //this is specific to post req
        requestBodyString += decoder.end();

        requestBodyString = method == "POST" || method == "PUT" ? JSON.parse(requestBodyString) : {};
        //the request object sent to the handlers
        requestObject.method = method;
        requestObject.reqBody = requestBodyString;
        requestObject.queryObject = queryStringObject;

        if(headers.hasOwnProperty("cookieid")){
            requestObject.cookieid = headers.cookieid;
        }
        res.writeHead(200,{"Access-Control-Allow-Origin":"*",
                           "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept,cookieid",
                           "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE"});

        router.centralRouter(route,requestObject).then(responseObject => {
                res.write(JSON.stringify(responseObject));
                res.end();
            }).catch(errorObject => {
                res.write(JSON.stringify(errorObject));
                res.end();
            });
    }); 
};


//function for starting the server
server.init = (runtimeEnvironment,port) => {
    //start the https server
    server.https.listen(port, function() {
        console.log("The https server is listening on port "+port+" in "+runtimeEnvironment+" mode");
    });
};

//export the module
module.exports = server;

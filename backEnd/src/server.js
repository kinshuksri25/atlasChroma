/*
 *   Main server file
 */

//Depenedencies
let https = require('https');
let url = require('url');
let fs = require('fs');
let handlers = require('./lib/handlers');
let stringDecoder = require('string_decoder').StringDecoder;
let decoder = new stringDecoder('utf-8');

//server object definition
let server = {};

//https certifications
server.certParams = {
    'key': fs.readFileSync('../lib/Certificates/serverKey.key'),
    'cert': fs.readFileSync('../lib/Certificates/serverCert.crt')
};

server.https = https.createServer(server.certParams, (req, res) => {

    server.unifiedServer(req, res);
                        
});

//main server 
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
    let responsePayload = {
        'Payload': {},
        'Status': ""
    };

    //streaming in the req body in case of post req
    req.on("data", function(chunk) {
        requestBodyString += chunk;
    });

    //this is called regardless of the method of the req
    req.on("end", function() {

        //this is specific to post req
        requestBodyString += decoder.end();

        requestBodyString = method == "POST" ? JSON.parse(requestBodyString) : {};

        //the request object sent to the handlers
        requestObject.method = method;
        requestObject.reqBody = requestBodyString;
        requestObject.queryObject = queryStringObject;

        chosenHandler = server.handlers.hasOwnProperty(route) ? server.handlers[route] : server.handlers.notFound;
        
        res.writeHead(200,{"Access-Control-Allow-Origin":"*",
                           "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept",
                           "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE"});
        
        chosenHandler(requestObject).then(result => {
                //post handler call
                responsePayload.Status = "SUCCESS";
                responsePayload.Payload = result;

                //send the data back
                res.write(JSON.stringify(responsePayload));
                res.end();
            }).catch(error => {
                //error handler 
                responsePayload.Status = "ERROR";
                responsePayload.Payload = "ERROR-->" + error;

                //send the data back 
                res.write(JSON.stringify(responsePayload));
                res.end();
            });
    }); 
};

//router definition
server.handlers = {
    '/login': handlers.login,
    '/signup': handlers.signup,
    '/checkUserName': handlers.checkUserName,
    '/checkEmail': handlers.checkEmail,
    '/notFound': handlers.notFound,
    '/googleLogin' : handlers.googleLogin,
    '/postAuth': handlers.postAuth
};

//init function
server.init = () => {
    //start the https server
    //TODO--> Change this to handle changing port and env
    server.https.listen(5000, function() {
        console.log('The https server is listening on port 5000 in Development mode');
    });
};

//export the module
module.exports = server;
/*
*   Main server file
*/

//Depenedencies
const https = require('https');
const url = require('url');
const fs = require('fs');
const connect = require('connect');
const cron = require('./lib/utils/cron');
const socket = require('./lib/utils/socket');
const router = require("./lib/routes/centalRouter");
const cluster = require("cluster");
const os = require('os');
const soc = require("socket.io");
const stringDecoder = require('string_decoder').StringDecoder;
const cookieHandler = require('./lib/utils/cookieHandler');

var app = connect();

//server object definition
const server = {};

const decoder = new stringDecoder('utf-8');

//https certifications
server.certParams = {
    'key': fs.readFileSync('../lib/Certificates/private.key'),
    'cert': fs.readFileSync('../lib/Certificates/private.crt')
};

server.https = https.createServer(server.certParams, app);
const io = new soc(server.https);

app.use((req, res, next) => {
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
        //this is specific to post req (exception is the socket.io route)
        requestBodyString += decoder.end(); 
        requestBodyString = requestBodyString != "" ? JSON.parse(requestBodyString) : requestBodyString;
        //the request object sent to the handlers
        requestObject.method = method;
        requestObject.reqBody = requestBodyString;
        requestObject.queryObject = queryStringObject;

        if(headers.hasOwnProperty("cookieid")){
            requestObject.cookieid = headers.cookieid;
        }

        if(headers.hasOwnProperty("socketid")){
            requestObject.socketid = headers.socketid;
        }

        res.writeHead(200,{"Access-Control-Allow-Origin":"https://localhost:3000",
                           "Access-Control-Allow-Credentials" : "true",
                           "Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept,cookieid,socketid",
                           "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE"});
                           
        router.centralRouter(route,requestObject,io).then(responseObject => {
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
    if(cluster.isMaster) {
        const cpuCount = os.cpus().length;
        for(var i=0;i < cpuCount;i++){
            cluster.fork();
        }
        cluster.on('online', function(worker) {
            console.log('Worker ' + worker.process.pid + ' is online');
        });
    
        cluster.on('exit', function(worker, code, signal) {
            console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log('Starting a new worker');
            cluster.fork();
        });
    }
    else{
        //start the https server
        server.https.listen(port, function() {
            console.log("The https server is listening on port "+port+" in "+runtimeEnvironment+" mode");
        });

        //clear all cookies before server start
        //cookieHandler.clearCookies();
        socket.handleEvents(io);

        //setting up crons 
        cron.startJobs();
    }
};

//export the module
module.exports = server;

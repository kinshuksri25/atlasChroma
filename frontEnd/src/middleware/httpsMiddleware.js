//middleware for constructing and sending https request to backend.

var https = require("https");
import { connectionConstants,EMSG } from '../../../lib/constants/contants';
var stringdecoder = require('string_decoder').StringDecoder;
var url = require('url');


//middleware object
var middleware = {};

var methods = {
    "post": "POST",
    "get": "GET",
    "put": "PUT",
    "delete": "DELETE"
};

//define the decoder
var decoder = new stringdecoder('utf-8');

//backend http request
var httpsRequest = function(path, method, headers, data,,callback) {

    console.log("Https request initiated to the backend");
    var builtUrl = connectionConstants.secureProtocol + "//" + connectionConstants.hostname + ":" + connectionConstants.backEndPort + path;
    var requestMethod = checkMethod(method);
    if (requestMethod != '') {
        builtUrl = requestMethod == methods["get"] || requestMethod == methods["delete"] ? builtUrl + "?" + data : builtUrl;

        //create a request object
        var requestDetails = url.parse(builtUrl, true);
        requestDetails.method = requestMethod;
        requestDetails.headers = {...headers};

        console.log("Request being made to:", path);
        //request made to the backend.
        var backendRequest = https.request(requestDetails, function(response) {

            console.log("Response came back....");

            var responseString = '';

            response.on('data', function(chunk) {
                responseString += decoder.write(chunk);
            });

            response.on('end', function() {
                responseString += decoder.end();
                responseString = JSON.parse(responseString);
                console.log(responseString);
                callback(false,responseString);
            });
        });
        //write data to request body	
        if (requestMethod == methods["post"] || requestMethod == methods["put"]) {
            data = JSON.stringify(data);
            backendRequest.write(data);
        }

        //error checking
        backendRequest.on('error', (error) => {
            console.log(error);
            callback(error.message,false);
        });

        //send request
        backendRequest.end();
    } else {
        //TODO --> add the error
        callback(EMSG.CLI_MID_INVMET,false);
    }
};

var checkMethod = function(passedMethod) {
    var returnMethod = '';
    for (var key in methods) {
        if (methods[key] == passedMethod.toUpperCase()) {
            returnMethod = methods[key];
        }
    }

    return returnMethod;
};

middleware.httpsRequest = httpsRequest;

//export the module
export default middleware;
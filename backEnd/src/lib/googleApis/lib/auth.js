//Central Auth File For Google OAUTH2

//Dependencies 
const https = require("https");
const url = require('url');
const stringdecoder = require('string_decoder').StringDecoder;
const {EMSG} = require ('../../../../lib/constants/constants');

const decoder = new stringdecoder('utf-8');

//declaring the module
const auth = {};

//function for auth url contruction 
//params --> email -string, uniqueState - string, authUrlTemplate - string, currentScopes - object, appAuthDetails - object
//returns --> authurl - string
auth.buildAuthURL = (email,uniqueState,authUrlTemplate,currentScopes,appAuthDetails) => {

    if(email != "" && uniqueState != "" && JSON.stringify(currentScopes) != JSON.stringify({}) && JSON.stringify(appAuthDetails) != JSON.stringify({})){
        let scopes = "";
        let counter = 0;
        for(let scope in currentScopes)
        {
           if(counter == Object.keys(currentScopes).length){
               scopes += currentScopes[scope];
           }else{
               scopes += currentScopes[scope]+"+";
           }
           counter ++;
        }    
        let authUrl =  authUrlTemplate+"?scope="+scopes+"&response_type=code&access_type=offline&state="+uniqueState+"&login_hint="+email+"&redirect_uri="+appAuthDetails.redirectURL+"&client_id="+appAuthDetails.clientID;
        return authUrl;
    }else{
        console.log(EMSG.SVR_OAUTH_URLERR);
        return "";
    }

};

//function for token retrival
//params --> authRequest - object
//returns --> promise - tokenObject 
auth.tokenGeneration = (authRequest) => new Promise((resolve,reject) => {
    
    let parsedUrl = url.parse(authRequest.refreshTokenURL);
    let requestDetails = {
        'host': parsedUrl.host,
        'hostname': parsedUrl.hostname,
        'protocol' : parsedUrl.protocol,
        'method' : 'POST',
        'Content-Type': 'application/x-www-form-urlencoded',
        'path': parsedUrl.path,
        'pathname': parsedUrl.pathname,
        'href': parsedUrl.href
    };
    
    let data = {
        client_id : authRequest.appAuthDetails.clientID,
        client_secret : authRequest.appAuthDetails.clientSecret,
    };
    if(authRequest.hasOwnProperty("authCode")){
        data.code = authRequest.authCode;
        data.redirect_uri = authRequest.appAuthDetails.redirectURL;
        data.grant_type = "authorization_code";
    }else{
        data.refresh_token = authRequest.refreshToken;
        data.grant_type = "refresh_token";
   }
    
    //https request
    let accessTokenReq = https.request(requestDetails, function(response) {

        let responseString = '';

        response.on('data', function(chunk) {
            responseString += decoder.write(chunk);
        });

        response.on('end', function() {
            responseString += decoder.end();
            responseString = JSON.parse(responseString);
            resolve(responseString);
        });
    });
    
        accessTokenReq.write(JSON.stringify(data));

        //error checking
        accessTokenReq.on('error', (error) => {
            console.log(error.message);
            reject(EMSG.SVR_OAUTH_CONNERR);
        });

        //send request
        accessTokenReq.end();

});

//exporting the module
module.exports = {...auth};

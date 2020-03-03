//Central Auth File For Google OAUTH2

//Dependencies 
const https = require("https");
const url = require('url');
const stringdecoder = require('string_decoder').StringDecoder;
const {ERRORS} = require ('../../../../lib/constants/dataConstants');
const decoder = new stringdecoder('utf-8');

//declaring the module
const auth = {};

//auth url contruction 
auth.buildAuthURL = (email,uniqueState,authUrlTemplate,currentScopes,appAuthDetails) => {

    if(email != "" && uniqueState != "" && currentScopes != [] && appAuthDetails != {}){
        let scopes = "";
        for(let i=0;i<currentScopes.length;i++)
        {
           if(i == currentScopes.length-1){
               scopes += currentScopes[i];
           }else{
               scopes += currentScopes[i]+"+";
           }
        }    
        let authUrl =  authUrlTemplate+"?scope="+scopes+"&response_type=code&access_type=offline&state="+uniqueState+"&login_hint="+email+"&redirect_uri="+appAuthDetails.redirectURL+"&client_id="+appAuthDetails.clientID;
        return authUrl;
    }else{
        console.log("INVALID REQUEST PARAMS");
        return "";
    }

};

//inital access token retrival 
auth.generateInitialAccessToken = (authCode,refreshTokenURL,appAuthDetails) => new Promise((resolve,reject) => {
    
    let parsedUrl = url.parse( refreshTokenURL);
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
        code : authCode,
        client_id : appAuthDetails.clientID,
        client_secret : appAuthDetails.clientSecret,
        redirect_uri : appAuthDetails.redirectURL,
        grant_type : "authorization_code"
    };

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
            reject(ERRORS.ERR_GGLCONN_SVR);
        });

        //send request
        accessTokenReq.end();

});

//refresh/access token retrival 
auth.refreshAccessToken = (refreshToken,refreshTokenURL,appAuthDetails) => new Promise((resolve,reject) => {
    let parsedUrl  = url.parse(refreshTokenURL);
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
        refresh_token : refreshToken,
        client_id : appAuthDetails.clientID,
        client_secret : appAuthDetails.clientSecret,
        grant_type : "refresh_token"
    };

    //https request
    let refAccessTokenReq = https.request(requestDetails, function(response) {

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
    
    refAccessTokenReq.write(JSON.stringify(data));

    //error checking
    refAccessTokenReq.on('error', (error) => {
        console.log(error.message);
        reject(ERRORS.ERR_GGLCONN_SVR);
    });

    //send request
    refAccessTokenReq.end();
});


//exporting the module
module.exports = {...auth};

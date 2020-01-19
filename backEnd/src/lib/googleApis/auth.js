//Central Auth File For Google OAUTH2

//Dependencies 
var https = require("https");
var url = require('url');
var stringdecoder = require('string_decoder').StringDecoder;
var {ERRORS,scopes,loginAuth,refreshTokenURL,authURL} = require ('../../../../lib/constants/dataConstants');
const decoder = new stringdecoder('utf-8');

//declaring the module
const auth = {};

//auth url contruction 
auth.buildAuthURL = (email,uniqueState) => {

    if(email != "" && uniqueState != ""){
        let authUrl =  authURL+"?scope="+scopes.CALENDAR+" "+scopes.CONTACTS+"&response_type=code&access_type=offline&state="+uniqueState+"&login_hint="+email+"&redirect_uri="+loginAuth.redirectURL+"&client_id="+loginAuth.clientID;
        return authUrl;
    }else{
        //invalid email/uniqueState provided!!
        return "";
    }

};

//access token retrival 
auth.generateInitialAccessToken = (authCode) => new Promise((resolve,reject) => {
    
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
        client_id : loginAuth.clientID,
        client_secret : loginAuth.clientSecret,
        redirect_uri : loginAuth.redirectURL,
        grant_type : "authorization_code"
    };

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
            reject(error.message);
        });

        //send request
        accessTokenReq.end();

});


auth.refreshAccessToken = (refreshToken) => new Promise((resolve,reject) => {

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
        client_id : loginAuth.clientID,
        client_secret : loginAuth.clientSecret,
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
        reject(error.message);
    });

    //send request
    refAccessTokenReq.end();
});


//exporting the module
module.exports = {...auth};

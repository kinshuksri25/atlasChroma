//email module 

//Dependencies
const https = require("https");
const stringdecoder = require('string_decoder').StringDecoder;
const decoder = new stringdecoder('utf-8');

const {ERRORS,scopes} = require('../../../../lib/constants/dataConstants');

//declaring the module
const profile = {};

profile.getProfileDetails = accessToken => new Promise((resolve,reject) => {
    let requestUrl = scopes.PROFILE + "?access_token=" + accessToken;

    let profileDetailsRequest = https.request(requestUrl,function(response){
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

    //error checking
    profileDetailsRequest.on('error', (error) => {
        console.log(error.message);
        reject(ERRORS.ERR_GGLCONN_SVR);
    });

    //send request
    profileDetailsRequest.end();

});

//exporting the module
module.exports = {...profile};
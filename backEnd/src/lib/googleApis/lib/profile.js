//email module 

//Dependencies
const https = require("https");
const stringdecoder = require('string_decoder').StringDecoder;
const decoder = new stringdecoder('utf-8');

const {EMSG} = require ("../../../../../lib/constants/contants");

//declaring the module
const profile = {};

profile.getProfileDetails = (accessTokenObject,profileScope) => new Promise((resolve,reject) => {
    let requestUrl = profileScope + "?access_token=" + accessTokenObject.access_token;

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
        reject(EMSG.SVR_OATH_UNPRF);
    });

    //send request
    profileDetailsRequest.end();

});

//exporting the module
module.exports = {...profile};

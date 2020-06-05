/*
* OAuth Interface
*/

//Dependencies
const fs = require("fs");
const auth = require("./lib/auth");
const profile = require("./lib/profile");
const email = require("./lib/email");
const {OAuthCONST,EMSG} = require("../../../../lib/constants/contants");


//declaring the module
const googleApis = {};

//function for sending emails
//params --> senderEmail - string, recieverEmail - string/array, refreshToken - string, clientID - string, clientSecret - string, emailTemplate - object
//returns --> promise - boolean
googleApis.sendEmail = (senderEmail,recieverEmail,refreshToken,clientID,clientSecret,emailTemplate) => new Promise((resolve,reject) => {
   //get the template data
   fs.readFile(emailTemplate.templateLocation, function(error, data) {  
    if (error) {
        console.log(error);
        reject(false);
    } else { 
        //get access token 
        googleApis.getAccessToken(refreshToken).then(resolvedResult => {
            //send the email
            email.sendEmail(senderEmail,recieverEmail,refreshToken,clientID,clientSecret,emailTemplate.templateHeader,data,resolvedResult).then(resolvedResult => {
                resolve (true);
            }).catch(rejectedResult => {
                console.log(rejectedResult);
                throw EMSG.SVR_OAUTH_EMLERR;
            });
        }).catch(rejectedResult => {
            console.log(rejectedResult);
            reject(false);
        });
    }  
});   
});


//function for building google oauth url
//params --> userEmail,uniqueState
//returns --> promise - string
googleApis.buildAuthURL = (userEmail,uniqueState) => {
    let authURL = auth.buildAuthURL(userEmail,uniqueState,OAuthCONST.authUrlTemplate,OAuthCONST.scopeDetails,OAuthCONST.appAuth);
    return authURL;
};


//function for getting refresh/access tokens 
//params --> authCode - string
//returns --> promise - object
googleApis.getRefAccessToken = (authCode) => new Promise((resolve,reject) => {
    let authRequest = {
        "authCode" : authCode,
        "refreshTokenURL" : OAuthCONST.refreshTokenURL,
        "appAuthDetails" : OAuthCONST.appAuth
    };
    auth.tokenGeneration(authRequest).then(resolvedResult => {
        resolve (resolvedResult);  
    }).catch(rejectedResult => {
        console.log(rejectedResult);
        reject (EMSG.SVR_OAUTH_CONNERR);
    });
});

//function for getting access tokens 
//params --> refreshToken - string
//returns --> promise - object
googleApis.getAccessToken = (refreshToken) => new Promise((resolve,reject) => {
    let authRequest = {
        "refreshToken" : refreshToken,
        "refreshTokenURL" : OAuthCONST.refreshTokenURL,
        "appAuthDetails" : OAuthCONST.appAuth
    };
    auth.tokenGeneration(authRequest).then(resolvedResult => {
        resolve (resolvedResult);  
    }).catch(rejectedResult => {
        console.log(rejectedResult);
        reject (EMSG.SVR_OAUTH_CONNERR);
    });
});

//function for getting userProfile details from google 
//params --> refreshToken - string
//returns --> promise - object
googleApis.getUserDetails = (refreshToken) => new Promise((resolve,reject) => {
    //get access token 
    googleApis.getAccessToken(refreshToken).then(resolvedResult => {
        profile.getProfileDetails(resolvedResult,OAuthCONST.profileDetails).then(resolvedResult => {
            resolve (resolvedResult);
        }).catch(rejectedResult => {
            throw rejectedResult;
        });
    }).catch(rejectedResult => {
        console.log(rejectedResult);
        reject(EMSG.SVR_OAUTH_CONNERR);
    });
});


//exporting the module 
module.exports = googleApis;

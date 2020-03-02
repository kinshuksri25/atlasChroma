//Dependencies
const auth = require("");
const profile = require("");
const email = require("");
const CONSTANTS = require("");

//declaring the module
const googleApis = {};

googleApis.sendEmail = (senderEmail,recieverEmail,refreshToken,clientID,clientSecret,subject,data) = new Promise((resolve,reject) => {
    googleApis.getRefreshToken(refreshToken).then(resolvedResult => {
        email.sendEmail(senderEmail,recieverEmail,refreshToken,clientID,clientSecret,subject,data,resolvedResult).then(resolvedResult => {
            return (resolvedResult);
        }).catch(rejectedResult => {
          throw rejectedResult;
        });
    }).catch(rejectedResult => {
      reject(rejectedResult);
    });
});

googleApis.buildAuthURL = (userEmail,uniqueState) => {
    let authURL = auth.buildAuthURL(userEmail,uniqueState,CONSTANTS.authUrlTemplate,CONSTANTS.scopes,CONSTANTS.appAuth);
    return authURL;
};

googleApis.getAccessToken = (authCode) = new Promise((resolve,reject) => {
    auth.generateInitialAccessToken(authCode,CONSTANTS.refreshTokenURL,CONSTANTS.appAuth).then(resolvedResult => {
        return (resolveResult);  
    }).catch(rejectedResult => {
        return(rejectedResult);
    });
});

googleApis.getRefreshToken = (refreshToken) = new Promise((resolve,reject) => {
    auth.refreshAccessToken(refreshToken,CONSTANTS.refreshTokenURL,CONSTANTS.appAuth).then(resolvedResult => {
        return (resolveResult);  
    }).catch(rejectedResult => {
        return(rejectedResult);
    });
});

googleApis.getUserDetails = (accessToken) = new Promise((resolve,reject) => {
    profile.getProfileDetails(accessToken,CONSTANTS.scopes.PROFILE).then(resolvedResult => {
        return (resolvedResult);
    }).catch(rejectedResult => {
        return(rejectedResult);
    });
});


//exporting the module 
module.exports = googleApis;

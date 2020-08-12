/*
* Central Router for all prelogin routes
*/

//Dependencies
const loginHandler = require("./Handlers/loginhandlers");
const signupHandler = require("./Handlers/signupHandler");
const googleAuthHandler = require("./Handlers/googleAuthHandler");
const {EMSG,SMSG} = require("../../../../../lib/constants/contants");


//defining the module
const preLoginRouter = {};

//prelogin router
//params --> route -- string, requestObject -- object
//returns --> promise - object
preLoginRouter.router = (route,requestObject,io) => new Promise((resolve,reject) => {
    let chosenHandler = preLoginRouter.routes.hasOwnProperty(route) ? preLoginRouter.routes[route] : preLoginRouter.notFound;
    chosenHandler(requestObject,io).then(resolvedResult => {
        resolvedResult.STATUS = 200;
        resolve(resolvedResult);
    }).catch(rejectedResult => {
        reject(rejectedResult);
    });

});

//not-found handler
//params --> requestObject - object
//returns --> promise - object
preLoginRouter.notFound = (requestObject) => new Promise((resolve,reject) => {
    let response = {};
    response.STATUS = 404;
    response.EMSG = EMSG.SVR_HNDLS_RTNTFND;
    reject(response);
});


//prelogin routes
preLoginRouter.routes = {
    "/login": loginHandler.login,
    "/signup": signupHandler.signup,
    "/signup/userAvaliablity": signupHandler.userAvaliability,
    "/signup/postSignupDetails": signupHandler.postSignupDetails,
    "/googleAuth": googleAuthHandler.googleAuth, 
    "/googleAuth/postAuth": googleAuthHandler.postAuth,
    "/googleAuth/postAuthDetails": googleAuthHandler.postAuthDetails
};

//export the module
module.exports = preLoginRouter;

/*
* Central Router for all prelogin routes
*/

//Dependencies
const loginHandler = require("./Handlers/loginhandlers");
const signupHandler = require("./Handlers/signupHandler");
const googleAuthHandler = require("./Handlers/googleAuthHandler");
const responseObject = require("../../classObjects/responseClass");
const {EMSG,SMSG} = require("../../../../../lib/constants/contants");


//defining the module
const preLoginRouter = {};

//prelogin router
//params --> route -- string, requestObject -- object
//returns --> promise - object
preLoginRouter.router = (route,requestObject) => new Promise((resolve,reject) => {
    let chosenHandler = preLoginRouter.routes.hasOwnProperty(route) ? preLoginRouter.routes[route] : preLoginRouter.routes.notFound;
    chosenHandler(requestObject).then(resolvedResult => {
        console.log("resolved");
        console.log(resolvedResult);
        let response = new responseObject(resolvedResult.STATUS,resolvedResult.SMSG,resolvedResult.PAYLOAD,EMSG.NOERROR);
        resolve(response.getResponseObject());
    }).catch(rejectedResult => {
        console.log("rejected");
        console.log(rejectedResult);
        let response = new responseObject(rejectedResult.STATUS,SMSG.NOSUCCESS,{},rejectedResult.EMSG);
        reject(response.getResponseObject());
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
    "/googleAuth/postAuthDetails": googleAuthHandler.postAuthDetails,
    "/notFound": preLoginRouter.notFound
};

//export the module
module.exports = preLoginRouter;

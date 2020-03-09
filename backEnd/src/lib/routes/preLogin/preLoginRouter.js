/*
* Central Router for all prelogin routes
*/

//Dependencies
const loginHandler = require("./Handlers/loginhandlers");
const signupHandler = require("./Handlers/signupHandler");
const googleAuthHandler = require("./Handlers/googleAuthHandler");
const responseObject = require("../../classObjects/responseClass");
const {EMSG} = require("../../../../../lib/constants/contants");
const router = require("../centalRouter");


//defining the module
const preLoginRouter = {};

//prelogin router
//params --> route -- string, requestObject -- object
//returns --> promise - object
preLoginRouter.router = (route,requestObject) => new Promise((resolve,reject) => {

    let chosenHandler = preLoginRouter.routes.hasOwnProperty(route) ? preLoginRouter.routes[route] : preLoginRouter.routes.notFound;
    chosenHandler(requestObject).then(resolvedResult => {
        let response = new responseObject(resolvedResult.STATUS,resolvedResult.SMSG,resolvedResult.PAYLOAD,EMSG.NOERROR);
        resolve(response.getResponseObject());
    }).catch(rejectedResult => {
        let response = new responseObject(rejectedResult.STATUS,SMSG.NOSUCCESS,{},rejectedResult.EMSG);
        reject(response.getResponseObject());
    });

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
    "/notFound": router.notFound
};

//export the module
module.exports = preLoginRouter;

//Dependencies
const loginHandler = require("");
const signupHandler = require("");
const googleAuthHandler = require("");
const responseObject = require("");
const {MSG} = require("");

//defining the preLoginRouter object
const preLoginRouter = {};

//params --> route -- string, requestObject -- object
//returns --> promise(object)
preLoginRouter.router = (route,requestObject) = new Promise((resolve,reject) => {

    let chosenHandler = preLoginRouter.routes.hasOwnProperty(route) ? preLoginRouter.routes.handlers[route] : preLoginRouter.routes.handlers.notFound;
    chosenHandler(requestObject).then(resolvedResult => {
        let response = new responseObject(resolvedResult.STATUS,resolvedResult.SMSG,resolvedResult.PAYLOAD,0,MSG.EMSG.NOERROR);
        resolve(response.getResponseObject());
    }).catch(rejectedResult => {
        let response = new responseObject(0,MSG.SMSG.NOSUCCESS,"",rejectedResult.STATUS,rejectedResult.EMSG);
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
    "notFound": centralHandler.notFound
};

module.exports = preLoginRouter;
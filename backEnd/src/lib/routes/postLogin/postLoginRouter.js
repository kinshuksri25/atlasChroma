//Dependencies
const userHandler = require("");
const projectHandler = require("");
const responseObject = require("");
const {MSG} = require("");

//defining the postLoginRouter object
const postLoginRouter = {};

//params --> route -- string, requestObject -- object
//returns --> promise(object)
postLoginRouter.router = (route,requestObject) = new Promise((resolve,reject) => {

    let chosenHandler = postLoginRouter.routes.hasOwnProperty(route) ? postLoginRouter.routes.handlers[route] : postLoginRouter.routes.handlers.notFound;
    chosenHandler(requestObject).then(resolvedResult => {
        let response = new responseObject(resolvedResult.STATUS,resolvedResult.SMSG,resolvedResult.PAYLOAD,MSG.EMSG.NOERROR);
        resolve(response.getResponseObject());
    }).catch(rejectedResult => {
        let response = new responseObject(rejectedResult.STATUS,MSG.SMSG.NOSUCCESS,{},rejectedResult.EMSG);
        reject(response.getResponseObject());
    });

});

//prelogin routes
postLoginRouter.routes = {
 "/user" : userHandler.user,
 "/project" : projectHandler.project
};

module.exports = postLoginRouter;

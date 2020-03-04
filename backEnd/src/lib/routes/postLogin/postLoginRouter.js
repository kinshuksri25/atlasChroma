//Dependencies
const userHandler = require("./Handlers/userHandler");
const projectHandler = require("./Handlers/projectsHandler");
const responseObject = require("../../classObjects/responseClass");

//defining the module
const postLoginRouter = {};

//params --> route -- string, requestObject -- object
//returns --> promise(object)
postLoginRouter.router = (route,requestObject) = new Promise((resolve,reject) => {
      //check cookie availability
        if(requestObject.hasOwnProperty("cookieObject")){
            cookieHandler.checkCookie(requestObject.cookieObject).then(validCookie => {
                if(validCookie){
                    let chosenHandler = postLoginRouter.routes.hasOwnProperty(route) ? postLoginRouter.routes.handlers[route] : postLoginRouter.routes.handlers.notFound;
                    chosenHandler(requestObject).then(resolvedResult => {
                        let response = new responseObject(resolvedResult.STATUS,resolvedResult.SMSG,resolvedResult.PAYLOAD,MSG.EMSG.NOERROR);
                        resolve(response.getResponseObject());
                    }).catch(rejectedResult => {
                        let response = new responseObject(rejectedResult.STATUS,MSG.SMSG.NOSUCCESS,{},rejectedResult.EMSG);
                        reject(response.getResponseObject());
                    });
                }else{
                    let response = new responseObject(400,MSG.SMSG.NOSUCCESS,{},"INVALID COOKIE DATA FOUND");
                    reject(response);
                }
            }).catch(rejectedResult => {
                let response = new responseObject(500,MSG.SMSG.NOSUCCESS,{},rejectedResult);
                reject(response);
            });
        }else{
            let response = new responseObject(400,MSG.SMSG.NOSUCCESS,{},"COOKIE DATA NOT FOUND");
            reject(response);
        }
});

//postlogin routes
postLoginRouter.routes = {
 "/user" : userHandler.user,
 "/project" : projectHandler.project
};

//export the module
module.exports = postLoginRouter;

/*
* Central Router for all postlogin routes
*/

//Dependencies
const userHandler = require("./Handlers/userHandler");
const projectHandler = require("./Handlers/projectHandler");
const cookieHandler = require("../../utils/cookieHandler");
const responseObject = require("../../classObjects/responseClass");
const {EMSG,SMSG} = require("../../../../../lib/constants/contants");

//defining the module
const postLoginRouter = {};

//postlogin router
//params --> route -- string, requestObject -- object
//returns --> promise(object)
postLoginRouter.router = (route,requestObject) => new Promise((resolve,reject) => {
     
    cookieHandler.checkCookie(requestObject.cookieObject).then(validCookie => {
        if(validCookie){
            let chosenHandler = postLoginRouter.routeChecker(route);
            chosenHandler(route,requestObject).then(resolvedResult => {
                let response = new responseObject(resolvedResult.STATUS,resolvedResult.SMSG,resolvedResult.PAYLOAD,EMSG.NOERROR);
                resolve(response.getResponseObject());
            }).catch(rejectedResult => {
                let response = new responseObject(rejectedResult.STATUS,SMSG.NOSUCCESS,{},rejectedResult.EMSG);
                reject(response.getResponseObject());
            });
        }else{
            let response = new responseObject(400,MSG.SMSG.NOSUCCESS,{},EMSG.SVR_HNDLS_INDLCKIE);
            reject(response);
        }
    }).catch(rejectedResult => {
        let response = new responseObject(500,MSG.SMSG.NOSUCCESS,{},rejectedResult);
        reject(response);
    });
});

//route checker function
//params --> route - string
//returns --> chosenHandler - function 
postLoginRouter.routeChecker = (route) => {

    route = route.subString(1);
    let index = route.indexOf("/");
    route = index != -1 ? "/"+route.subString(0,index) : "/"+route;
    //select the correct router
    let chosenHandler = postLoginRouter.routes.hasOwnProperty(route) ? postLoginRouter.routes[route] : postLoginRouter.routes.notFound;
    return chosenHandler;
};

//not-found handler
//params --> route - string,requestObject - object
//returns --> promise - object
postLoginRouter.notFound = (route,requestObject) => new Promise((resolve,reject) => {
    let response = {};
    response.STATUS = 404;
    response.EMSG = EMSG.SVR_HNDLS_RTNTFND;
    reject(response);
});

//postlogin routes
postLoginRouter.routes = {
 "/user" : userHandler.user,
 "/project" : projectHandler.project,
 "/notFound": postLoginRouter.notFound
};

//export the module
module.exports = postLoginRouter;

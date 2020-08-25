/*
* Central Router for all postlogin routes
*/

//Dependencies
const userHandler = require("./Handlers/userHandler");
const projectHandler = require("./Handlers/projectHandler");
const cookieHandler = require("../../utils/cookieHandler");
const storyHandler = require("./Handlers/storiesHandler");
const notesHandler = require("./Handlers/notesHandler");
const eventHandler = require("./Handlers/eventHandler");
const {EMSG,SMSG} = require("../../../../../lib/constants/contants");


//defining the module
const postLoginRouter = {};

//postlogin router
//params --> route -- string, requestObject -- object
//returns --> promise(object)
postLoginRouter.router = (route,requestObject,io) => new Promise((resolve,reject) => {
    cookieHandler.getCookie(requestObject.cookieid).then(validCookie => {
        if(validCookie){
            let chosenHandler = postLoginRouter.routeChecker(route);
            chosenHandler(route,requestObject,io).then(resolvedResult => {
                resolvedResult.STATUS = 200;
                resolve(resolvedResult);
            }).catch(rejectedResult => {
                reject(rejectedResult);
            });
        }else{
            let response = {
                STATUS : 400,
                EMSG : EMSG.SVR_HNDLS_INDLCKIE,
                PAYLOAD : {},
            };
            reject(response);
        }
    }).catch(rejectedResult => {
        let response = {
            STATUS : 500,
            EMSG : rejectedResult,
            PAYLOAD : {},
        };
        reject(response);
    });
});

//route checker function
//params --> route - string
//returns --> chosenHandler - function 
postLoginRouter.routeChecker = (route) => {

    route = route.substring(1);
    let index = route.indexOf("/");
    route = index != -1 ? "/"+route.substring(0,index) : "/"+route;
    //select the correct router
    let chosenHandler = postLoginRouter.routes.hasOwnProperty(route) ? postLoginRouter.routes[route] : postLoginRouter.notFound;
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
 "/stories" : storyHandler.stories,
 "/event" : eventHandler.event,
 "/notes" : notesHandler.notes
};

//export the module
module.exports = postLoginRouter;

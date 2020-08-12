/*
* Central Router for the backend 
*/

//Dependencies
const preLoginRouter = require("./preLogin/preLoginRouter");
const postLoginRouter = require("./postLogin/postLoginRouter");

//defining the module
const router = {};

//central router for entire backend
//params --> route -- string, requestObject -- object
//returns --> promise - object
router.centralRouter = (route,requestObject,io) => new Promise((resolve,reject) => {
     //check cookie availability
     if(!requestObject.hasOwnProperty("cookieid")){
        //prelogin
        preLoginRouter.router(route,requestObject,io).then(resolvedResult => {
            resolve(resolvedResult);
        }).catch(rejectedResult => { 
            reject(rejectedResult);
        });
    }else{
         //postlogin
         postLoginRouter.router(route,requestObject,io).then(resolvedResult => {
            resolve(resolvedResult);
        }).catch(rejectedResult => { 
                reject(rejectedResult);
        });
    }
}); 

//export the module
module.exports = router;

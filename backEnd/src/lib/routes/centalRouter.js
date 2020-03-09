/*
* Central Router for the backend 
*/

//Dependencies
const preLoginRouter = require("./preLogin/preLoginRouter");
const postLoginRouter = require("./postLogin/postLoginRouter");
const {EMSG} = require("../../../../lib/constants/contants");

//defining the module
const router = {};

//central router for entire backend
//params --> route -- string, requestObject -- object
//returns --> promise - object
router.centralRouter = (route,requestObject) => new Promise((resolve,reject) => {

    let loginRegex = new RegExp("/\/login\/*/i");
    let signupRegex = new RegExp("/\/signup\/*/i");
    let googleAuthRegex = new RegExp("/\/googleAuth\/*/i");
    if(loginRegex.test(route)  || signupRegex.test(route) || googleAuthRegex.test(route)){
        //prelogin
        preLoginRouter.router(route,requestObject).then(resolvedResult => {
            resolve(resolvedResult);
        }).catch(rejectedResult => { 
            reject(rejectedResult);
        });

    }else{
        //postlogin
          postLoginRouter.router(route,requestObject).then(resolvedResult => {
                resolve(resolvedResult);
          }).catch(rejectedResult => { 
                reject(rejectedResult);
          });
       }

}); 

router.notFound = (requestObject) => new Promise((resolve,reject) => {
    let response = {};
    response.STATUS = 404;
    response.EMSG = EMSG.SVR_HNDLS_RTNTFND;
    reject(response);
});

//export the module
module.exports = router;

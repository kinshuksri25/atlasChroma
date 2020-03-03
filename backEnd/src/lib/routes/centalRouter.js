
//Dependencies
const preLoginRouter = require("");
const postLoginRouter = require("");
const cookieHandler = require("");

//defining the router object
const router = {};

//params --> route -- string, requestObject -- object
//returns --> promise(object)
router.router = (route,requestObject) => new Promise((resolve,reject) => {

    let loginRegex = "";
    let signupRegex = "";
    let googleAuthRegex = "";
    if(loginRegex.test(route)  || signupRegex.test(route) || googleAuthRegex.test(route)){
        //prelogin
        preLoginRouter.router(route,requestObject).then(resolvedResult => {
            resolve(resolvedResult);
        }).catch(rejectedResult => { 
            reject(rejectedResult);
        });

    }else{
        //postlogin
        //check cookie availability
        if(requestObject.hasOwnProperty("cookieObject")){
            cookieHandler.checkCookie(requestObject.cookieObject).then(validCookie => {
                postLoginRouter(route,requestObject).then(resolvedResult => {
                    resolve(resolvedResult);
                }).catch(rejectedResult => {
                    reject(rejectedResult);
                });
            }).catch(invalidCookie => {
                //send to login page
                reject(invalidCookie);
            });
        }else{
            //send to login page
            reject(rejectedResult);
        }
    }

});

module.exports = router;

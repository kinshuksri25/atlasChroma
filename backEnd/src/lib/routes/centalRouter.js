
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
        let response = {};
        if(requestObject.hasOwnProperty("cookieObject")){
            cookieHandler.checkCookie(requestObject.cookieObject).then(validCookie => {
                if(validCookie){
                    postLoginRouter(route,requestObject).then(resolvedResult => {
                        resolve(resolvedResult);
                    }).catch(rejectedResult => {
                        reject(rejectedResult);
                    });
                }else{
                    response.STATUS = 400;
                    response.EMSG = "INVALID COOKIE DATA FOUND";
                    //send to login page
                    reject(response);
                }
            }).catch(rejectedResult => {
                response.STATUS = 500;
                response.EMSG = rejectedResult;
                //send to login page
                reject(response);
            });
        }else{
            response.STATUS = 400;
            response.EMSG = "COOKIE NOT FOUND";
            //send to login page
            reject(response);
        }
    }

});

module.exports = router;

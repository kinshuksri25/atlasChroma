
//Dependencies
const preLoginRouter = require("");
const postLoginRouter = require("");

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
        //check session validity
    }

});

module.exports = router;

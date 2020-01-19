//main routing logic

//Dependencies
const fs = require('fs');
const mongo = require('./data');
const {buildAuthURL,generateInitialAccessToken} = require('./googleApis/auth');
const encryptionAPI = require('./encryptionAPI');
const sessionHandler = require('./sessionHandler');
const {userObject} = require('../../../lib/constants/objectConstants');
const {dbConstants,ERRORS,senderEmail,emailCredentials,loginAuth,SINGLE,MULTIPLE} = require('../../../lib/constants/dataConstants');
const {sendEmail} = require('./googleApis/email');

//handler object definition
const handlers = {};

//signup route
//method = POST
//params --> requestObject -- object
handlers.signup = (requestObject) => new Promise((resolve,reject) => {

    if(requestObject.reqBody.hasOwnProperty('UserName') && requestObject.reqBody.hasOwnProperty('Email') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.method == "POST"){

        //set userObject 
        let signUpUserObject = {...userObject};
        signUpUserObject._id = handlers.randomNumberGen(15);
        signUpUserObject.Email = requestObject.reqBody.Email;
        signUpUserObject.UserName = requestObject.reqBody.UserName;
        signUpUserObject.Password = encryptionAPI.hash(requestObject.reqBody.Password);

        //save the user details
        mongo.insert(dbConstants.userCollection, signUpUserObject, {}).then(insertResult => {

            //setup the login object
            let loginObject = {
                reqBody : {},
                method : "POST",
                queryObject: {}
            };
            let subject = "Welcome to Atlas Chroma";
            loginObject.reqBody.Email = requestObject.reqBody.Email;
            loginObject.reqBody.Password = requestObject.reqBody.Password;

            //call the login function to log user in
            handlers.login(loginObject).then(result => {
                //TODO --> need to handle reject use cases
                fs.readFile('/home/kinshuk/Documents/projects/Projects/atlasChroma/backEnd/src/lib/emailTemplate/welcome.html', function(error, data) {  
                    if (error) {
                        console.log(error);
                        reject(ERRORS.ERR_SNDEML_SVR);
                    } else {  
                        //send welcome mail
                        sendEmail(senderEmail,requestObject.reqBody.Email,emailCredentials.refreshToken,loginAuth.clientID,loginAuth.clientSecret,subject,data).then(resolveResult => {   
                            //send the response 
                            resolve(result);       
                        }).catch(error => {
                            reject(error);
                        }); 
                    }  
                });              
            }).catch(error =>{
                console.log(error);
                reject(ERRORS.ERR_DBCONN_SVR);
            }); 
        }).catch(error => {
            console.log(error);
            reject(ERRORS.ERR_DBCONN_SVR);
        });           
    }else{
        reject(ERRORS.ERR_INVREQOBJ_SVR);
    }

});

//log in route
//method = POST
//params --> requestObject -- object
handlers.login = (requestObject) => new Promise((resolve,reject) => {

    //check the requestobject
    if(requestObject.reqBody.hasOwnProperty('Email') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.method == "POST"){
        
        //check email validity
        mongo.read(dbConstants.userCollection,{ Email: requestObject.reqBody.Email }, { projection: { Email: 1, Password:1, _id:1 } }).then(resultSet => {
            if (JSON.stringify(resultSet) != JSON.stringify([])) {  
                //check password validity
                if(resultSet[0].Password === encryptionAPI.hash(requestObject.reqBody.Password)){
                    
                    //set userSession
                     let sessionObject = sessionHandler.createSession(resultSet[0]._id);

                    //send the userSession back
                     resolve(sessionObject);   
                }else{
                    reject(ERRORS.ERR_INVPASS_SVR);
                }    
            }else{
                reject(ERRORS.ERR_INVEML_SVR);
            } 
        }).catch(error => {
            console.log(error);
            reject(ERRORS.ERR_DBCONN_SVR);
        });       
    }else{
        reject(ERRORS.ERR_INVREQOBJ_SVR);   
    }
});

//checkEmail route
//method = GET
//params --> requestObject -- object
handlers.checkEmail = (requestObject) => new Promise((resolve,reject) => {
    //check requestObject
    if(requestObject.queryObject.Email != undefined && requestObject.method == "GET"){
        //check email validity
        mongo.read(dbConstants.userCollection,{ Email: requestObject.queryObject.Email }, {}).then(resultSet => {  
            if (JSON.stringify(resultSet) == JSON.stringify([])) {    
                //return response
                resolve(true);   
            }else{
                reject(ERRORS.ERR_EXEML_SVR);
            }
        }).catch(error => {
            console.log(error);
            reject(ERRORS.ERR_DBCONN_SVR);
        });       
    }else{
        reject(ERRORS.ERR_INVREQOBJ_SVR);  
    }
});

//checkUserName route
//method = GET
//params --> requestObject -- object
handlers.checkUserName = (requestObject) => new Promise((resolve,reject) => {
    
    //check requestObject
    if(requestObject.queryObject.UserName != undefined && requestObject.method == "GET"){

        //check userName validity
        mongo.read(dbConstants.userCollection,{ UserName: requestObject.queryObject.UserName }, {}).then(resultSet => {
            if (JSON.stringify(resultSet) == JSON.stringify([])) {    
                //return response
                resolve(true);    
            }else{
                reject(ERRORS.ERR_EXUSR_SVR);
            }
        }).catch(error => { 
            console.log(error);
            reject(ERRORS.ERR_DBCONN_SVR);
        });
    }else{
        reject(ERRORS.ERR_INVREQOBJ_SVR); 
    }
});


//postAuth route
//method = POST
//params --> requestObject -- object
handlers.postAuth = (requestObject) => new Promise((resolve,reject) => {
    let responseObject = {};
    let subject = "Welcome to Atlas Chroma";
    //check the state
     mongo.read(dbConstants.userCollection,{ State: requestObject.reqBody.state }, {}).then(resultSet => {
        if(requestObject.reqBody.code != undefined && requestObject.reqBody.error == undefined){
            if (JSON.stringify(resultSet) != JSON.stringify([])){
                //get refresh token
                generateInitialAccessToken(requestObject.reqBody.code).then(refreshTokenObject => {
                    if(refreshTokenObject.refresh_token == undefined){
                        //check for new user 
                        if(resultSet[0].Password == ""){
                        responseObject.newUser = true;
                        fs.readFile('/home/kinshuk/Documents/projects/Projects/atlasChroma/backEnd/src/lib/emailTemplate/welcome.html', function(error, data) {  
                            if (error) {  
                                console.log(error);
                                reject(ERRORS.ERR_SNDEML_SVR);
                            } else {  
                                //send welcome mail
                                sendEmail(senderEmail,resultSet[0].Email,emailCredentials.refreshToken,loginAuth.clientID,loginAuth.clientSecret,subject,data).then(resolveResult => {                           
                                    //send the response 
                                    resolve(result);       
                                }).catch(error => {
                                    reject(error);
                                }); 
                            }  
                        });
                        }else{
                                responseObject.newUser = false;
                            }
                        //set userSession
                        responseObject.sessionObject = sessionHandler.createSession(resultSet[0]._id);
                        //send the userSession back
                        resolve(responseObject); 
                    }else{
                        //save refreshToken
                        mongo.update(dbConstants.userCollection, { _id: resultSet[0]._id }, { $set: { RefreshToken: refreshTokenObject.refresh_token } }, {}, SINGLE).then(updateSet => {
                            //check for new user 
                            if(resultSet[0].Password == ""){
                                responseObject.newUser = true;
                                //TODO --> need to handle reject use cases
                                fs.readFile('/home/kinshuk/Documents/projects/Projects/atlasChroma/backEnd/src/lib/emailTemplate/welcome.html', function(error, data) {  
                                    if (error) {  
                                        console.log(error);
                                        reject(ERRORS.ERR_SNDEML_SVR);
                                    } else {  
                                        //send welcome mail
                                        sendEmail(senderEmail,resultSet[0].Email,emailCredentials.refreshToken,loginAuth.clientID,loginAuth.clientSecret,subject,data).then(resolveResult => {                           
                                            //send the response 
                                            resolve(result);       
                                        }).catch(error => {
                                            reject(error);
                                        }); 
                                    }  
                                });
                            }else{
                                responseObject.newUser = false;
                            }
                            //set userSession
                            responseObject.sessionObject = sessionHandler.createSession(resultSet[0]._id);
                            //send the userSession back
                            resolve(responseObject);  
                        }).catch(error => {
                            console.log(error);
                            reject(ERRORS.ERR_GGLCONN_SVR); 
                        });       
                    }
                }).catch(error => {
                    console.log(error);
                    reject(ERRORS.ERR_GGLCONN_SVR); 
                });  
                
            }else{
                reject(ERRORS.ERR_SEC_SVR);
            }
        }else{
            //delete the user data 
            resultSet[0].Password == "" && mongo.delete(dbConstants.userCollection, { State: requestObject.reqBody.state }, {}, SINGLE).then(updateSet => {
                reject(ERRORS.ERR_PERMDEND_SVR);
            }).catch(error => {
                //TODO --> add scheduler to handle this user case
                console.log(error);
                reject(ERRORS.ERR_GGLCONN_SVR); 
            });
            resultSet[0].Password != "" && mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { RefreshToken: "" } }, {}, SINGLE).then(updateSet => {
                reject(ERRORS.ERR_PERMDEND_SVR);
            }).catch(error => {
                //TODO --> add scheduler to handle this user case
                console.log(error);
                reject(ERRORS.ERR_GGLCONN_SVR); 
            });
        }     
    }).catch(error => {
        reject(ERRORS.ERR_INVREQOBJ_SVR); 
    }); 
});

//googleLogin route
//method = GET
//params --> requestObject -- object
handlers.googleLogin = (requestObject) => new Promise((resolve,reject) => {
    let state = handlers.randomNumberGen(7);
    let authURL = "";
    //check the request object
    if(requestObject.queryObject.Email != undefined && requestObject.method == "GET"){

        mongo.read(dbConstants.userCollection,{ Email: requestObject.queryObject.Email }, {}).then(resultSet => {

            //check if user exists
            if (JSON.stringify(resultSet) == JSON.stringify([])) {
                //set user object
                let googleSignUpUserObject = {...userObject};
                googleSignUpUserObject._id = handlers.randomNumberGen(15);
                googleSignUpUserObject.Email = requestObject.queryObject.Email;
                googleSignUpUserObject.State = state;
                //save user credentials 
                mongo.insert(dbConstants.userCollection, googleSignUpUserObject, {}).then(insertResult => {
                    
                    //build auth url
                    authURL = buildAuthURL(requestObject.queryObject.Email,state);  
                    //send the response
                    resolve(authURL); 
                    
                }).catch(error => {
                    console.log(error);
                    reject(ERRORS.ERR_GGLCONN_SVR);
                });
            } else{
                mongo.update(dbConstants.userCollection, { _id: resultSet[0]._id }, { $set: { State: state } }, {}, SINGLE).then(updateSet => {
                    //build auth url
                    authURL = buildAuthURL(requestObject.queryObject.Email,state);
                    //send the response
                    resolve(authURL);    

                }).catch(error => {
                    console.log(error);
                    reject(ERRORS.ERR_GGLCONN_SVR);
                });
            }
        }).catch(error => {
            console.log(error);
            reject(ERRORS.ERR_GGLCONN_SVR);  
        });
    }else{
        reject(ERRORS.ERR_INVREQOBJ_SVR); 
    }
});


//notFound route
handlers.notFound = (requestObject) => new Promise((resolve,reject) => {
    reject(ERRORS.ERR_INVRUT_SVR);
});


//unique random number generator
handlers.randomNumberGen = (length) => {
    let randomNum= "";
    
    for(let i = 0 ; i <= length ; i++)
    randomNum+= Math.floor((Math.random() * 10) + 1);

    return randomNum; 
};

//export the module
module.exports = handlers;
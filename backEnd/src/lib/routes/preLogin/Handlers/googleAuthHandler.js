/*
* OAuth Handler
*/

//Dependencies
const mongo = require("../../../utils/data");
const encryptionAPI = require("../../../utils/encryptionAPI");
const cookieHandler = require("../../../utils/cookieHandler");
const {randValueGenerator} = require("../../../utils/helper");
const user = require("../../../classObjects/userClass");
const googleApis = require("../../../googleApis/googleAPI");
const {DBCONST,EMSG,SMSG,OAuthCONST,EMAILTEMPLATES,SINGLE} = require("../../../../../../lib/constants/contants");

//declaring the module
let googleAuthHandler = {};


//oauth url creation handler
//params --> requestObject -- object
//return --> promise - object
googleAuthHandler.googleAuth = (requestObject,io) => new Promise((resolve,reject) => {

    let state = randValueGenerator(15);
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };  
    //check the request object
    if(requestObject.queryObject.Email != undefined && requestObject.method == "GET"){
        mongo.read(DBCONST.userCollection,{ email: requestObject.queryObject.Email }, {projection : {userName : 1,state:1}}).then(resultSet => {
            //check if user exists
            if (JSON.stringify(resultSet) == JSON.stringify([])) {
                //set user object
                let googleSignUpUserObject = new user({_id : randValueGenerator(),email : requestObject.queryObject.Email,state : state});          
                //save user credentials 
                mongo.insert(DBCONST.userCollection, googleSignUpUserObject, {}).then(insertSet => {
                    
                    //build auth url
                    response.STATUS = 200;
                    response.SMSG = SMSG.SVR_OATH_NURLSUC;
                    response.PAYLOAD.authURL =  googleApis.buildAuthURL(requestObject.queryObject.Email,state); 
                    //send the response
                    resolve(response); 
                    
                }).catch(error => {
                    throw error;
                });
            } else {
                mongo.update(DBCONST.userCollection, { _id: resultSet[0]._id }, { $set: { state: state } }, {}, SINGLE).then(updateSet => {
                    
                    //build auth url
                    response.STATUS = 200;
                    response.SMSG = SMSG.SVR_OATH_URLSUC;
                    response.PAYLOAD.authURL =  googleApis.buildAuthURL(requestObject.queryObject.Email,state); 
                    //send the response
                    resolve(response);    

                }).catch(error => {
                    throw error;
                });
            }
        }).catch(error => {
            response.STATUS = 500;
            response.EMSG = error;
            reject(response);
        });
    }else{
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        response.STATUS = 400;
        reject(response);   
    }
});

//post auth handler
//params --> requestObject -- object
//return --> promise - object
googleAuthHandler.postAuth = (requestObject,io) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
    };
    if(requestObject.reqBody.hasOwnProperty("state") && requestObject.method == "POST"){
        mongo.read(DBCONST.userCollection,{ state: requestObject.reqBody.state }, {}).then(resultSet => {
            let templateObject = {
                userName : resultSet[0].email.toUpperCase(),
                supportEmail : OAuthCONST.appAuth.senderEmail
            };
            if(requestObject.reqBody.code != undefined && requestObject.reqBody.error == undefined){
                if (JSON.stringify(resultSet) != JSON.stringify([])){
                    if(resultSet[0].refreshToken == ""){
                        //get access_token
                        googleApis.getRefAccessToken(requestObject.reqBody.code).then(refreshTokenObject => {
                            //check for new user 
                            if(resultSet[0].password == "" && resultSet[0].username == ""){
                                //send welcome mail
                                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,resultSet[0].email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.WELCOMEMAIL,templateObject).catch(error => {
                                    let payload = {
                                        "participants" : [resultSet[0].email],
                                        "template" : "WELCOMEMAIL",
                                        "templateData" : {...templateObject}
                                    };
                                    mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                                });  
                                googleApis.getUserDetails(refreshTokenObject.refresh_token).then(result => {
                                    mongo.update(DBCONST.userCollection, { state: requestObject.reqBody.state }, { $set: { firstname: result.given_name, lastname: result.family_name, refreshToken: refreshTokenObject.refresh_token}}, {}, SINGLE).then(updateSet => {
                                        response.SMSG = SMSG.SVR_OATH_LGNSUC;
                                        response.STATUS = 200;
                                        resolve(response);
                                    }).catch(error => {
                                        throw error;
                                    });
                                }).catch(reject => {
                                    response.STATUS = 500;
                                    response.EMSG = EMSG.SVR_OATH_LGNUSUC;
                                    reject(response);
                                });
                            }else{
                                //TODO --> handle condition to check fname and lname
                                //set userSession
                                cookieHandler.createCookies(resultSet[0]._id,resultSet[0].username).then(resolvedResult => {
                                     //save the user details
                                     googleApis.getUserDetails(refreshTokenObject.refresh_token).then(result => {
										mongo.update(DBCONST.userCollection, { state: requestObject.reqBody.state }, { $set: { firstname: result.given_name, lastname: result.family_name, refreshToken: refreshTokenObject.refresh_token}}, {}, SINGLE).then(updateSet => {
											response.PAYLOAD.uniqueID = resolvedResult;
											response.SMSG = SMSG.SVR_OATH_LGNSUC;
											response.STATUS = 200;
											resolve(response);
										}).catch(error => {
											throw error;
										});
									}).catch(reject => {
										throw reject;
									});
								}).catch(rejectedResult =>{
                                    throw rejectedResult;
								});
                            }
                        }).catch(error => {
                            console.log(error);
                            response.STATUS = 500;
                            response.EMSG = error;
                            reject(response);
                        });       
                    }else{      
                        //check for new user 
                        if(resultSet[0].password == "" && resultSet[0].username == ""){
                            //send welcome mail
                            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,resultSet[0].email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.WELCOMEMAIL,templateObject).catch(error => {
                                let payload = {
                                    "participants" : [resultSet[0].email],
                                    "template" : "WELCOMEMAIL",
                                    "templateData" : {...templateObject}
                                };
                                mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                            }); 
                            googleApis.getUserDetails(resultSet[0].refreshToken).then(result => {
                                mongo.update(DBCONST.userCollection, { state: requestObject.reqBody.state }, { $set: { firstname: result.given_name, lastname: result.family_name}}, {}, SINGLE).then(updateSet => {
                                    response.PAYLOAD = {};
                                    response.SMSG = SMSG.SVR_OATH_LGNSUC;
                                    response.STATUS = 200;
                                    resolve(response);
                                }).catch(error => {
                                    throw error;    
                                });
                            }).catch(reject => {
                                response.STATUS = 500;
                                response.EMSG = EMSG.SVR_OATH_LGNUSUC;
                                reject(response);
                            });
                        }else{
                            //set userSession
                            cookieHandler.createCookies(resultSet[0]._id,resultSet[0].username).then(resolvedResult => {
                                response.PAYLOAD.uniqueID = resolvedResult;
                                response.SMSG = SMSG.SVR_OATH_LGNSUC;
                                response.STATUS = 200;
                                resolve(response);
                            }).catch(rejectedResult =>{
                                console.log(rejectedResult);
                                response.STATUS = 500;
                                response.EMSG = rejectedResult;
                                reject(response);
                            });
                        }      
                    }        
                }else{
                    response.EMSG = EMSG.SVR_HNDLS_INREQ;
                    response.STATUS = 400; 
                    reject(response);
                }
            }else{
                //delete the user data 
                resultSet[0].password == "" && mongo.delete(DBCONST.userCollection, { state: requestObject.reqBody.state }, {}, SINGLE).then(updateSet => {
                    response.STATUS = 400;
                    response.EMSG = EMSG.SVR_OATH_LGNDND;
                    reject(response);
                }).catch(error => {
                    response.STATUS = 500;
                    response.EMSG = error;
                    reject(response);
                });
                resultSet[0].password != "" && mongo.update(DBCONST.userCollection, { state: requestObject.reqBody.state }, { $set: { refreshToken: "" } }, {}, SINGLE).then(updateSet => {
                    response.STATUS = 400;
                    response.EMSG = EMSG.SVR_OATH_LGNDND;
                    reject(response);
                }).catch(error => {
                    response.STATUS = 500;
                    response.EMSG = error;
                    reject(response);
                });
            }     
        }).catch(error => {
            response.STATUS = 500;
            response.EMSG = error;
            reject(response); 
        }); 
    }else{
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        response.STATUS = 400;
        reject(response);   
    }
});

//post auth form handler
//params --> requestObject -- object
//return --> promise - object
googleAuthHandler.postAuthDetails = (requestObject,io) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    //check the requestObject
    if(requestObject.reqBody.hasOwnProperty('state') && requestObject.reqBody.hasOwnProperty('UserName') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.reqBody.hasOwnProperty('Phone') && requestObject.reqBody.hasOwnProperty('ProfilePhoto') && requestObject.method == "POST"){
         //check state validity
         let encryptedPassword = encryptionAPI.hash(requestObject.reqBody.Password);
         mongo.update(DBCONST.userCollection, { state: requestObject.reqBody.state }, { $set: { username: requestObject.reqBody.UserName, password: encryptedPassword, phonenumber: requestObject.reqBody.Phone, photo : requestObject.reqBody.ProfilePhoto}}, {returnOriginal: false}, SINGLE).then(updateSet => {
            if(JSON.stringify(updateSet.value) != JSON.stringify({})){
                requestObject.reqBody.Password = encryptionAPI.hash(requestObject.reqBody.Password);
                updateSet = {...updateSet.value};
                let updatedUser = {
                    username : updateSet.username,
                    firstname : updateSet.firstname,
                    lastname : updateSet.lastname,
                    email : updateSet.email
                };
                io.emit("updatingDetails",{event : "addingUser", data : updatedUser});
                cookieHandler.createCookies(updateSet._id,updateSet.username).then(resolvedResult => {
                    response.PAYLOAD =resolvedResult;
                    response.SMSG = SMSG.SVR_OATH_LGNSUC;
                    response.STATUS = 200;
                    resolve(response);
                }).catch(rejectedResult => {
                    response.EMSG = rejectedResult;
                    response.STATUS = 400;
                    response.PAYLOAD = {};
                    reject(response);
                });
            }else{
                response.STATUS = 400;
                response.EMSG = EMSG.SVR_OATH_INST;
                response.PAYLOAD = {};
                reject(response);
            }
         }).catch(error => {
            response.STATUS = 500;
            response.EMSG = error;
            response.PAYLOAD = {};
            reject(response);
         });

    }else{
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        response.STATUS = 400;
        reject(response);   
    }
});

//exporting the module
module.exports = googleAuthHandler;

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
const {EMSG,SMSG,OAuthCONST,EMAILTEMPLATES,SINGLE} = require("../../../../../../lib/constants/contants");

//declaring the module
let googleAuthHandler = {};


//oauth url creation handler
//params --> requestObject -- object
//return --> promise - object
googleAuthHandler.googleAuth = (requestObject) = new Promise((resolve,reject) => {

    let state = randValueGenerator(15);
    let response = {};
    //check the request object
    if(requestObject.queryObject.Email != undefined && requestObject.method == "GET"){

        mongo.read(dbConstants.userCollection,{ Email: requestObject.queryObject.Email }, {}).then(resultSet => {

            //check if user exists
            if (JSON.stringify(resultSet) == JSON.stringify([])) {
                //set user object
                let googleSignUpUserObject = new user(_id = randValueGenerator(),Email = requestObject.reqBody.Email,state = state);          
                //save user credentials 
                mongo.insert(dbConstants.userCollection, googleSignUpUserObject, {}).then(insertSet => {
                    
                    //TODO --> add google interface
                    //build auth url
                    response.STATUS = 200;
                    response.SMSG = EMSG.SVR_OATH_NURLSUC;
                    response.PAYLOAD.authURL =  googleApis.buildAuthURL(requestObject.queryObject.Email,state); 
                    //send the response
                    resolve(authURL); 
                    
                }).catch(error => {
                    throw error;
                });
            } else {
                mongo.update(dbConstants.userCollection, { _id: resultSet[0]._id }, { $set: { State: state } }, {}, SINGLE).then(updateSet => {
                    
                    //TODO --> add google interface
                    //build auth url
                    response.STATUS = 200;
                    response.SMSG = EMSG.SVR_OATH_URLSUC;
                    response.PAYLOAD.authURL =  googleApis.buildAuthURL(requestObject.queryObject.Email,state); 
                    //send the response
                    resolve(authURL);    

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
googleAuthHandler.postAuth = (requestObject) = new Promise((resolve,reject) => {
    let response = {};
    if(requestObject.reqBody.state != undefined && requestObject.reqBody.method == "POST"){
        mongo.read(dbConstants.userCollection,{ State: requestObject.reqBody.state }, {}).then(resultSet => {
            if(requestObject.reqBody.code != undefined && requestObject.reqBody.error == undefined){
                if (JSON.stringify(resultSet) != JSON.stringify([])){
                    if(resultSet[0].RefreshToken == ""){
                        //get access_token
                        googleApis.getRefAccessToken(requestObject.reqBody.code).then(refreshTokenObject => {
                            //check for new user 
                            if(resultSet[0].Password == "" && resultSet[0].UserName == ""){
                                //send welcome mail
                                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.Email,OAuthCONST.appAuth.refreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.WELCOMEMAIL).then(resolveResult => { 
                                    googleApis.getUserDetails(resultSet[0].RefreshToken).then(result => {
                                        mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { FirstName: result.given_name, LastName: result.family_name, RefreshToken: refreshTokenObject.refresh_token}}, {}, SINGLE).then(updateSet => {
                                            response.PAYLOAD.cookieDetails = resolvedResult;
                                            response.SMSG = SMSG.SVR_OATH_LGNSUC;
                                            response.STATUS = 200;
                                            resolve(response);
                                        }).catch(error => {
                                            throw error;
                                        });
                                    }).catch(reject => {
                                        throw reject;
                                    });
                                }).catch(error => {
                                    console.log(error);
                                    response.STATUS = 500;
                                    response.EMSG = EMSG.SVR_OATH_LGNUSUC;
                                    reject(response);
                                });  
                            }else{
                                //set userSession
                                cookieHandler.createCookies(resultSet[0]._id,resultSet[0].UserName).then(resolvedResult => {
									 //save the user details
                                     googleApis.getUserDetails(resultSet[0].RefreshToken).then(result => {
										mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { FirstName: result.given_name, LastName: result.family_name}}, {}, SINGLE).then(updateSet => {
											response.PAYLOAD.cookieDetails = resolvedResult;
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
                        if(resultSet[0].Password == "" && resultSet[0].UserName == ""){
                            //send welcome mail
                            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.Email,OAuthCONST.appAuth.refreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.WELCOMEMAIL).then(resolveResult => {  
                                googleApis.getUserDetails(resultSet[0].RefreshToken).then(result => {
                                    mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { FirstName: result.given_name, LastName: result.family_name}}, {}, SINGLE).then(updateSet => {
                                        response.PAYLOAD = {};
                                        response.SMSG = SMSG.SVR_OATH_LGNSUC;
                                        response.STATUS = 200;
                                        resolve(response);
                                    }).catch(error => {
                                        throw error;    
                                    });
                                }).catch(reject => {
                                    throw reject;
                                });
                            }).catch(error => {
                                console.log(error);
                                response.STATUS = 500;
                                response.EMSG = EMSG.SVR_OATH_LGNUSUC;
                                reject(response);
                            }); 
                        }else{
                            //set userSession
                            cookieHandler.createCookies(resultSet[0]._id,resultSet[0].UserName).then(resolvedResult => {
                                    //save the user details
                                    googleApis.getUserDetails(resultSet[0].RefreshToken).then(result => {
                                    mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { FirstName: result.given_name, LastName: result.family_name}}, {}, SINGLE).then(updateSet => {
                                        response.PAYLOAD.cookieDetails = resolvedResult;
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
                resultSet[0].Password == "" && mongo.delete(dbConstants.userCollection, { State: requestObject.reqBody.state }, {}, SINGLE).then(updateSet => {
                    response.STATUS = 400;
                    response.EMSG = EMSG.SVR_OATH_LGNDND;
                    reject(response);
                }).catch(error => {
                    //TODO --> add scheduler to handle this use case
                    response.STATUS = 500;
                    response.EMSG = error;
                    reject(response);
                });
                resultSet[0].Password != "" && mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { RefreshToken: "" } }, {}, SINGLE).then(updateSet => {
                    response.STATUS = 400;
                    response.EMSG = EMSG.SVR_OATH_LGNDND;
                    reject(response);
                }).catch(error => {
                    //TODO --> add scheduler to handle this use case
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
googleAuthHandler.postAuthDetails = (requestObject) = new Promise((resolve,reject) => {
    let response = {};
    //check the requestObject
    if(requestObject.reqBody.hasOwnProperty('state') && requestObject.reqBody.hasOwnProperty('UserName') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.reqBody.hasOwnProperty('Phone') && requestObject.method == "POST"){
         //check state validity
         mongo.read(dbConstants.userCollection,{ State: requestObject.reqBody.state }, { projection: { _id: 1,Email: 1, FirstName:1 } }).then(resultSet => {
            if (JSON.stringify(resultSet) != JSON.stringify([])) {  
                requestObject.reqBody.Password = encryptionAPI.hash(requestObject.reqBody.Password);
                mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { UserName: requestObject.reqBody.UserName, Password: requestObject.reqBody.Password, PhoneNumber: requestObject.reqBody.Phone}}, {}, SINGLE).then(updateSet => {
                    cookieHandler.createCookies(resultSet[0]._id).then(resolvedResult => {
                         response.PAYLOAD.cookieDetails =resolvedResult;
                         response.SMSG = SMSG.SVR_OATH_LGNSUC;
                         response.STATUS = 200;
                         resolve(response);
                    }).catch(rejectedResult => {
                        response.EMSG = rejectedResult;
                        response.STATUS = 400;
                    });
                }).catch(error => {
                    throw error;
                });
            }else{
                response.EMSG = EMSG.SVR_OATH_INST;
                response.STATUS = 400; 
                reject(response);   
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

//exporting the module
module.exports = googleAuthHandler;

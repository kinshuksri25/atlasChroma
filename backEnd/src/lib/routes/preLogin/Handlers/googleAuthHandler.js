//Dependencies
const mongo = require("");
const encryptionAPI = require("");
const {MSG,Constants,SINGLE} = require("");
const cookieHandler = require("");
const randValueGenerator = require("");
const emailTemplate = require("");

//TODO --> need to change the all the msgs

//declaring the module
let googleAuthHandler = {};

//params --> requestObject -- object
//return --> promise(object)
googleAuthHandler.googleAuth = (requestObject) = new Promise((resolve,reject) => {

    let state = randValueGenerator(Constants.RANDOMGEN.NUM,15);
    let response = {};
    //check the request object
    if(requestObject.queryObject.Email != undefined && requestObject.method == "GET"){

        mongo.read(dbConstants.userCollection,{ Email: requestObject.queryObject.Email }, {}).then(resultSet => {

            //check if user exists
            if (JSON.stringify(resultSet) == JSON.stringify([])) {
                //set user object
                //create userObject
                let googleSignUpUserObject = new userObject(randValueGenerator(Constants.RANDOMGEN.ID),
                                                            requestObject.reqBody.Email,"","","", state);          
                //save user credentials 
                mongo.insert(dbConstants.userCollection, googleSignUpUserObject, {}).then(insertSet => {
                    
                    //TODO --> add google interface
                    //build auth url
                    response.STATUS = 200;
                    response.SMSG = "New User Discovered,Google Authentication url built successfully";
                    response.PAYLOAD.authURL =  buildAuthURL(requestObject.queryObject.Email,state); 
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
                    response.SMSG = "Welcome Back!,Google Authentication url built successfully";
                    response.PAYLOAD.authURL =  buildAuthURL(requestObject.queryObject.Email,state); 
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
        //TODO --> add the below mentioned msg to MSG
        response.EMSG = "INVALID REQUEST MADE";
        response.STATUS = 400; // --> request syntax is invalid
        reject(response);   
    }
});


//params --> requestObject -- object
//return --> promise(object)
googleAuthHandler.postAuth = (requestObject) = new Promise((resolve,reject) => {
    let response = {};
    if(requestObject.reqBody.state != undefined && requestObject.reqBody.method == "POST"){
        mongo.read(dbConstants.userCollection,{ State: requestObject.reqBody.state }, {}).then(resultSet => {
            if(requestObject.reqBody.code != undefined && requestObject.reqBody.error == undefined){
                if (JSON.stringify(resultSet) != JSON.stringify([])){
                    //get refresh token
                    generateInitialAccessToken(requestObject.reqBody.code).then(refreshTokenObject => {
                        if(refreshTokenObject.refresh_token == undefined){
                            //check for new user 
                            if(resultSet[0].Password == "" && resultSet[0].UserName == ""){
                                fs.readFile(emailTemplate.WELCOMEMAIL, function(error, data) {  
                                    if (error) {
                                        response.STATUS = 500;
                                        response.EMSG = "UNABLE TO LOGIN USING GOOGLE";
                                        reject(response);
                                    } else {  
                                        //send welcome mail
                                        sendEmail(senderEmail,requestObject.reqBody.Email,emailCredentials.refreshToken,loginAuth.clientID,loginAuth.clientSecret,"Welcome to Atlas Chroma",data).then(resolveResult => { 
                                            response.PAYLOAD == {};
                                        })
                                        .catch(error => {
                                            response.STATUS = 500;
                                            response.EMSG = "UNABLE TO LOGIN USING GOOGLE";
                                            reject(response);
                                        }); 
                                    }  
                                });   
                            }else{
                                //set userSession
                                response.PAYLOAD.cookieDetails = cookieHandler.createCookies(resultSet[0]._id);
                            }
                            //save the user details
                            getProfileDetails(refreshTokenObject.access_token).then(result => {
                                mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { FirstName: result.given_name, LastName: result.family_name}}, {}, SINGLE).then(updateSet => {

                                    response.SMSG = "LOGIN SUCCESSFUL";
                                    response.STATUS = 200;
                                }).catch(error => {
                                    response.STATUS = 500;
                                    response.EMSG = error;
                                    reject(response);
                                });
                            }).catch(reject => {
                                response.STATUS = 500;
                                response.EMSG = error;
                                reject(response);
                            });
                        }else{
                            //save refreshToken
                            mongo.update(dbConstants.userCollection, { _id: resultSet[0]._id }, { $set: { RefreshToken: refreshTokenObject.refresh_token } }, {}, SINGLE).then(updateSet => {
                                //check for new user 
                                if(resultSet[0].Password == "" && resultSet[0].UserName == ""){
                                    fs.readFile(emailTemplate.WELCOMEMAIL, function(error, data) {  
                                        if (error) {
                                            response.STATUS = 500;
                                            response.EMSG = "UNABLE TO SIGN THE USER UP, PLEASE TRY SIGNING UP AGAIN, OR TRY GOOGLE LOGIN";
                                            reject(response);
                                        } else {  
                                            //send welcome mail
                                            sendEmail(senderEmail,requestObject.reqBody.Email,emailCredentials.refreshToken,loginAuth.clientID,loginAuth.clientSecret,"Welcome to Atlas Chroma",data).then(resolveResult => { 
                                                response.PAYLOAD == {};
                                            })
                                            .catch(error => {
                                                response.STATUS = 500;
                                                response.EMSG = "UNABLE TO SIGN THE USER UP, PLEASE TRY SIGNING UP AGAIN, OR TRY GOOGLE LOGIN";
                                                reject(response);
                                            }); 
                                        }  
                                    });
                                }else{
                                    //set userSession
                                    response.PAYLOAD.cookieDetails = cookieHandler.createCookies(resultSet[0]._id);
                                }
                                //save the user details
                                getProfileDetails(refreshTokenObject.access_token).then(result => {
                                    mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { FirstName: result.given_name, LastName: result.family_name}}, {}, SINGLE).then(updateSet => {

                                        response.SMSG = "LOGIN SUCCESSFUL";
                                        response.STATUS = 200;
                                    }).catch(error => {
                                        response.STATUS = 500;
                                        response.EMSG = error;
                                        reject(response);
                                    });
                                }).catch(reject => {
                                    response.STATUS = 500;
                                    response.EMSG = error;
                                    reject(response);
                                });
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
                    response.EMSG = "INVALID REQUEST MADE";
                    response.STATUS = 400; // --> request syntax is invalid
                    reject(response);
                }
            }else{
                //delete the user data 
                resultSet[0].Password == "" && mongo.delete(dbConstants.userCollection, { State: requestObject.reqBody.state }, {}, SINGLE).then(updateSet => {
                    response.STATUS = 400;
                    response.EMSG = "THE USER DENIED LOGIN";
                    reject(response);
                }).catch(error => {
                    //TODO --> add scheduler to handle this user case
                    response.STATUS = 500;
                    response.EMSG = error;
                    reject(response);
                });
                resultSet[0].Password != "" && mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { RefreshToken: "" } }, {}, SINGLE).then(updateSet => {
                    response.STATUS = 400;
                    response.EMSG = "THE USER DENIED LOGIN";
                    reject(response);
                }).catch(error => {
                    //TODO --> add scheduler to handle this user case
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
         //TODO --> add the below mentioned msg to MSG
        response.EMSG = "INVALID REQUEST MADE";
        response.STATUS = 400; // --> request syntax is invalid
        reject(response);   
    }
});

//params --> requestObject -- object
//return --> promise(object)
googleAuthHandler.postAuthDetails = (requestObject) = new Promise((resolve,reject) => {
    let response = {};
    //check the requestObject
    if(requestObject.reqBody.hasOwnProperty('state') && requestObject.reqBody.hasOwnProperty('UserName') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.reqBody.hasOwnProperty('Phone') && requestObject.method == "POST"){
         //check state validity
         mongo.read(dbConstants.userCollection,{ State: requestObject.reqBody.state }, { projection: { _id: 1,Email: 1, FirstName:1 } }).then(resultSet => {
            if (JSON.stringify(resultSet) != JSON.stringify([])) {  
                requestObject.reqBody.Password = encryptionAPI.hash(requestObject.reqBody.Password);
                mongo.update(dbConstants.userCollection, { State: requestObject.reqBody.state }, { $set: { UserName: requestObject.reqBody.UserName, Password: requestObject.reqBody.Password, PhoneNumber: requestObject.reqBody.Phone}}, {}, SINGLE).then(updateSet => {
                    response.PAYLOAD.cookieDetails = cookieHandler.createCookies(resultSet[0]._id);
                    //TODO --> add the below mentioned msg to MSG
                    response.SMSG = "LOGIN SUCCESSFUL";
                    response.STATUS = 200;
                    resolve(response);
                }).catch(error => {
                    throw error;
                });
            }else{
                response.EMSG = "Invalid state!";
                response.STATUS = 400; // --> request syntax is invalid
                reject(response);   
            } 
        }).catch(error => {
            response.STATUS = 500;
            response.EMSG = error;
            reject(response);
        });

    }else{
        //TODO --> add the below mentioned msg to MSG
        response.EMSG = "INVALID REQUEST MADE";
        response.STATUS = 400; // --> request syntax is invalid
        reject(response);   
    }
});

//exporting the module
module.exports = googleAuthHandler;
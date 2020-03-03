//Dependencies
const mongo = require("");
const encryptionAPI = require("");
const {MSG,Constants,SINGLE} = require("");
const cookieHandler = require("");
const userObject = require("");
const randValueGenerator = require("");
const emailTemplate = require("");
const fs =  require("");

//declaring the module
const signupHandler = {};

//params --> requestObject -- object
//returns --> promise(object)
signupHandler.signup = (requestObject) = new Promise((resolve,reject) => {

    let response = {};

    if(requestObject.reqBody.hasOwnProperty('UserName') && requestObject.reqBody.hasOwnProperty('Email') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.method == "POST"){

        //set userObject 
        let userObject = new userObject(randValueGenerator(),
                                        requestObject.reqBody.Email,
                                        requestObject.reqBody.UserName,
                                        encryptionAPI.hash(requestObject.reqBody.Password));                                      
        //save the user details
        mongo.insert(dbConstants.userCollection, userObject.getUser(), {}).then(insertSet => {

            //setup the login object
            let loginObject = {
                reqBody : {},
                method : "POST",
                queryObject: {}
            };

            loginObject.reqBody.Email = requestObject.reqBody.Email;
            loginObject.reqBody.Password = requestObject.reqBody.Password;

            //call the login function to log user in
            handlers.login(loginObject).then(result => {
                fs.readFile(emailTemplate.WELCOMEMAIL, function(error, data) {  
                    if (error) {
                        mongo.delete(dbConstants.userCollection, { _id: userObject.getUser().id }, {}, SINGLE).then(updateSet => {})
                        .catch(error => {
                           //TODO --> add this delete to cron job     
                        });
                        response.STATUS = 500;
                        response.EMSG = "UNABLE TO SIGN THE USER UP, PLEASE TRY SIGNING UP AGAIN, OR TRY GOOGLE LOGIN";
                        reject(response);
                    } else {  
                        //send welcome mail
                        sendEmail(senderEmail,requestObject.reqBody.Email,emailCredentials.refreshToken,loginAuth.clientID,loginAuth.clientSecret,"Welcome to Atlas Chroma",data).then(resolveResult => {   
                            //send the response 
                            response.SMSG = "SIGNUP SUCCESSFUL";
                            response.STATUS = 200;
                            response.PAYLOAD.unquieID = result.PAYLOAD.unquieID;
                            resolve(response);       
                        }).catch(error => {
                            mongo.delete(dbConstants.userCollection, { _id: userObject.getUser().id }, {}, SINGLE).then(updateSet => {})
                            .catch(error => {
                               //TODO --> add this delete to cron job     
                            });
                            response.STATUS = 500;
                            response.EMSG = "UNABLE TO SIGN THE USER UP, PLEASE TRY SIGNING UP AGAIN, OR TRY GOOGLE LOGIN";
                            reject(response);
                        }); 
                    }  
                });              
            }).catch(error =>{
                reject(error);
            }); 
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

//params -->  requestObject -- object
//return --> promise(object)
signupHandler.userAvailability = (requestObject) => new Promise((resolve,reject) => {
    let response = {};
    let query = {};
    query = requestObject.queryObject.Email != undefined ? {"Email":requestObject.queryObject.Email} : {"UserName":requestObject.queryObject.UserName};
    
    //check requestObject
    if(query != {} && requestObject.method == "GET"){
        //check email validity
        mongo.read(dbConstants.userCollection,query, {}).then(resultSet => {  
            if (JSON.stringify(resultSet) == JSON.stringify([])) {    

                response.STATUS = 200;
                response.PAYLOAD = {};
                response.SMSG = "NO USER EXISTS FOR THIS DATA";
                //return response
                resolve(response);   
            }else{
                response.STATUS = 200;
                response.EMSG = "USER ALREADY EXISTS";
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

//params -->  requestObject -- object
//return --> promise(object)
signupHandler.postSignupDetails = (requestObject) => new Promise((resolve,reject) => {
    
    let response = {};
    //check the requestObject
    if(requestObject.reqBody.hasOwnProperty('id') && requestObject.reqBody.hasOwnProperty('FirstName') && requestObject.reqBody.hasOwnProperty('LastName') && requestObject.reqBody.hasOwnProperty('Phone') && requestObject.method == "POST"){
         //check id validity
         mongo.read(dbConstants.userCollection,{ _id: requestObject.reqBody.id }, { projection: { Email: 1, Password:1, FirstName:1 } }).then(resultSet => {
            if (JSON.stringify(resultSet) != JSON.stringify([])) {  
                mongo.update(dbConstants.userCollection, { _id: requestObject.reqBody.id }, { $set: { FirstName: requestObject.reqBody.FirstName, LastName: requestObject.reqBody.LastName, PhoneNumber: requestObject.reqBody.Phone}}, {}, SINGLE).then(updateSet => {
                    response.PAYLOAD.cookie = cookieHandler.createCookies(requestObject.req.id,resultSet[0].UserName).then(resolvedResult => {
                        response.STATUS = 200;
                        response.SMSG = "SIGNUP SUCCESSFUL";
                        response.PAYLOAD.cookieObject = resolvedResult;
                    }).catch(rejectedResult => {
                        response.STATUS = 500;
                        response.EMSG = "UNABLE TO LOG THE USER IN";
                        reject(response);
                    });
                    resolve(response);
                }).catch(error => {
                    response.STATUS = 500;
                    response.EMSG = error;
                    reject(response);
                });
            }else{
                response.STATUS = 400;
                response.EMSG = "INVALID USER";
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
module.exports = signupHandler;

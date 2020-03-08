/*
* Signup handler
*/

//Dependencies
const mongo = require("../../../utils/data");
const encryptionAPI = require("../../../utils/encryptionAPI");
const cookieHandler = require("../../../utils/cookieHandler");
const user = require("../../../classObjects/userClass");
const {EMSG,SMSG,OAuthCONST,EMAILTEMPLATES,SINGLE} = require("../../../../../../lib/constants/contants");
const loginHandler = require("./loginhandlers");
const {randValueGenerator} = require("../../../utils/helper");


//declaring the module
const signupHandler = {};

//signup route handler
//params --> requestObject -- object
//returns --> promise(object)
signupHandler.signup = (requestObject) = new Promise((resolve,reject) => {

    let response = {};
    if(requestObject.reqBody.hasOwnProperty('UserName') && requestObject.reqBody.hasOwnProperty('Email') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.method == "POST"){
        //set userObject 
        let userObject = new user(randValueGenerator(),
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
            loginHandler.login(loginObject).then(result => {
                //send welcome mail
                sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.Email,OAuthCONST.appAuth.refreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.WELCOMEMAIL).then(resolveResult => {   
                    //send the response 
                    response.SMSG = SMSG.SVR_SNGH_SGNSUC;
                    response.STATUS = 200;
                    response.PAYLOAD.unquieID = result.PAYLOAD.unquieID;
                    resolve(response);       
                }).catch(error => {
                    mongo.delete(dbConstants.userCollection, { _id: userObject.getUser().id }, {}, SINGLE).then(updateSet => {})
                    .catch(error => {
                        //TODO --> add this delete to cron job     
                    });
                    response.STATUS = 500;
                    response.EMSG = EMSG.SVR_SGNH_UNSGNUP;
                    reject(response);
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
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        response.STATUS = 400; 
        reject(response);
    }

});

//checking user availability handler
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
                response.SMSG = SMSG.SVR_SGNH_NUSR;
                //return response
                resolve(response);   
            }else{
                response.STATUS = 200;
                response.EMSG = EMSG.SVR_SGNH_EUSR;
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

//post signup form route handler
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
                        response.SMSG = SMGSG.SVR_LGNH_LGNSUC;
                        response.PAYLOAD.cookieObject = resolvedResult;
                    }).catch(rejectedResult => {
                        response.STATUS = 500;
                        response.EMSG = EMSG.SVR_LGNH_LGNUSUC;
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
                response.EMSG = EMSG.SVR_SGNH_INUSR;
                reject(response);
            } 
        }).catch(error => {
            response.STATUS = 500;
            response.EMSG = error;
            reject(response);
        });

    }else{
          response.EMSG = EMSG.SVR_HNDLS_INREQ;
          response.STATUS = 400; // --> request syntax is invalid
          reject(response);   
    }
});

//export the module
module.exports = signupHandler;

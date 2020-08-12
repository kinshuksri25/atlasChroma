/*
* Signup handler
*/

//Dependencies
const mongo = require("../../../utils/data");
const encryptionAPI = require("../../../utils/encryptionAPI");
const cookieHandler = require("../../../utils/cookieHandler");
const user = require("../../../classObjects/userClass");
const googleApis = require("../../../googleApis/googleAPI");
const {DBCONST,EMSG,SMSG,OAuthCONST,EMAILTEMPLATES,SINGLE} = require("../../../../../../lib/constants/contants");
const loginHandler = require("./loginhandlers");
const {randValueGenerator} = require("../../../utils/helper");
const { update } = require("../../../utils/data");


//declaring the module
const signupHandler = {};

//signup route handler
//params --> requestObject -- object
//returns --> promise(object)
signupHandler.signup = (requestObject,io) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.reqBody.hasOwnProperty('UserName') && requestObject.reqBody.hasOwnProperty('Email') && requestObject.reqBody.hasOwnProperty('Password') && requestObject.method == "POST"){
        //set userObject 
        let userObject = new user({_id : randValueGenerator(),
                                  username : requestObject.reqBody.UserName,
                                  email : requestObject.reqBody.Email,
                                  password : encryptionAPI.hash(requestObject.reqBody.Password)});                                                           
        //save the user details
        mongo.insert(DBCONST.userCollection, userObject.getUserObject(), {}).then(resolvedResult => {

            //setup the login object
            let loginObject = {
                reqBody : {},
                method : "POST",
                queryObject: {}
            };

            let templateObject = {
                userName : requestObject.reqBody.UserName.toUpperCase(),
                supportEmail : OAuthCONST.appAuth.senderEmail
            };

            loginObject.reqBody.Email = requestObject.reqBody.Email;
            loginObject.reqBody.Password = requestObject.reqBody.Password;

            //call the login function to log user in
            loginHandler.login(loginObject).then(result => {
                //send welcome mail
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.Email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.WELCOMEMAIL,templateObject).then(resolveEmail => {   
                    //send the response 
                    response.SMSG = SMSG.SVR_SNGH_SGNSUC;
                    response.STATUS = 200;
                    response.PAYLOAD.uniqueID = result.PAYLOAD.uniqueID;
                    resolve(response);       
                }).catch(rejectedEmail => {
                    let payload = {
                        "participants" : [requestObject.reqBody.Email],
                        "template" : "WELCOMEMAIL",
                        "templateData" : {...templateObject}
                    };
                    mongo.delete(DBCONST.userCollection, { _id: userObject.getUser().id }, {}, SINGLE);
                    mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                    response.STATUS = 201;
                    response.PAYLOAD.uniqueID = result.PAYLOAD.uniqueID;
                    response.SMSG = SMSG.SVR_OATH_NLGNSUC;
                    reject(response);
                });    
            }).catch(error =>{
                reject(error);
            }); 
        }).catch(rejectedResult => {
            response.STATUS = 500;
            response.EMSG = error;
            reject(rejectedResult);
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
signupHandler.userAvaliability = (requestObject,io) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    let query = {};
    query = requestObject.queryObject.Email != undefined ? {"email":requestObject.queryObject.Email} : {"username":requestObject.queryObject.UserName};
    
    //check requestObject
    if(query != {} && requestObject.method == "GET"){
        //check email validity
        mongo.read(DBCONST.userCollection,query, {projection : {_id : 0,email : 1}}).then(resultSet => {  
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
signupHandler.postSignupDetails = (requestObject,io) => new Promise((resolve,reject) => {

    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    //check the requestObject
    if(requestObject.reqBody.hasOwnProperty('id') && requestObject.reqBody.hasOwnProperty('FirstName') && requestObject.reqBody.hasOwnProperty('LastName') && requestObject.reqBody.hasOwnProperty('Phone') && requestObject.reqBody.hasOwnProperty('ProfilePhoto') && requestObject.method == "POST"){
         //check id validity
         mongo.update(DBCONST.userCollection, { _id: requestObject.reqBody.id }, { $set: { firstname: requestObject.reqBody.FirstName, lastname: requestObject.reqBody.LastName, phonenumber: requestObject.reqBody.Phone, photo: requestObject.reqBody.ProfilePhoto}}, {returnOriginal: false}, SINGLE).then(updateSet => {
            if(JSON.stringify(updateSet.value) != JSON.stringify({})){
                updateSet = {...updateSet.value};
                let updatedUser = {
                    username : updateSet.username,
                    firstname : updateSet.firstname,
                    lastname : updateSet.lastname,
                    email : updateSet.email
                };
                io.emit("updatingDetails",{event : "addingUser", data : updatedUser});
                response.PAYLOAD.cookie = cookieHandler.createCookies(requestObject.reqBody.id,updatedUser.username).then(resolvedResult => {
                    response.STATUS = 200;
                    response.SMSG = SMSG.SVR_LGNH_LGNSUC;
                    response.PAYLOAD = resolvedResult;
                    resolve(response);
                }).catch(rejectedResult => {
                    console.log(rejectedResult);
                    response.STATUS = 500;
                    response.EMSG = EMSG.SVR_LGNH_LGNUSUC;
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

//export the module
module.exports = signupHandler;

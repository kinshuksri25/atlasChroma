/*
* User Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,DBCONST,SINGLE,MULTIPLE,OAuthCONST,EMAILTEMPLATES} = require("../../../../../../lib/constants/contants");
const googleApis = require("../../../googleApis/googleAPI");
const cookieHandler = require("../../../utils/cookieHandler");
const encryptionAPI = require("../../../utils/encryptionAPI");

//declaring the module
const userHandler = {};

//router for all the user routes
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user = (route,requestObject) => new Promise((resolve,reject) => {     
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
    };
    if(requestObject.hasOwnProperty("method")){
        switch(requestObject.method){
          case "GET" :
              userHandler.user.get(route,requestObject).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "POST" : 
              break;
          case "PUT" : 
                userHandler.user.put(route,requestObject).then(resolvedResult => {
                        resolve(resolvedResult);
                }).catch(rejectedResult => {
                        reject(rejectedResult);
                });
              break;
          case "DELETE" : 
                userHandler.user.delete(route,requestObject).then(resolvedResult => {
                        resolve(resolvedResult);
                }).catch(rejectedResult => {
                        reject(rejectedResult);
                });
              break;
        }
    }else{
      response.STATUS = 500;
      response.EMSG = EMSG.SVR_HDNLS_MTHNTFND;
      reject(response);
    }
});


//user get route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.get = (route,requestObject) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };

    if(requestObject.queryObject.userID != undefined){
        mongo.aggregate(DBCONST.userCollection,[{$match : {_id : requestObject.queryObject.userID}},
                                                {$lookup : {
                                                    from: DBCONST.projectCollection,
                                                    localField: "projects",
                                                    foreignField: "_id",
                                                    as: "projects"
                                                 }},
                                                {$project: { _id: 0, password:0,refreshToken:0,state:0}}]).then(resolvedResult => {
                    
            if(resolvedResult.length != 0){
                response.STATUS = 200;
                response.PAYLOAD.user = {...resolvedResult[0]};
                response.SMSG = SMSG.SVR_UHH_RDUSR; 
                resolve(response); 
            }else{
                response.STATUS = 400;
                response.EMSG = "Invalid userID";  
                reject(response); 
            }                                   
                                                    
        }).catch(rejectedResult =>{
            response.STATUS = 500;
            response.EMSG = rejectedResult;
            reject(response);
        });
    }else{
        mongo.read(DBCONST.userCollection,{},{projection:{_id:0, username:1,email: 1,firstname: 1,lastname: 1}}).then(resultSet => {
            if(resultSet.length != 0){   
                //adding status
                //This needs to be addessed by the next refactor
                let userList = [...resultSet];
                cookieHandler.getAllCookies().then(activeLoginDetails => {
                    let valueArray = [];
                    for(key in activeLoginDetails){
                        valueArray.push(activeLoginDetails[key]);
                    }
                    userList.map(user => {
                        user.status = valueArray.includes(user.username) ? true : false;
                    });

                    response.STATUS = 200;
                    response.PAYLOAD.userList = [...userList];
                    response.SMSG = SMSG.SVR_UHH_RDUSR; 
                    resolve(response); 
                }).catch(rejectedResult => {
                    throw rejectedResult;   
                });
            }
        }).catch(rejectedResult => {
            response.STATUS = 500;
            response.EMSG = rejectedResult;
            reject(response);
        });    
    }
});

//user put route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.put = (route,requestObject) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.reqBody.hasOwnProperty("password") 
        || requestObject.reqBody.hasOwnProperty("firstname") 
        || requestObject.reqBody.hasOwnProperty('lastname') 
        || requestObject.reqBody.hasOwnProperty("phonenumber")
        || requestObject.reqBody.hasOwnProperty("photo")){

        let set = {}; 
        if(requestObject.reqBody.hasOwnProperty("password")){
            let encryptedPassword = encryptionAPI.hash(requestObject.reqBody.password);
            set["$set"].password = encryptedPassword;
        }if(requestObject.reqBody.hasOwnProperty("firstname")){
            set["$set"].firstname = requestObject.reqBody.firstname;
        }if(requestObject.reqBody.hasOwnProperty("lastname")){
            set["$set"].lastname = requestObject.reqBody.lastname;
        }if(requestObject.reqBody.hasOwnProperty("phonenumber")){
            set["$set"].phonenumber = requestObject.reqBody.phonenumber;
        }if(requestObject.reqBody.hasOwnProperty("photo")){
            set["$set"].photo = requestObject.reqBody.photo;
        }

        mongo.update(DBCONST.userCollection,{username : requestObject.reqBody.username},{...set},{},SINGLE).then(resultSet => {
            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITUSER).then(resolvedResult => {
                response.STATUS = 200;
                response.PAYLOAD = {};
                response.SMSG = "User details updated";        
                resolve(response); 
            }).catch(rejectedResult => {
                response.STATUS = 201;
                response.PAYLOAD = {};
                response.SMSG = "User details updated, unable to nortify the user";        
                resolve(response); 
            });
        }).catch(rejectedSet => {
            response.STATUS = 500;
            response.EMSG = rejectedSet;
            reject(response); 
        });
    }else{
    response.STATUS = 400;
    response.EMSG = EMSG.SVR_HNDLS_INREQ;
    reject(response);
    }
});

//user delete route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.delete = (route,requestObject) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
        };
    
    if(requestObject.reqBody.hasOwnProperty("projectIDs") && requestObject.queryObject.username != undefined && requestObject.reqBody.hasOwnProperty("email")){
        mongo.update(DBCONST.projectCollection , {_id:{$in : [...requestObject.reqBody.projectIDs]}},{$pull:{contributors : requestObject.queryObject.username}},{},MULTIPLE).then(resolvedSet => {
            mongo.delete(DBCONST.userCollection,{username : requestObject.queryObject.username},{},SINGLE).then(resolvedSet => {
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.DELETEUSER).then(resolvedResult => {
                    response.STATUS = 200;
                    response.PAYLOAD = {};
                    response.SMSG = "User deleted";        
                    resolve(response); 
                }).catch(rejectedResult => {
                    response.STATUS = 201;
                    response.PAYLOAD = {};
                    response.SMSG = "User deleted, unable to nortify the user";        
                    resolve(response); 
                });
            }).catch(rejectedSet => {
                throw rejectedSet;    
            });
        }).catch(rejectedSet => {
            response.STATUS = 500;
            response.EMSG = rejectedSet;
            reject(response); 
        });
    }else{
        response.STATUS = 400;
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        reject(response); 
    }        
});

//exporting the module
module.exports = userHandler;

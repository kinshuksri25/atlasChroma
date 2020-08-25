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
userHandler.user = (route,requestObject,io) => new Promise((resolve,reject) => {     
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
    };
    if(requestObject.hasOwnProperty("method")){
        switch(requestObject.method){
          case "GET" :
              userHandler.user.get(route,requestObject,io).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "POST" : 
              break;
          case "PUT" : 
                userHandler.user.put(route,requestObject,io).then(resolvedResult => {
                        resolve(resolvedResult);
                }).catch(rejectedResult => {
                        reject(rejectedResult);
                });
              break;
          case "DELETE" : 
                userHandler.user.delete(route,requestObject,io).then(resolvedResult => {
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
userHandler.user.get = (route,requestObject,io) => new Promise((resolve,reject) => {
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
                response.PAYLOAD = {...resolvedResult[0]};
                response.SMSG = SMSG.SVR_UHH_RDUSR; 
                resolve(response); 
            }else{
                response.STATUS = 400;
                response.EMSG = EMSG.SVR_HNDLS_INVLDUSRID;  
                reject(response); 
            }                                   
                                                    
        }).catch(rejectedResult =>{
            response.STATUS = 500;
            response.EMSG = rejectedResult;
            reject(response);
        });
    }else{
        cookieHandler.getAllCookies().then(activeLoginDetails => {
            let valueArray = [];
            for(key in activeLoginDetails){
                valueArray.push(activeLoginDetails[key]);
            }
            mongo.read(DBCONST.userCollection,{},{projection:{_id:0, username:1,email: 1,firstname: 1,lastname: 1}}).then(resolvedSet => {
                if(resolvedSet.length != 0){   

                    resolvedSet.map(user => {
                        user.status = valueArray.indexOf(user.username) >= 0 ? true : false;
                    });
                    
                    response.STATUS = 200;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_UHH_RDUSR; 
                    io.emit("updatingDetails",{event : "getUserList", data : [...resolvedSet]});
                    resolve(response); 
                      
                }
            }).catch(rejectedSet => {
                throw rejectedSet;
            }); 
        }).catch(rejectedResult => {
            response.STATUS = 500;
            response.EMSG = rejectedResult;
            reject(response);
        });;   
    }
});

//user put route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.put = (route,requestObject,io) => new Promise((resolve,reject) => {
    
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
        mongo.update(DBCONST.userCollection,{username : requestObject.reqBody.username},{...set},{returnOriginal: false},SINGLE).then(resolvedSet => {
            console.log(resolvedSet);
            resolvedSet = resolvedSet.value; 
            let updatedUser = {
                username : resolvedSet.username,
                firstname : resolvedSet.firstname,
                lastname : resolvedSet.lastname,
                email : resolvedSet.email,
                phonenumber : resolvedSet.phonenumber,
                photo : resolvedSet.photo,
                status : true
            };
            io.emit("updatingDetails",{event : "updatingUser", data : updatedUser}); 
            response.STATUS = 200;
            response.PAYLOAD = {};
            response.SMSG = SMSG.SVR_UHH_USRUPSUC;      
            resolve(response); 
        }).catch(rejectedSet => {
            response.STATUS = 500;
            response.EMSG = rejectedSet;
            reject(response); 
        });
    }else{
        console.log("called");
        response.STATUS = 400;
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        reject(response);
    }
});

//user delete route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.delete = (route,requestObject,io) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
        };   
        
    let template = {
        supportEmail : OAuthCONST.appAuth.senderEmail
    };    
    if(requestObject.queryObject.hasOwnProperty("username")){
        console.log(requestObject);
        mongo.delete(DBCONST.userCollection,{username : requestObject.queryObject.username},{$pull : {username : requestObject.queryObject.username}},{returnOriginal: false,remove: true},SINGLE).then(resolvedResult => {
            let deletedData = resolvedResult.value;
            io.emit("updatingDetails",{event : "deleteingUser", data : {username : deletedData.username}});  
            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,deletedData.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.DELETEUSER,template).then(resolvedEmail => {
                response.STATUS = 200;
                response.PAYLOAD = {};
                response.SMSG = SMSG.SVR_UHH_USRDELSUC;       
                resolve(response); 
            }).catch(rejectedEmail => {
                let payload = {
                    "participants" : deletedData.email,
                    "template" : "DELETEUSER",
                    "templateData" : template
                };
                mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                response.STATUS = 201;
                response.PAYLOAD = {};
                response.SMSG = SMSG.SVR_UHH_IUSRDELSUC;        
                resolve(response); 
            });
        }).catch(rejectedResult => {
            response.STATUS = 500;
            response.EMSG = rejectedResult;
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

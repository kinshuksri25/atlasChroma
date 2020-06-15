/*
* Notes Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,SINGLE,OAuthCONST,EMAILTEMPLATES,DBCONST} = require("../../../../../../lib/constants/contants");
const googleApis = require("../../../googleApis/googleAPI");
const {randValueGenerator,generateCurrentDate} = require("../../../utils/helper");

//declaring the module
const notesHandler = {};


//router for all the notes routes
//params --> route - string, requestObject - object
//returns --> promise - object
notesHandler.notes = (route,requestObject) => new Promise((resolve,reject) => {

    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.hasOwnProperty("method")){
        switch(requestObject.method){
          case "GET" :
              break;
          case "POST" : 
            notesHandler.notes.post(route,requestObject).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "PUT" :
            notesHandler.notes.put(route,requestObject).then(resolvedResult => {
                    resolve(resolvedResult);
                }).catch(rejectedResult => {
                    reject(rejectedResult);
                }); 
              break;
          case "DELETE" : 
            notesHandler.notes.delete(route,requestObject).then(resolvedResult => {
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

//notes post route
//params --> route - string, requestObject - object
//returns --> promise - object
notesHandler.notes.post = (route, requestObject) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.reqBody.hasOwnProperty("title") && requestObject.reqBody.hasOwnProperty("description")){

        let notesObject = {
            "title" : requestObject.reqBody.title,
            "description" : requestObject.reqBody.description,
            "_id" : randValueGenerator(),
            "creationdate" : generateCurrentDate()
        };
        mongo.update(DBCONST.userCollection , {email : requestObject.reqBody.emailID},{$push:{notes : {...notesObject}}},{},SINGLE).then(resolvedSet => {
            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.emailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDNOTES).then(resolvedResult => {
                response.STATUS = 200;
                response.PAYLOAD = {"notesID" : notesObject._id,"creationdate" : notesObject.creationdate};
                response.SMSG = "notes added successfully";
                resolve(response);
            }).catch(rejectedResult => {
                response.STATUS = 201;
                response.PAYLOAD = {notesID : requestObject.reqBody._id,creationdate : requestObject.reqBody.creationdate};
                response.SMSG = "notes added successfully, unable to nortify the contributor"; //add a cron here
                resolve(response);    
            });
        }).catch(rejectedSet => {
            throw rejectedSet; 
        });
    }else{
        response.STATUS = 400;
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        reject(response);
    }
});

//notes put route
//params --> route - string, requestObject - object
//returns --> promise - object
notesHandler.notes.put = (route, requestObject) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.reqBody.hasOwnProperty("title") || requestObject.reqBody.hasOwnProperty("description")){
                
                let set = {}; 
                let updateQuery = {};
                if(requestObject.reqBody.hasOwnProperty("title")){
                    set["notes.$.title"] = requestObject.reqBody.title;
                }if(requestObject.reqBody.hasOwnProperty("description")){
                    set["notes.$.description"] = requestObject.reqBody.description;
                }
                if(JSON.stringify(set)!=JSON.stringify({})){
                    updateQuery["$set"] = {...set};
                } 
                mongo.update(DBCONST.userCollection,{"notes._id" : requestObject.reqBody._id},{$set : {...set}},{},SINGLE).then(resolvedSet => {
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.emailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITNOTES).then(resolvedResult => {
                        response.STATUS = 200;
                        response.PAYLOAD = {};
                        response.SMSG = "notes edited successfully";
                        resolve(response);
                    }).catch(rejectedResult => {
                        response.STATUS = 201;
                        response.PAYLOAD = {};
                        response.SMSG = "notes edited successfully, unable to nortify the contributor"; //add a cron here
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

//event delete route
//params --> route - string, requestObject - object
//returns --> promise - object
notesHandler.notes.delete = (route, requestObject) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };

    if(requestObject.queryObject.notesID != undefined && requestObject.queryObject.emailID != undefined){
        mongo.update(DBCONST.userCollection,{email : requestObject.queryObject.emailID},{ $pull: {notes : {_id: requestObject.queryObject.notesID}}},{},SINGLE).then(resultSet => {
            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.queryObject.emailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.DELETENOTES).then(resolvedResult => {
                response.STATUS = 200;
                response.PAYLOAD = {};
                response.SMSG = "Event deleted successfully";    
                resolve(response);  
            }).catch(rejectedResult => {
                response.STATUS = 201;
                response.PAYLOAD = {};
                response.SMSG = "Event deleted successfully, unable to nortify the user";
                reject(response); 
            });
        }).catch(rejectedSet => {
             //need to add a cron here 
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

//export the module
module.exports = notesHandler;
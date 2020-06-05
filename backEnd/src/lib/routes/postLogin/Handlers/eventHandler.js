/*
* Event Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,SINGLE,OAuthCONST,EMAILTEMPLATES,DBCONST} = require("../../../../../../lib/constants/contants");
const googleApis = require("../../../googleApis/googleAPI");
const {randValueGenerator} = require("../../../utils/helper");
const project = require("../../../classObjects/projectClass");

//declaring the module
const eventHandler = {};

//router for all the project routes
//params --> route - string, requestObject - object
//returns --> promise - object
eventHandler.event = (route,requestObject) => new Promise((resolve,reject) => {

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
            eventHandler.event.post(route,requestObject).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "PUT" :
            eventHandler.event.put(route,requestObject).then(resolvedResult => {
                    resolve(resolvedResult);
                }).catch(rejectedResult => {
                    reject(rejectedResult);
                }); 
              break;
          case "DELETE" : 
            eventHandler.event.delete(route,requestObject).then(resolvedResult => {
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

//event post route
//params --> route - string, requestObject - object
//returns --> promise - object
eventHandler.event.post = (route, requestObject) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    requestObject.reqBody.eventObject._id = randValueGenerator();
    if(requestObject.reqBody.hasOwnProperty("eventObject")){
        mongo.update(DBCONST.userCollection , {_id : requestObject.cookieid},{$push:{events : {...requestObject.reqBody.eventObject}}},{},SINGLE).then(resolvedSet => {
            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,requestObject.reqBody.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDEVENT).then(resolvedResult => {
                response.STATUS = 200;
                response.PAYLOAD = {};
                response.SMSG = "board details updated successfully";
                resolve(response);
            }).catch(rejectedResult => {
                response.STATUS = 201;
                response.PAYLOAD = {};
                response.SMSG = "board details updated successfully, unable to nortify the contributor"; //add a cron here
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

//event put route
//params --> route - string, requestObject - object
//returns --> promise - object
eventHandler.event.put = (route, requestObject) => new Promise((resolve,reject) => {
   
    if(requestObject.reqBody.hasOwnProperty("EventTitle") || requestObject.reqBody.hasOwnProperty("Description") ||
        requestObject.reqBody.hasOwnProperty("EventType") || requestObject.reqBody.hasOwnProperty("StartTime") ||
            requestObject.reqBody.hasOwnProperty("EndTime")){
                
                let set = {}; 
                let updateQuery = {};
                if(requestObject.reqBody.hasOwnProperty("EventTitle")){
                    set.EventTitle = requestObject.reqBody.EventTitle;
                }if(requestObject.reqBody.hasOwnProperty("Description")){
                    set.Description = requestObject.reqBody.Description;
                }if(requestObject.reqBody.hasOwnProperty("EventType")){
                    set.EventType = requestObject.reqBody.EventType;
                }if(requestObject.reqBody.hasOwnProperty("StartTime")){
                    set.StartTime = requestObject.reqBody.StartTime;
                }if(requestObject.reqBody.hasOwnProperty("EndTime")){
                    set.EndTime = requestObject.reqBody.EndTime;
                }
                set.modificationdate = generateCurrentDate();
                if(JSON.stringify(set)!=JSON.stringify({})){
                    updateQuery["$set"] = {...set};
                } 
        
    }else{
        response.STATUS = 400;
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        reject(response); 
    }
});

//event delete route
//params --> route - string, requestObject - object
//returns --> promise - object
eventHandler.event.delete = (route, requestObject) => new Promise((resolve,reject) => {
    
});

//export the module
module.exports = eventHandler;
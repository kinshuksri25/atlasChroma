/*
* User Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const story = require("../../../classObjects/storyClass");
const {EMSG,SMSG,DBCONST} = require("../../../../../../lib/constants/contants");
const randValueGenerator = require("../../../utils/helper");

//declaring the module
const storyHandler = {};

//router for all the stories routes
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories = (route,requestObject) => new Promise((resolve,reject) => {     
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
    };
    if(requestObject.hasOwnProperty("method")){
        switch(requestObject.method){
          case "POST" :
             storyHandler.stories.post(route,requestObject).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "GET" : 
              break;
          case "PUT" : 
              break;
          case "DELETE" : 
              break;
        }
    }else{
      response.STATUS = 500;
      response.EMSG = EMSG.SVR_HDNLS_MTHNTFND;
      reject(response);
    }
});


//stories post route
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories.post = (route,requestObject) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };

    if(requestObject.reqBody.hasOwnProperty('Name') && 
       requestObject.reqBody.hasOwnProperty('Description') && 
       requestObject.reqBody.hasOwnProperty('Contributor') && 
       requestObject.reqBody.hasOwnProperty('CurrentStatus') && 
       requestObject.reqBody.hasOwnProperty('Priority') && 
       requestObject.reqBody.hasOwnProperty('StartDate') && 
       requestObject.reqBody.hasOwnProperty('DueDate') && 
       requestObject.reqBody.hasOwnProperty('InitialComments')&&
       requestObject.reqBody.hasOwnProperty('ProjectID')){

        let storyObject = new story({_id:randValueGenerator(),
                                    name:requestObject.reqBody.Name,
                                    description:requestObject.reqBody.Description,
                                    contributors:requestObject.reqBody.Contributors,
                                    currentstatus:requestObject.reqBody.CurrentStatus,
                                    priority:requestObject.reqBody.Priority,
                                    startdate:requestObject.reqBody.StartDate,
                                    duedate:requestObject.reqBody.DueDate,
                                    comments:requestObject.reqBody.Comments}); 
    
        mongo.insert(DBCONST.storyCollection,storyObject.getStoryDetails(),{}).then(resolveResult => {
            let insertedID = resolveResult.insertedId;
            let updateObject = {"boarddetails.stories" : insertedID};
            mongo.update(DBCONST.projectCollection,{ _id : requestObject.reqBody.ProjectID },{ $push: {...updateObject}}, {}, SINGLE).then(updateSet => {
                response.STATUS = 200;
                response.PAYLOAD = resolveResult.ops[0];
                response.SMSG = SMSG.SVR_SHH_PRJUP;        
                resolve(response);     
            }).catch(rejectSet => {
                throw rejectSet;
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

//stories get route
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories.get = (requestObject) = new Promise((resolve,reject) => {
    
});

//exporting the module
module.exports = storyHandler;

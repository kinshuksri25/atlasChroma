/*
* Project Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,SINGLE,OAuthCONST,EMAILTEMPLATES,DBCONST} = require("../../../../../../lib/constants/contants");
const googleApis = require("../../../googleApis/googleAPI");
const story = require("../../../classObjects/storyClass");

//declaring the module
const storyHandler = {};

//router for all the story routes
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
            case "GET" :
                break;
            case "POST" : 
                storyHandler.stories.post(route,requestObject).then(resolvedResult => {
                     resolve(resolvedResult);
                }).catch(rejectedResult => {
                     reject(rejectedResult);
                });
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

//story post route
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories.post = (route,requestObject) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
  
   if(requestObject.reqBody.hasOwnProperty("StoryTitle")&&
      requestObject.reqBody.hasOwnProperty("Description")&&
      requestObject.reqBody.hasOwnProperty("Contributor")&&
      requestObject.reqBody.hasOwnProperty("Priority")&&
      requestObject.reqBody.hasOwnProperty("EndDate")&&
      requestObject.reqBody.hasOwnProperty("currentStatus")&&
      requestObject.reqBody.hasOwnProperty("Comments")&&
      requestObject.reqBody.hasOwnProperty("projectID")){
     //create the stories object
     let newStory = new story({storytitle : requestObject.reqBody.StoryTitle,
        description : requestObject.reqBody.Description,
        contributor : requestObject.reqBody.Contributor,
        priority : requestObject.reqBody.Priority,
        startdate : Date.now(),
        duedate : requestObject.reqBody.EndDate,
        currentstatus : requestObject.reqBody.currentStatus,
        comments : requestObject.reqBody.Comments}); 

    mongo.update(DBCONST.projectCollection,{_id : requestObject.reqBody.projectID},{$push : {storydetails : newStory}},{},SINGLE).then(resolvedResult =>{
        
        mongo.read(DBCONST.userCollection,{username: requestObject.reqBody.Contributor},{}).then(resolvedResult => {
            let contributorEmailID = resolvedResult[0].email;
            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,contributorEmailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDSTORY).then(resolvedResult => {
                response.STATUS = 200;
                response.PAYLOAD = {...newStory.getStoryDetails()};
                response.SMSG = "board details updated successfully";
                resolve(response);
            }).catch(rejectedResult => {
                response.STATUS = 201;
                response.PAYLOAD = {...newStory.getStoryDetails()};
                response.SMSG = "board details updated successfully, unable to nortify the contributor"; //add a cron here
                resolve(response);    
            });
        }).catch(rejectedResult => {
            response.STATUS = 201;
            response.PAYLOAD = {...newStory.getStoryDetails()};
            response.SMSG = "board details updated successfully, unable to nortify the contributor"; //add a cron here
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
module.exports = storyHandler;

/*
* Project Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,SINGLE,OAuthCONST,EMAILTEMPLATES,DBCONST} = require("../../../../../../lib/constants/contants");
const googleApis = require("../../../googleApis/googleAPI");
const story = require("../../../classObjects/storyClass");
const { generateCurrentDate } = require("../../../utils/helper");

//declaring the module
const storyHandler = {};

//router for all the story routes
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories = (route,requestObject,io) => new Promise((resolve,reject) => {
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
                storyHandler.stories.post(route,requestObject,io).then(resolvedResult => {
                    resolve(resolvedResult);
                }).catch(rejectedResult => {
                    reject(rejectedResult);
                });
                break;
            case "PUT" :
                storyHandler.stories.put(route,requestObject,io).then(resolvedResult => {
                    resolve(resolvedResult);
                }).catch(rejectedResult => {
                    reject(rejectedResult);
                });
                break;
            case "DELETE" : 
                storyHandler.stories.delete(route,requestObject,io).then(resolvedResult => {
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

//story post route
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories.post = (route,requestObject,io) => new Promise((resolve,reject) => {
    
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
            duedate : requestObject.reqBody.EndDate,
            currentstatus : requestObject.reqBody.currentStatus,
            comments : requestObject.reqBody.Comments,
            status : "Ongoing"}); 

        let template = {
            storyLink : "",
            storyName : requestObject.reqBody.StoryTitle,
            projectName : requestObject.reqBody.projectName
        };

    mongo.update(DBCONST.projectCollection,{_id : requestObject.reqBody.projectID},{$push : {storydetails : newStory},$set:{modificationdate: generateCurrentDate()}},{returnOriginal: false},SINGLE).then(resolvedResult =>{
        io.emit("updatingDetails",{event : "addingStory", data : {...newStory.getStoryDetails(),projectID : requestObject.reqBody.projectID}});
        mongo.read(DBCONST.userCollection,{username: requestObject.reqBody.Contributor},{}).then(resolvedResult => {
            let contributorEmailID = resolvedResult[0].email;
            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,contributorEmailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDSTORY,template).then(resolvedEmail => {
                response.STATUS = 200;
                response.PAYLOAD = {};
                response.SMSG = SMSG.SVR_SHH_STRADDSUC;
                resolve(response);
            }).catch(rejectedEmail => {
                let payload = {
                    "participants" : [contributorEmailID],
                    "template" : "ADDSTORY",
                    "templateData" : template
                };
                mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                throw rejectedEmail;
            });
        }).catch(rejectedResult => {
            response.STATUS = 201;
            response.PAYLOAD = {};
            response.SMSG = SMSG.SVR_SHH_STRADDSUC;
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

//story put route
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories.put = (route,requestObject,io) => new Promise((resolve,reject) => {
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
    };
    let set = {};
    if(requestObject.reqBody.hasOwnProperty("storyDetails") && requestObject.reqBody.storyDetails.hasOwnProperty("_id")){
        if(requestObject.reqBody.storyDetails.hasOwnProperty("StoryTitle")){
            set["storydetails.$.storytitle"] = requestObject.reqBody.storyDetails.StoryTitle;
        }if(requestObject.reqBody.storyDetails.hasOwnProperty("Description")){
            set["storydetails.$.description"] = requestObject.reqBody.storyDetails.Description;
        }if(requestObject.reqBody.storyDetails.hasOwnProperty("Contributor")){
            set["storydetails.$.contributor"] = requestObject.reqBody.storyDetails.Contributor;
        }if(requestObject.reqBody.storyDetails.hasOwnProperty("Priority")){
            set["storydetails.$.priority"] = requestObject.reqBody.storyDetails.Priority;
        }if(requestObject.reqBody.storyDetails.hasOwnProperty("DueDate")){
            set["storydetails.$.duedate"] = requestObject.reqBody.storyDetails.DueDate;
        }if(requestObject.reqBody.storyDetails.hasOwnProperty("currentStatus")){
            set["storydetails.$.currentstatus"] = requestObject.reqBody.storyDetails.currentStatus;
        }if(requestObject.reqBody.storyDetails.hasOwnProperty("Comments")){
            set["storydetails.$.comments"] = requestObject.reqBody.storyDetails.Comments;
        }if(requestObject.reqBody.storyDetails.hasOwnProperty("status")){
            set["storydetails.$.status"] = requestObject.reqBody.storyDetails.status;
        }
        let currentDate = generateCurrentDate();
    
        set.modificationdate = currentDate;

        let template = {
            storyName : requestObject.reqBody.oldStoryName,
            storyLink : requestObject.reqBody.storyDetails._id,
            status : requestObject.reqBody.storyDetails.hasOwnProperty("currentStatus") ? "moved to a different phase" : "edited",
        };

        mongo.update(DBCONST.projectCollection,{"storydetails._id" : requestObject.reqBody.storyDetails._id},{$set : {...set}},{returnOriginal: false},SINGLE).then(resolvedResult => {
            let updatedProject = resolvedResult.value;
            let updatedStories;
            updatedProject.storydetails.map(story => {
                if(story._id == requestObject.reqBody.storyDetails._id)
                    updatedStories =  story;
            });
            io.emit("updatingDetails",{event : "updatingStory", data : {...updatedStories, projectID : updatedProject._id}});
            template.projectName = updatedProject.title;
            mongo.read(DBCONST.userCollection,{username : updatedStories.contributor},{}).then(resolvedResult => {
                let contributorEmailID = resolvedResult[0].email;
                if(requestObject.reqBody.storyDetails.status == "Finished"){
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,contributorEmailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.FINISHEDSTORY,template).then(resolvedEmail => {
                        response.STATUS = 200;
                        response.PAYLOAD = {};
                        response.SMSG = SMSG.SVR_SHH_STRUPSUC;
                        resolve(response);
                    }).catch(rejectedEmail => {
                        let payload = {
                            "participants" : [contributorEmailID],
                            "template" : "FINISHEDSTORY",
                            "templateData" : template
                        };
                        mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                        response.STATUS = 201;
                        response.PAYLOAD = {};
                        response.SMSG = SMSG.SVR_SHH_ISTRUPSUC;
                        resolve(response);    
                    });
                }else{
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,contributorEmailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.MOVESTORY,template).then(resolvedEmail => {
                        response.STATUS = 200;
                        response.PAYLOAD = {};
                        response.SMSG = SMSG.SVR_SHH_STRUPSUC;
                        resolve(response);
                    }).catch(rejectedEmail => {
                        let payload = {
                            "participants" : [contributorEmailID],
                            "template" : "MOVESTORY",
                            "templateData" : template
                        };
                        mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                        response.STATUS = 201;
                        response.PAYLOAD = {};
                        response.SMSG = SMSG.SVR_SHH_ISTRUPSUC;
                        resolve(response);    
                    });
                }
            }).catch(rejectedResult => {
                response.STATUS = 201;
                response.PAYLOAD = {};
                response.SMSG = SMSG.SVR_SHH_STRUPSUC;
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

//story delete route
//params --> route - string, requestObject - object
//returns --> promise - object
storyHandler.stories.delete = (route,requestObject,io) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.queryObject.projectID != undefined && requestObject.queryObject.storyID != undefined ){
        mongo.update(DBCONST.projectCollection,{_id : requestObject.queryObject.projectID},{$pull : {storydetails : {_id : requestObject.queryObject.storyID}}},{returnOriginal: true},SINGLE).then(resolvedResult => { 
            let originalProject = resolvedResult.value;  
            let deletedStory;
            originalProject.storydetails.map(story => {
                if(story._id == requestObject.queryObject.storyID)
                    deletedStory = story;
            });
            io.emit("updatingDetails",{event : "deletingStory", data : {projectID : originalProject._id, storyID : deletedStory._id}});
            mongo.read(DBCONST.userCollection,{username: deletedStory.contributor },{}).then(resolvedResult => {;
                let contributorEmailID = resolvedResult[0].email;
                let template = {
                    "storyName" : deletedStory.title,
                    "projectName" : originalProject.projectName,
                    "projectLink" : ""
                };
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,contributorEmailID,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.DELETESTORY,template).then(resolvedEmail => {
                    response.STATUS = 200;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_SHH_STRDELSUC;
                    resolve(response);
                }).catch(rejectedEmail => {
                    let payload = {
                        "participants" : [contributorEmailID],
                        "template" : "DELETESTORY",
                        "templateData" : template
                    };
                    mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                    response.STATUS = 201;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_SHH_ISTRDELSUC; 
                    resolve(response);    
                });
            }).catch(rejectedResult => {
                response.STATUS = 201;
                response.PAYLOAD = {};
                response.SMSG = SMSG.SVR_SHH_ISTRDELSUC; 
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

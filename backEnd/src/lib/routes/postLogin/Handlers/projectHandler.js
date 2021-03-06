/*
* Project Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {generateCurrentDate} = require('../../../utils/helper');
const {EMSG,SMSG,SINGLE,MULTIPLE,OAuthCONST,EMAILTEMPLATES,DBCONST} = require("../../../../../../lib/constants/contants");
const googleApis = require("../../../googleApis/googleAPI");
const project = require("../../../classObjects/projectClass");


//declaring the module
const projectHandler = {};

//router for all the project routes
//params --> route - string, requestObject - object
//returns --> promise - object
projectHandler.project = (route,requestObject,io) => new Promise((resolve,reject) => {

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
            projectHandler.project.post(route,requestObject,io).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "PUT" :
            projectHandler.project.put(route,requestObject,io).then(resolvedResult => {
                    resolve(resolvedResult);
                }).catch(rejectedResult => {
                    reject(rejectedResult);
                }); 
              break;
          case "DELETE" : 
            projectHandler.project.delete(route,requestObject,io).then(resolvedResult => {
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

//project post route
//params --> route - string, requestObject - object
//returns --> promise - object
projectHandler.project.post = (route,requestObject,io) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    let templateBuilder = {};       
    if(requestObject.reqBody.hasOwnProperty('description') && requestObject.reqBody.hasOwnProperty('title') && requestObject.reqBody.hasOwnProperty('contributors') && requestObject.reqBody.hasOwnProperty('projectleader')){
        let projectClass = new project({title : requestObject.reqBody.title,
            description : requestObject.reqBody.description,
            projectlead : requestObject.reqBody.projectleader,
            contributors : requestObject.reqBody.contributors,
            duedate:requestObject.reqBody.duedate});

        let projectObject = projectClass.getProjectDetails();

        mongo.insert(DBCONST.projectCollection,projectObject,{}).then(resolveResult => {           
            let insertedID = resolveResult.insertedId;
            projectObject._id = insertedID;
            let projectLead = "";
            mongo.update(DBCONST.userCollection,{ username: { $in: projectObject.contributors } },{ $push: {projects : insertedID}}, {},MULTIPLE).then(resolvedSet => {
                io.emit("updatingDetails",{event : "addingProject", data : {contributors : [...projectObject.contributors],body : {...projectObject}}});
                mongo.read(DBCONST.userCollection,{username: { $in: projectObject.contributors }},{projection : {username: 1,email : 1, _id : 0,firstname : 1,lastname: 1}}).then(resolvedSet => {

                    let recipientList = [];
                    let contributors  = "";
                    resolvedSet.map(user => {
                        recipientList.push(user.email);
                        projectLead = user.username == requestObject.reqBody.projectleader ? user.firstname+" "+user.lastname : projectLead;
                        contributors += user.firstname+" "+user.lastname+"<br>";
                    });
                    templateBuilder = {
                        projectName : requestObject.reqBody.title,
                        projectLink : "",
                        projectLead : projectLead,
                        contributors : contributors
                    };
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,recipientList,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDPROJECT,templateBuilder).then(resolvedEmail => {
                        response.STATUS = 200;
                        response.PAYLOAD = {};
                        response.SMSG = SMSG.SVR_PHH_PRJADDSUC; 
                               
                        resolve(response);  
                    }).catch(rejectedEmail => {
                        let payload = {
                            "participants" : [...recipientList],
                            "template" : "ADDPROJECT",
                            "templateData" : templateBuilder
                        };
                        mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                        throw rejectedEmail;
                    });
                }).catch(rejectedSet => {
                    response.STATUS = 201;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_PHH_IPRJADDSUC;
                    resolve(response);  
                });
            }).catch(resolvedSet => {
                throw rejectSet;
            });
                
        }).catch(rejectedResult => {
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

//project put route
//params --> route - string, requestObject - object
//returns --> promise - object
projectHandler.project.put = (route,requestObject,io) => new Promise((resolve,reject) => {

    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };

    if(requestObject.reqBody.hasOwnProperty("title") 
        || requestObject.reqBody.hasOwnProperty("description") 
        || requestObject.reqBody.hasOwnProperty("contributors") 
        || requestObject.reqBody.hasOwnProperty('projectleader') 
        || requestObject.reqBody.hasOwnProperty("templatedetails")
        || requestObject.reqBody.hasOwnProperty("duedate")
        || requestObject.reqBody.hasOwnProperty("status")){

    let push = {};
    let set = {}; 
    let updateQuery = {};
    if(requestObject.reqBody.hasOwnProperty("title")){
        set.title = requestObject.reqBody.title;
    }if(requestObject.reqBody.hasOwnProperty("description")){
        set.description = requestObject.reqBody.description;
    }if(requestObject.reqBody.hasOwnProperty("contributors")){
        set.contributors = requestObject.reqBody.contributors;
    }if(requestObject.reqBody.hasOwnProperty("projectleader")){
        set.projectlead = requestObject.reqBody.projectleader;
    }if(requestObject.reqBody.hasOwnProperty("templatedetails")){
        set.templatedetails = requestObject.reqBody.templatedetails;
    }if(requestObject.reqBody.hasOwnProperty("duedate")){
        set.duedate = requestObject.reqBody.duedate;
    }if(requestObject.reqBody.hasOwnProperty("status")){
        set.status = requestObject.reqBody.status;
    }

    set.modificationdate = generateCurrentDate();
    if(JSON.stringify(set)!=JSON.stringify({})){
        updateQuery["$set"] = {...set};
    } 
    
    mongo.update(DBCONST.projectCollection , {_id : requestObject.reqBody.projectID},{...updateQuery},{returnOriginal: false},SINGLE).then(resolvedResult => {
        let updatedProject = resolvedResult.value;
        let editedContributors = [...updatedProject.contributors];
        let newContributors = [];
        let oldContributors = [];
        let removedContributors = [];
        requestObject.reqBody.oldContributors.map(oldContri => {
            editedContributors.indexOf(oldContri) == -1 && removedContributors.push(oldContri);
            editedContributors.indexOf(oldContri) != -1 && oldContributors.push(oldContri);
        });

        editedContributors.map(contri => {
            oldContributors.indexOf(contri) == -1 && newContributors.push(contri);
        });

        mongo.update(DBCONST.userCollection,{username : {$in:[...removedContributors]}},{$pull:{projects:requestObject.reqBody.projectID}},{}, SINGLE).then(resolvedResult => {
            mongo.update(DBCONST.userCollection,{username : {$in:[...newContributors]}},{$push:{projects:requestObject.reqBody.projectID}},{}, SINGLE).then(resolvedResult => {

                io.emit("updatingDetails",{event : "editingProject", data : updatedProject}); 
                newContributors.length > 0 && io.emit("updatingDetails",{event : "addingProject", data : {contributors : [...newContributors],body : {...updatedProject}}});
                removedContributors.length > 0 && io.emit("updatingDetails",{event : "deletingProject", data : {contributors : [...removedContributors],_id:requestObject.reqBody.projectID}});

                mongo.read(DBCONST.userCollection,{username : {$in: [...newContributors,...removedContributors,...oldContributors]}},{projection : {username : 1, email : 1, _id : 0, firstname : 1, lastname : 1}}).then(resolvedSet => {

                    let newContributorsEmail = [];
                    let oldContributorsEmail = [];
                    let removedContributorsEmail = [];
                    let templateBuilder = {oldLeader:"",newLeader:"",projectName:""};
                    resolvedSet.map(user => {
                        newContributors.indexOf(user.username) != -1 && newContributorsEmail.push(user.email);
                        oldContributors.indexOf(user.username) != -1 && oldContributorsEmail.push(user.email);
                        removedContributors.indexOf(user.username) != -1 && removedContributorsEmail.push(user.email);
                        
                        templateBuilder.oldLeader = requestObject.reqBody.oldlead == user.username ? user.firstname+" "+user.lastname : templateBuilder.oldLeader;
                        templateBuilder.newLeader = requestObject.reqBody.projectleader== user.username ? user.firstname+" "+user.lastname : templateBuilder.newLeader;
                    });
                    templateBuilder.projectName = updatedProject.title;

                    requestObject.reqBody.hasOwnProperty("projectleader") && googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,[...requestObject.reqBody.projectLeadEmails],OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.CHANGELEAD,templateBuilder);
                    templateBuilder - {};
                    //send emails to respective groups
                    if(newContributorsEmail.length == 0 && removedContributorsEmail.length != 0){
                        templateBuilder = {
                            projectName : updatedProject.title,
                            projectLink : ""  
                        };
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,removedContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.REMOVEDUSER,templateBuilder).then(resolvedEmail => {
                            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,oldContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITPROJECT,templateBuilder).then(resolvedEmail => {
                                response.STATUS = 200;
                                response.PAYLOAD = {};
                                response.SMSG = SMSG.SVR_PHH_PRJUP;           
                                resolve(response); 
                            }).catch(rejectedEmail => {
                                let payload = {
                                    "participants" : [...oldContributorsEmail],
                                    "template" : "EDITPROJECT",
                                    "templateBuilder" : templateBuilder
                                };
                                mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                                throw rejectedEmail;
                            });
                        }).catch(rejectedEmail => {
                            let payload = {
                                "participants" : [...removedContributorsEmail],
                                "template" : "REMOVEDUSER",
                                "templateBuilder" : templateBuilder
                            };
                            mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                            throw rejectedEmail;
                        });
                    }else if(removedContributorsEmail.length == 0 && newContributorsEmail.length != 0){
                        templateBuilder = {
                            projectName : updatedProject.title,
                            projectLink : "",
                            projectLead : updatedProject.projectlead,
                            contributors : updatedProject.contributors
                        };
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,newContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDPROJECT,templateBuilder).then(resolvedEmail => {
                            templateBuilder = {
                                projectName : updatedProject.title,
                                projectLink : ""  
                            };
                            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,oldContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITPROJECT,templateBuilder).then(resolvedEmail => {
                                response.STATUS = 200;
                                response.PAYLOAD = {};
                                response.SMSG = SMSG.SVR_PHH_PRJUPSUC;      
                                resolve(response); 
                            }).catch(rejectedEmail => {
                                let payload = {
                                    "participants" : [...oldContributorsEmail],
                                    "template" : "EDITPROJECT",
                                    "templateBuilder" : templateBuilder
                                };
                                mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                                throw rejectedEmail;
                            });
                        }).catch(rejectedEmail => {
                            let payload = {
                                "participants" : [...newContributorsEmail],
                                "template" : "ADDPROJECT",
                                "templateBuilder" : templateBuilder
                            };
                            mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                            throw rejectedEmail;
                        });
                    }else{
                        templateBuilder = {
                            projectName : updatedProject.title,
                            projectLink : ""  
                        };
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,oldContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITPROJECT,templateBuilder).then(resolvedEmail => {
                            response.STATUS = 200;
                            response.PAYLOAD = {};
                            response.SMSG = SMSG.SVR_PHH_PRJUPSUC;        
                            resolve(response); 
                        }).catch(rejectedEmail => {
                            let payload = {
                                "participants" : [...oldContributorsEmail],
                                "template" : "EDITPROJECT",
                                "templateBuilder" : templateBuilder
                            };
                            mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                            throw rejectedEmail;
                        });
                    }
                }).catch(rejectedSet => {
                    response.STATUS = 201;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_PHH_IPRJUPSUC;
                    resolve(response);
                });
            }).catch(rejectedResult => {
                throw rejectedSet;
            });
        }).catch(rejectedResult => {
            throw rejectedSet;
        });
    }).catch(rejectedResult => {
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

//project delete route
//params --> route - string, requestObject - object
//returns --> promise - object
projectHandler.project.delete = (route,requestObject,io) => new Promise((resolve,reject) => {

    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };       

    if(requestObject.queryObject.projectID != undefined){
        mongo.delete(DBCONST.projectCollection,{_id : requestObject.queryObject.projectID},{$pull : {_id : requestObject.queryObject.projectID}},{remove: true},SINGLE).then( resolvedResult => {
            let deletedData = resolvedResult.value;
            mongo.update(DBCONST.userCollection,{username: { $in: deletedData.contributors }},{ $pull: {projects : requestObject.queryObject.projectID}}, {}, MULTIPLE).then(resolvedSet => {
               mongo.read(DBCONST.userCollection,{username: { $in: deletedData.contributors }},{projection : {email : 1, _id : 0}}).then(resolvedSet => {
                let recipientList = [];
                resolvedSet.map(user => {
                    recipientList.push(user.email);
                });
                let templateBuilder = {
                    projectName : deletedData.title,
                    projectLink : ""
                };
                io.emit("updatingDetails",{event : "deletingProject", data : deletedData}); 
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,recipientList,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.DELETEDPROJECT,templateBuilder).then(emailResolve => {
                    response.STATUS = 200;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_PHH_PRJDELSUC;           
                    resolve(response);  
                }).catch(rejectedResult => {
                    let payload = {
                        "participants" : [...recipientList],
                        "template" : "DELETEDPROJECT",
                        "templateData" : templateBuilder
                    };
                    mongo.insert(DBCONST.failedEmailCollection, {payload}, {});
                    throw rejectedResult;
                });
               }).catch(rejectedSet => {
                    response.STATUS = 201;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_PHH_IPRJDELSUC;   
                    reject(response); 
               });
            }).catch(rejectedSet => {
                //need to add a cron here 
                response.STATUS = 500;
                response.EMSG = rejectedSet;
                reject(response); 
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
module.exports = projectHandler;

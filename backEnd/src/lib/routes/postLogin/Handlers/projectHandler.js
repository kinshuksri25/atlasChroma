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
projectHandler.project = (route,requestObject) => new Promise((resolve,reject) => {

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
            projectHandler.project.post(route,requestObject).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "PUT" :
            projectHandler.project.put(route,requestObject).then(resolvedResult => {
                    resolve(resolvedResult);
                }).catch(rejectedResult => {
                    reject(rejectedResult);
                }); 
              break;
          case "DELETE" : 
            projectHandler.project.delete(route,requestObject).then(resolvedResult => {
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
projectHandler.project.post = (route,requestObject) => new Promise((resolve,reject) => {
    
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.reqBody.hasOwnProperty('description') && requestObject.reqBody.hasOwnProperty('title') && requestObject.reqBody.hasOwnProperty('contributors') && requestObject.reqBody.hasOwnProperty('projectleader')){
        let projectClass = new project({title : requestObject.reqBody.title,
            description : requestObject.reqBody.description,
            projectlead : requestObject.reqBody.projectleader,
            contributors : requestObject.reqBody.contributors});

        let projectObject = projectClass.getProjectDetails();

        mongo.insert(DBCONST.projectCollection,projectObject,{}).then(resolveResult => {           
            let insertedID = resolveResult.insertedId;
            mongo.update(DBCONST.userCollection,{ username: { $in: projectObject.contributors } },{ $push: {projects : insertedID}}, {},MULTIPLE).then(updateSet => {
                mongo.read(DBCONST.userCollection,{username: { $in: projectObject.contributors }},{projection : {email : 1, _id : 0}}).then(resolvedSet => {
                    let recipientList = [];
                    resolvedSet.map(user => {
                        recipientList.push(user.email);
                    });
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,recipientList,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDPROJECT).then(resolvedResult => {
                        response.STATUS = 200;
                        response.PAYLOAD = resolveResult.ops[0];
                        response.SMSG = SMSG.SVR_SHH_PRJUP;        
                        resolve(response);  
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });
                }).catch(rejectedSet => {
                    response.STATUS = 201;
                    response.PAYLOAD = resolveResult.ops[0];
                    response.SMSG = "Project added, unabled to nortify the contributors";        
                    resolve(response);  
                });
            }).catch(rejectSet => {
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
projectHandler.project.put = (route,requestObject) => new Promise((resolve,reject) => {

    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    if(requestObject.reqBody.hasOwnProperty("title") 
        || requestObject.reqBody.hasOwnProperty("description") 
        || requestObject.reqBody.hasOwnProperty("contributors") 
        || requestObject.reqBody.hasOwnProperty('projectleader') 
        || requestObject.reqBody.hasOwnProperty("templatedetails")){

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
        set.projectlead = requestObject.reqBody.projectlead;
    }if(requestObject.reqBody.hasOwnProperty("templatedetails")){
        set.templatedetails = requestObject.reqBody.templatedetails;
    }
    set.modificationdate = generateCurrentDate();
    if(JSON.stringify(set)!=JSON.stringify({})){
        updateQuery["$set"] = {...set};
    } 
    if(JSON.stringify(push)!=JSON.stringify({})){
        updateQuery["$push"] = {...push};
    }
    
    mongo.update(DBCONST.projectCollection , {_id : requestObject.reqBody.projectID},{...updateQuery},{},SINGLE).then(resolvedSet => {
        let editedContributors = [...requestObject.reqBody.contributors];
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

        mongo.read(DBCONST.userCollection,{username : {$in: [...newContributors,...removedContributors,...oldContributors]}},{projection : {username : 1, email : 1, _id : 0}}).then(resolvedSet => {

            let newContributorsEmail = [];
            let oldContributorsEmail = [];
            let removedContributorsEmail = [];

            resolvedSet.map(user => {
                newContributors.indexOf(user.username) != -1 && newContributorsEmail.push(user.email);
                oldContributors.indexOf(user.username) != -1 && oldContributorsEmail.push(user.email);
                removedContributors.indexOf(user.username) != -1 && removedContributorsEmail.push(user.email);
            });

            //send emails to respective groups
            if(newContributorsEmail.length == 0 && removedContributorsEmail.length != 0){
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,removedContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.REMOVEDUSER).then(resolvedResult => {
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,oldContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITPROJECT).then(resolvedResult => {
                        response.STATUS = 200;
                        response.PAYLOAD = {};
                        response.SMSG = SMSG.SVR_SHH_PRJUP;        
                        resolve(response); 
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            }else if(removedContributorsEmail.length == 0 && newContributorsEmail.length != 0){
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,newContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDUSER).then(resolvedResult => {
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,oldContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITPROJECT).then(resolvedResult => {
                        response.STATUS = 200;
                        response.PAYLOAD = {};
                        response.SMSG = SMSG.SVR_SHH_PRJUP;        
                        resolve(response); 
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            }else{
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,oldContributorsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.EDITPROJECT).then(resolvedResult => {
                    response.STATUS = 200;
                    response.PAYLOAD = {};
                    response.SMSG = SMSG.SVR_SHH_PRJUP;        
                    resolve(response); 
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            }
        }).catch(rejectedSet => {
            response.STATUS = 201;
            response.PAYLOAD = {};
            response.SMSG = "board details updated successfully, unable to nortify contributors";
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

//project delete route
//params --> route - string, requestObject - object
//returns --> promise - object
projectHandler.project.delete = (route,requestObject) => new Promise((resolve,reject) => {

    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };    
    if(requestObject.queryObject.projectID != undefined && requestObject.queryObject.contributors != undefined){
        mongo.delete(DBCONST.projectCollection,{_id : requestObject.queryObject.projectID},{},SINGLE).then( resolvedResult => {
            mongo.update(DBCONST.userCollection,{username: { $in: JSON.parse(requestObject.queryObject.contributors) }},{ $pull: {projects : requestObject.queryObject.projectID}}, {}, MULTIPLE).then(resolvedResult => {
               mongo.read(DBCONST.userCollection,{username: { $in: JSON.parse(requestObject.queryObject.contributors) }},{projection : {email : 1, _id : 0}}).then(resolvedSet => {
                let recipientList = [];
                resolvedSet.map(user => {
                    recipientList.push(user.email);
                });
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,recipientList,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.DELETEDPROJECT).then(emailResolve => {
                    response.STATUS = 200;
                    response.PAYLOAD = resolvedResult;
                    response.SMSG = "Project deleted successfully";    
                    resolve(response);  
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
               }).catch(rejectedSet => {
                    response.STATUS = 201;
                    response.PAYLOAD = {};
                    response.SMSG = "Project deleted successfully, unable to nortify the contributors";
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

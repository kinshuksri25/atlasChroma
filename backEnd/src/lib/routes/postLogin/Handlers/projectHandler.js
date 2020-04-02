/*
* Project Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,SINGLE,DBCONST} = require("../../../../../../lib/constants/contants");
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
            mongo.update(DBCONST.userCollection,{ username: { $in: projectObject.contributors } },{ $push: {projects : insertedID}}, {}, SINGLE).then(updateSet => {
                response.STATUS = 200;
                response.PAYLOAD = resolveResult.ops[0];
                response.SMSG = SMSG.SVR_PHH_USRUP;        
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
        || requestObject.reqBody.hasOwnProperty("boarddetails")
        || requestObject.reqBody.hasOwnProperty("storydetails")){
            mongo.read(DBCONST.projectCollection,{_id : requestObject.reqBody.projectID},{}).then(resolvedResult => {
                if(JSON.stringify(resolvedResult) != JSON.stringify([])){
                    let projectObject = resolvedResult[0];
                    projectObject.title = requestObject.reqBody.hasOwnProperty("title") ? requestObject.reqBody.title : projectObject.title;
                    projectObject.description = requestObject.reqBody.hasOwnProperty("description") ? requestObject.reqBody.description : projectObject.description;
                    projectObject.contributors = requestObject.reqBody.hasOwnProperty("contributors") ? requestObject.reqBody.contributors : projectObject.contributors;
                    projectObject.projectleader = requestObject.reqBody.hasOwnProperty("projectleader") ? requestObject.reqBody.projectleader : projectObject.projectleader;
                    projectObject.boarddetails.templatedetails = requestObject.reqBody.hasOwnProperty("boarddetails") ? requestObject.reqBody.boarddetails : projectObject.boarddetails;
                    projectObject.storydetails = requestObject.reqBody.hasOwnProperty("storydetails") ? requestObject.reqBody.storydetails : projectObject.storydetails;

                    mongo.update(DBCONST.projectCollection , {_id : requestObject.reqBody.projectID},{$set : {...projectObject}},{},SINGLE).then(resolvedSet => {
                        response.STATUS = 200;
                        response.PAYLOAD = {};
                        response.SMSG = "board details updated successfully";
                        resolve(response);
                    }).catch(rejectedSet => {
                       throw rejectedSet; 
                    });

                }else{
                    response.STATUS = 400;
                    response.EMSG = "Invalid project id";
                    reject(response);    
                }
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

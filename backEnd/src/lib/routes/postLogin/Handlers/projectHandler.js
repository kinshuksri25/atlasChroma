/*
* Project Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,SINGLE} = require("../../../../../../lib/constants/contants");
const project = require("../../../classObjects/projectClass");


//declaring the module
const projectHandler = {};

//router for all the project routes
//params --> route - string, requestObject - object
//returns --> promise - object
projectHandler.project = (requestObject) => new Promise((resolve,reject) => {
    let response = {};
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
    
    let response = {};
    if(requestObject.reqBody.hasOwnProperty('Description') && requestObject.reqBody.hasOwnProperty('ProjectType') && requestObject.reqBody.hasOwnProperty('Title') && requestObject.reqBody.hasOwnProperty('contributors') && requestObject.reqBody.hasOwnProperty('projectLeader')){
        let creationDate = Date.now();
        let projectClass = new project( requestObject.reqBody.Title,
                                        requestObject.reqBody.Description,
                                        requestObject.reqBody.projectLeader,
                                        requestObject.reqBody.ProjectType,
                                        requestObject.reqBody.contributors,
                                        creationDate);
        let projectObject = projectClass.getProjectDetails();  
        mongo.insert(dbConstants.projectCollection,projectObject,{}).then(resolveResult => {
            
            let insertedID = resolveResult.insertedId;
            mongo.update(dbConstants.userCollection,{ UserName: { $in: projectObject.contributors } },{ $push: {Projects : insertedID}}, {}, SINGLE).then(updateSet => {
                response.STATUS = 200;
                response.PAYLOAD.projects = resolveResult.ops[0];
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


//exporting the module
module.exports = projectHandler;

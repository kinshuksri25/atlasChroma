/*
* Project Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {generateCurrentDate} = require('../../../utils/helper');
const {EMSG,SMSG,SINGLE,OAuthCONST,EMAILTEMPLATES,DBCONST} = require("../../../../../../lib/constants/contants");
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
        || requestObject.reqBody.hasOwnProperty("templatedetails")){

    let push = {};
    let set = {}; 
    let updateQuery = {};
    if(requestObject.reqBody.hasOwnProperty("title")){
        set.title = requestObject.reqBody.title;
    }if(requestObject.reqBody.hasOwnProperty("description")){
        set.description = requestObject.reqBody.description;
    }if(requestObject.reqBody.hasOwnProperty("contributors")){
        set.contributors = requestObject.reqBody.contributors
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
        response.STATUS = 200;
        response.PAYLOAD = {};
        response.SMSG = "board details updated successfully";
        resolve(response);
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
            mongo.update(DBCONST.userCollection,{username: { $in: JSON.parse(requestObject.queryObject.contributors) }},{ $pull: {projects : requestObject.queryObject.projectID}}, {}, SINGLE).then(resolvedSet => {
                response.STATUS = 200;
                response.PAYLOAD = {};
                response.SMSG = "Project deleted successfully";
                reject(response); 
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

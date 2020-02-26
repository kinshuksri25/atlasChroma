//Central Domain Logic Router

//Dependencies
const mongo = require('../data');
const project =  require('../classObjects/projectClass');
const {dbConstants,ERRORS,SINGLE} = require('../../../../lib/constants/dataConstants');
const sessionHandler = require('../sessionHandler');

//handler object definition
let domainLogicHandlers={};

//project route
//params --> requestObject -- object
domainLogicHandlers.project = (requestObject) => new Promise((resolve,reject) => {
    sessionHandler.sessionChecker(requestObject).then(resolveResult => {
        
        switch(requestObject.method){
            case "POST": domainLogicHandlers.addProject(requestObject).then(resolveResult => {
                            resolve(resolveResult);
                        }).catch(rejectResult => {
                                throw rejectResult;
                        }); 
                        break;    
            case "PUT":
                break;
            case "DELETE":
                break;
            case "GET":
                break;    
            default:  
                          
        }    
    }).catch( rejectResult => {
        reject(rejectResult);
    });
});

//addProject
//method --> POST
//params --> requestObject -- object
domainLogicHandlers.addProject = (requestObject) => new Promise((resolve,reject) => {
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
                if(resolveResult.result.ok == 1){
                    let insertedID = resolveResult.insertedId;
                    mongo.update(dbConstants.userCollection,{ UserName: { $in: projectObject.contributors } },{ $push: {Projects : insertedID}}, {}, SINGLE).then(updateSet => {
                          resolve(resolveResult.ops[0]);     
                    }).catch(rejectSet => {
                        throw rejectSet;
                    });
                }else{
                    //TODO --> change this to error code 
                    reject("error inserting the project to the db");
                }
                
        }).catch(rejectResult => {
            reject(rejectResult);
        });    
    }else{
        reject();
    } 
});

//user route
//params --> requestObject -- object
domainLogicHandlers.user = (requestObject) => new Promise((resolve,reject) => {
    sessionHandler.sessionChecker(requestObject).then(resolveResult => {
        
        switch(requestObject.method){
            case "POST":
                break;
            case "PUT":
                break;
            case "DELETE":
                break;
            case "GET": domainLogicHandlers.getUser(requestObject).then(resolveResult => {
                            resolve(resolveResult);
                        }).catch(rejectResult => {
                                throw rejectResult;
                        }); 
                        break;    
            default:          
        }    
    }).catch( rejectResult => {
        reject(rejectResult);
    });
});

//getUser route
//method --> GET
//params --> requestObject -- object
domainLogicHandlers.getUser = (requestObject) => new Promise((resolve,reject) => {
    let projection = {
        projection: {UserName:1,Email: 1}
    };
    let query ={};

    if(requestObject.queryObject.userID != undefined){
        projection.projection = { _id: 0, Password:0,RefreshToken:0,State:0};
        query={_id : requestObject.queryObject.userID}
    }

    mongo.read(dbConstants.userCollection,{...query},{...projection}).then(resultSet => {
        if(resultSet.length != 0){    
              if( resultSet[0].Projects != undefined && resultSet[0].Projects.length != 0){
                let projectList = resultSet[0].Projects;
                mongo.read(dbConstants.projectCollection,{ _id: { $in: projectList } },{}).then(resolveSet => {
                    if(resolveSet.length != 0){
                        resultSet[0].Projects = resolveSet;
                        resolve({users:{...resultSet[0]}});
                    }
                }).catch(rejectSet =>{
                     throw rejectSet;
                });     
              }else{
                resolve({users:{...resultSet[0]}});
              } 
        }else{
            throw ERRORS.ERR_INVSESS_SVR;     
        }
    }).catch(rejectResult => {
        reject(rejectResult);
    });

});

//export the module
module.exports = domainLogicHandlers;
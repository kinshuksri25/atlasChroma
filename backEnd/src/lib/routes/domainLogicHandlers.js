//Central Domain Logic Router

//Dependencies
const mongo = require('../data');
const {dbConstants,ERRORS,SINGLE,MULTIPLE} = require('../../../../lib/constants/dataConstants');
const sessionHandler = require('../sessionHandler');

//handler object definition
let domainLogicHandlers={};

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
            default:  
                domainLogicHandlers.getUser(requestObject).then(resolveResult => {
                    resolve(resolveResult);
                }).catch(rejectResult => {
                    throw rejectResult;
                });          
        }    
    }).catch( rejectResult => {
        reject(rejectResult);
    });
});

//user route
//method --> GET
//params --> requestObject -- object
domainLogicHandlers.getUser = (requestObject) => new Promise((resolve,reject) => {
    let projection = {
        projection: {UserName:1,Email: 1}
    };
    let query ={};

    if(requestObject.queryObject.hasOwnProperty("userID")){
        projection.projection = { _id: 0, Password:0,RefreshToken:0,State:0};
        query={_id : requestObject.queryObject.userID}
    }

    mongo.read(dbConstants.userCollection,{...query},{...projection.projection}).then(resultSet => {
        if(resultSet.length != 0){    
              if(resultSet[0].Projects.length != 0){
                let projectList = resultSet[0].Projects;
                 mongo.read(dbConstants.projectCollection,{ _id: { $in: projectList } },{}).then(resolveSet => {
                    if(resolveSet[0].length != 0){
                        resultSet[0].Projects = resolveSet[0];
                    }
                 }).catch(rejectSet =>{
                     throw rejectSet;
                 });     
              } 
            resolve({users:{...resultSet[0]}});
        }else{
            throw ERRORS.ERR_INVSESS_SVR;     
        }
    }).catch(rejectResult => {
        reject(rejectResult);
    });

});

//export the module
module.exports = domainLogicHandlers;
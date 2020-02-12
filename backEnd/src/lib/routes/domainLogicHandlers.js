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

    mongo.read(dbConstants.userCollection,{ _id : requestObject.queryObject.userID },{_id:0,password:0}).then(resultSet => {
        if(JSON.stringify(resultSet) != JSON.stringify([])){
            resolve({userObject:{...resultSet[0]}});
        }else{
            throw ERRORS.ERR_INVSESS_SVR;     
        }
    }).catch(rejectResult => {
        reject(rejectResult);
    });

});

//export the module
module.exports = domainLogicHandlers;
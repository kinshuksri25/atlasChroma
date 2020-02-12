/*
*   Primary Session Handler File
*/

//Dependencies
const {sessionObject} = require('../../../lib/constants/objectConstants');
const mongo = require('./data');
const {dbConstants,ERRORS} = require('../../../lib/constants/dataConstants');

//defining the sessionHandler object
const sessionHandler = {};

//create a new session 
//Params --> sessionID -- string
sessionHandler.createSession = sessionID => {
    //populate the session object store the value and return the object
    sessionObject.sessionID = sessionID;
    sessionObject.creationTime = Date.now();
    return sessionObject;
};

//check session validity
//Params --> requestObject -- object
sessionHandler.sessionChecker = requestObject => new Promise((resolve,reject) => {
    let sessionID = requestObject.method == "GET" || requestObject.method == "DELETE" ? requestObject.queryObject.userID : requestObject.reqBody.userID;
    if(sessionID != undefined){
        mongo.read(dbConstants.userCollection,{ _id : sessionID },{}).then(resolveResult => {
            if(JSON.stringify(resolveResult) == JSON.stringify([])){
                resolve(true);
            }else{
                throw ERRORS.ERR_INVSESS_SVR;     
            }
        }).catch(rejectResult => {
            reject(rejectResult);
        });
    }else{
        reject(ERRORS.ERR_INVSESS_SVR);
    }
});

//export the module
module.exports = sessionHandler;

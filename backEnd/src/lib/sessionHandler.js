/*
*   Primary Session Handler File
*/

//Dependencies
const {sessionObject} = require('../../../lib/constants/objectConstants');

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

//export the module
module.exports = sessionHandler;

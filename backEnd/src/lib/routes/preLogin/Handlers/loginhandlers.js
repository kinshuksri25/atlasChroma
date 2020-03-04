//Dependencies
const mongo = require("../../../utils/data");
const encryptionAPI = require("../../../utils/encryptionAPI");
const cookieHandler = require("../../../utils/cookieHandler");

//declaring the module
const loginHandler = {};

//params --> requestObject -- object
//returns --> promise(object)
loginHandler.login = (requestObject) => new Promise((resolve,reject) => {

    let response = {};
    //check the requestobject
    if(requestObject.reqBody.hasOwnProperty('Email') && requestObject.reqBody.hasOwnProperty('Password')){
                
        //check email validity
        mongo.read(dbConstants.userCollection,{ Email: requestObject.reqBody.Email }, { projection: { Email: 1, Password:1, _id:1, FirstName:1, UserName:1 } }).then(resultSet => {
            if (JSON.stringify(resultSet) != JSON.stringify([])) {  
                //check password validity
                if(resultSet[0].Password === encryptionAPI.hash(requestObject.reqBody.Password)){
                    //set userSession
                    if(resultSet[0].FirstName == ""){
                        response.PAYLOAD.unquieID = resultSet[0]._id;
                        //TODO --> add the below mentioned msg to MSG
                        response.SMSG = "LOGIN SUCCESSFUL, INCOMPLETE USER DATA AVAILABLE";
                        response.STATUS = 201;
                    }else{
                        response.PAYLOAD.cookie = cookieHandler.createCookies(requestObject.req.id,resultSet[0].UserName).then(resolvedResult => {
                            response.SMSG = "LOGIN SUCCESSFUL";
                            response.STATUS = 200;
                            response.PAYLOAD.cookieObject = resolvedResult;
                        }).catch(rejectedResult => {
                            response.STATUS = 500;
                            response.EMSG = "UNABLE TO LOG THE USER IN";
                            reject(response);
                        });
                    }
                    resolve(response);
                }else{
                    //TODO --> add the below mentioned msg to MSG
                    throw "INVALID PASSWORD!";
                }    
            }else{
                //TODO --> add the below mentioned msg to MSG
                throw "INVALID EMAIL!";
            } 
        }).catch(error => {
            response.EMSG = error;
            //TODO --> add the below mentioned msg to MSG
            if(error == "INVALID PASSWORD" || error == "INVALID EMAIL"){
                response.STATUS = 422; // --> syntax of the request is correct but the values are incorrect
            }else{
                response.STATUS = 500;
            }
            reject(response);
        });       
    }else{
        //TODO --> add the below mentioned msg to MSG
        response.EMSG = "INVALID REQUEST MADE";
        response.STATUS = 400; // --> request syntax is invalid
        reject(response);   
    }
});


//exporting the module
module.exports = loginHandler;

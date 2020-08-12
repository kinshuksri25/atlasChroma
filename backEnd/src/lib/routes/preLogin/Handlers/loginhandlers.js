/*
* Login Handler
*/

//Dependencies
const mongo = require("../../../utils/data");
const encryptionAPI = require("../../../utils/encryptionAPI");
const cookieHandler = require("../../../utils/cookieHandler");
const {DBCONST,EMSG,SMSG} = require("../../../../../../lib/constants/contants");

//declaring the module
const loginHandler = {};

//login route handler
//params --> requestObject -- object
//returns --> promise(object)
loginHandler.login = (requestObject,eventEmitter) => new Promise((resolve,reject) => {
    let response = {
                    EMSG : "",
                    PAYLOAD : {},
                    SMSG : ""
                   };                 
    //check the requestobject
    if(requestObject.reqBody.hasOwnProperty('Email') && requestObject.reqBody.hasOwnProperty('Password')){
        //check email validity
        mongo.read(DBCONST.userCollection,{ email: requestObject.reqBody.Email }, { projection: { email: 1, password:1, _id:1, firstname:1, username:1 } }).then(resultSet => {
            if (JSON.stringify(resultSet) != JSON.stringify([])) { 
                //check password validity
                if(resultSet[0].password === encryptionAPI.hash(requestObject.reqBody.Password)){
                    //set userSession
                    if(resultSet[0].firstname == ""){
                        response.PAYLOAD.uniqueID = resultSet[0]._id;
                        response.SMSG = SMSG.SVR_LGNH_INLGNSUC;
                        response.STATUS = 201;
                        resolve(response);
                    }else{
                        cookieHandler.createCookies(resultSet[0]._id,resultSet[0].username).then(resolvedResult => {
                            response.SMSG = SMSG.SVR_LGNH_LGNSUC;
                            response.STATUS = 200;
                            response.PAYLOAD = resolvedResult;
                            resolve(response);
                        }).catch(rejectedResult => {
                            response.STATUS = 500;
                            response.EMSG = rejectedResult;
                            reject(response);
                        });
                    }
                }else{
                    throw EMSG.SVR_LGNH_INPASS;
                }    
            }else{
                throw EMSG.SVR_LGNH_INEML;
            } 
        }).catch(error => {
            response.EMSG = error;
            if(error == EMSG.SVR_LGN_INPASS || error == EMSG.SVR_LGN_INEML){
                response.STATUS = 422; 
            }else{
                response.STATUS = 500;
            }
            reject(response);
        });       
    }else{
        response.EMSG = EMSG.SVR_HNDLS_INREQ;
        response.STATUS = 400; 
        reject(response);   
    }
});


//exporting the module
module.exports = loginHandler;

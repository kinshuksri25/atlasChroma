/*
* User Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,} = require("../../../../../../lib/constants/contants");

//declaring the module
const userHandler = {};

//router for all the user routes
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user = (route,requestObject) => new Promise((resolve,reject) => {
    let response = {};
    if(requestObject.hasOwnProperty("method")){
        switch(requestObject.method){
          case "GET" :
              userHandler.user.get(route,requestObject).then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "POST" : 
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


//user get route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.get = (route,requestObject) => new Promise((resolve,reject) => {
    let response = {};
    let projection = {
        projection: {UserName:1,Email: 1}
    };
    let query ={};

    if(requestObject.queryObject.userID != undefined){
        projection.projection = { _id: 0, Password:0,RefreshToken:0,State:0};
        query={_id : requestObject.queryObject.userID};
    }

    mongo.read(dbConstants.userCollection,{...query},{...projection}).then(resultSet => {
        if(resultSet.length != 0){    
              if( resultSet[0].Projects != undefined && resultSet[0].Projects.length != 0){
                let projectList = resultSet[0].Projects;
                mongo.read(dbConstants.projectCollection,{ _id: { $in: projectList } },{}).then(resolveSet => {
                    if(resolveSet.length != 0){
                        response.STATUS = 200;
                        response.PAYLOAD.users = {...resultSet[0]};
                        response.SMSG = SMSG.SVR_UHH_RDUSR;   
                        resolve(response);
                    }
                }).catch(rejectedSet =>{
                    throw rejectedSet;
                });     
              }else{
                response.STATUS = 200;
                response.PAYLOAD.users = {...resultSet[0]};
                response.SMSG = SMSG.SVR_UHH_RDUSR;  
                resolve(response);
              } 
        }else{
            response.STATUS = 400;
            response.EMSG = EMSG.SVR_HNDLS_INREQ;
            reject(response);     
        }
    }).catch(rejectedResult => {
        response.STATUS = 500;
        response.EMSG = rejectedResult;
        reject(response);
    });

});

//user post route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.post = (requestObject) = new Promise((resolve,reject) => {
    
});

//exporting the module
module.exports = userHandler;

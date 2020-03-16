/*
* User Handlers
*/

//Dependencies
const mongo = require("../../../utils/data");
const {EMSG,SMSG,DBCONST} = require("../../../../../../lib/constants/contants");

//declaring the module
const userHandler = {};

//router for all the user routes
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user = (route,requestObject) => new Promise((resolve,reject) => {     
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
    };
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
    let response = {
        EMSG : "",
        PAYLOAD : {},
        SMSG : ""
       };
    let projection = {
        projection: {username:1,email: 1}
    };
    let query ={};

    if(requestObject.queryObject.userID != undefined){
        projection.projection = { _id: 0, password:0,refreshToken:0,state:0};
        query={_id : requestObject.queryObject.userID};
    }

    mongo.read(DBCONST.userCollection,{...query},{...projection}).then(resultSet => {
        if(resultSet.length != 0){    
              if( resultSet[0].projects != undefined && resultSet[0].projects.length != 0){
                let projectList = resultSet[0].projects;
                mongo.read(DBCONST.projectCollection,{ _id: { $in: projectList } },{}).then(resolveSet => {
                    if(resolveSet.length != 0){
                        resultSet[0].projects = resolveSet;
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

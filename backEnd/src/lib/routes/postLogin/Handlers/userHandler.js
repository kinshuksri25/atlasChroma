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

    if(requestObject.queryObject.userID != undefined){
        mongo.aggregate(DBCONST.userCollection,[{$match : {_id : requestObject.queryObject.userID}},
                                                {$lookup : {
                                                    from: DBCONST.projectCollection,
                                                    localField: "projects",
                                                    foreignField: "_id",
                                                    as: "projects"
                                                 }},
                                                {$project: { _id: 0, password:0,refreshToken:0,state:0}}]).then(resolvedResult => {
                    
            if(resultSet.length != 0){
                response.STATUS = 200;
                response.PAYLOAD.user = {...resultSet[0]};
                response.SMSG = SMSG.SVR_UHH_RDUSR; 
                resolve(response); 
            }else{
                response.STATUS = 400;
                response.EMSG = "Invalid userID";  
                reject(response); 
            }                                   
                                                    
        }).catch(rejectedResult =>{
            response.STATUS = 500;
            response.EMSG = rejectedResult;
            reject(response);
        });
    }else{
        mongo.read(DBCONST.userCollection,{},{projection:{username:1,email: 1,firstname: 1,lastname: 1}}).then(resultSet => {
            if(resultSet.length != 0){   
                response.STATUS = 200;
                response.PAYLOAD.userList = {...resultSet[0]};
                response.SMSG = SMSG.SVR_UHH_RDUSR; 
                resolve(response); 
            }
        }).catch(rejectedResult => {
            response.STATUS = 500;
            response.EMSG = rejectedResult;
            reject(response);
        });    
    }
});

//user post route
//params --> route - string, requestObject - object
//returns --> promise - object
userHandler.user.post = (requestObject) = new Promise((resolve,reject) => {
    
});

//exporting the module
module.exports = userHandler;

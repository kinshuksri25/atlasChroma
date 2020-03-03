//Dependencies


//declaring the module
const projectHandler = {};


projectHandler.project = (requestObject) => new Promise((resolve,reject) => {
    let response = {};
    if(requestObject.hasOwnProperty("method")){
        switch(requestObject.method){
          case "GET" :
            projectHandler.project.get.then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "POST" : 
            projectHandler.project.post.then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "PUT" : 
              break;
          case "DELETE" : 
              break;
        }
    }else{
      response.STATUS = 500;
      response.EMSG = "METHOD NOT FOUND!";
      reject(response);
    }
});

domainLogicHandlers.project.post = (requestObject) => new Promise((resolve,reject) => {
    
    let response = {};
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
            
            let insertedID = resolveResult.insertedId;
            mongo.update(dbConstants.userCollection,{ UserName: { $in: projectObject.contributors } },{ $push: {Projects : insertedID}}, {}, SINGLE).then(updateSet => {
                response.STATUS = 200;
                response.PAYLOAD.projects = resolveResult.ops[0];
                response.SMSG = "USER DATA UPDATED";        
                resolve(response);     
            }).catch(rejectSet => {
                throw rejectSet;
            });
                
        }).catch(rejectedResult => {
            response.STATUS = 500;
            response.EMSG = rejectedResult;
            reject(response);
        });    
    }else{
        response.STATUS = 400;
        response.EMSG = "INVALID REQUEST";
        reject(response);
    } 
});


//exporting the module
module.exports = projectHandler.js

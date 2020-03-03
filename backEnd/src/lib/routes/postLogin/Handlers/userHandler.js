//Dependencies


//declaring the module
const userHandler = {};


userHandler.user = (requestObject) => new Promise((resolve,reject) => {
    let response = {};
    if(requestObject.hasOwnProperty("method")){
        swtich(requestObject.method){
          case "GET" :
              userHandler.user.get.then(resolvedResult => {
                   resolve(resolvedResult);
              }).catch(rejectedResult => {
                   reject(rejectedResult);
              });
              break;
          case "POST" : 
              userHandler.user.post.then(resolvedResult => {
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



//exporting the module
module.exports = userHandler.js

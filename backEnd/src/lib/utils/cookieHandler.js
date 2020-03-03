//Dependencies
const cookies = require("");
const redis = require("redis");
const client = redis.createClient();

//declaring the module
const cookieHandler = {};

cookieHandler.createCookies = (requestObjectID,UserName)  = new Promise ((resolve,reject) =>{
    let newCookie = new cookies(requestObjectID);
    client.set(requestObjectID,UserName, "value", (err,res) => {
        if(err){
            console.log("UNABLE TO CACHE DATA");
            reject("UNABLE TO CACHE DATA");
        }else{
            resolve(newCookie.getUser());
        }
    }); 
});


cookieHandler.checkCookie = (cookieObject) = new Promise ((resolve,reject) => {
    //check cookies
    resolve(true);
});

//export the module
module.exports = cookieHandler;

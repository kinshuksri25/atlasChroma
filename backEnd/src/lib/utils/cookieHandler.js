/*
* Primary file for creating cookies and checking cookie validity
*/
//TODO --> add redis caching functionality

//Dependencies
const cookies = require("../classObjects/cookieClass");
const redis = require("redis");
const {EMSG} = require("../../../../lib/constants/contants");

const client = redis.createClient();

//declaring the module
const cookieHandler = {};

//function for creating cookie objects
//params --> requestObjectID - string, UserName - string
//returns --> promise - cookie
cookieHandler.createCookies = (requestObjectID,UserName)  = new Promise ((resolve,reject) =>{
    let newCookie = new cookies(requestObjectID);
    client.set(requestObjectID,UserName, (err,res) => {
        if(err){
            console.log(err);
            reject(EMSG.SVR_UTL_RDSCHERR);
        }else{
            resolve(newCookie.getCookie());
        }
    }); 
});

//function for checking cookie validity
//params --> cookieObject
//returns --> promise - boolean
cookieHandler.checkCookie = (cookieObject) = new Promise ((resolve,reject) => {
    //check cookies
    let cookieValidity = false;
    client.get(cookieObject.cookieID, (err,res) => {
        if(err){
            console.log(err);
            reject(EMSG.SVR_UTL_RDSRDERR);
        }else{
           cookieValidity = res != undefined || res != "" ? true : false;
           resolve(cookieValidity);
        }
    });  
});

//export the module
module.exports = cookieHandler;

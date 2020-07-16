/*
* Primary file for creating cookies and checking cookie validity
*/

//Dependencies
const redisClass = require("./redis");
const {EMSG} = require("../../../../lib/constants/contants");

//declaring the module
const cookieHandler = {};

//function for creating cookie details
//params --> requestObjectID - string, UserName - string
//returns --> promise
cookieHandler.createCookies = (requestObjectID,username)  => new Promise ((resolve,reject) =>{
    
    let options = {
        type : 'EX',
        expiryTime : 60*30
    };
    redisClass.addData(requestObjectID,username,{...options}).then(resolvedResult => {
        resolve(requestObjectID);
    }).catch(rejectedResult => {
        reject(EMSG.SVR_UTL_RDSCHERR);
    });
});

//function for getting cookie details
//params --> cookieObject
//returns --> promise
cookieHandler.getCookie = (cookieID) => new Promise ((resolve,reject) => {
    redisClass.readData(cookieID).then(resolvedResult => {
        let cookieValidity = resolvedResult != null ? resolvedResult : false;
        resolve(cookieValidity);
    }).catch(rejectedResult => {
        console.log(rejectedResult);
        reject(false);
    });  
});

//function for getting all cookies
//params --> none
//returns --> promise
cookieHandler.getAllCookies = () => new Promise((resolve,reject) => {
    
    redisClass.getAllData().then(resolvedResult => {
        resolve(resolvedResult);
    }).catch(rejectedResult => {
        reject(rejectedResult);
    });
});

//function for clearing all cookies
//params --> none
//returns --> promise
cookieHandler.clearCookies = () => new Promise ((resolve,reject) => {
    
    redisClass.dropCache().then(resolvedResult => {
        resolve(resolvedResult);
    }).catch(rejectedResult => {
        reject(rejectedResult);
    });
});


//function for deleting a cookie
//params --> cookieID - string
//returns --> promise
cookieHandler.deleteCookie = (cookieID) => new Promise((resolve,reject) => {
    
    redisClass.deleteData(cookieID).then(resolvedResult => {
        cookieHandler.getAllCookies().then(resolvedResult => {
            resolve(resolvedResult);
        }).catch(rejectedResult => {
            reject (rejectedResult);
        });
    }).catch(rejectedResult => {
        reject(rejectedResult);
    });

});

//export the module
module.exports = cookieHandler;

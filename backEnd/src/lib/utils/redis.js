// Redis interface

//Dependencies
const redis = require("redis");
const {EMSG} = require("../../../../lib/constants/contants");

//declaring the module
let redisClass = {};


//adding data to the redis cache
//params --> key - stirng, value - string, options - object
//output --> promise
redisClass.addData = (key,value) => new Promise((resolve,reject) => {
    let redisInstance = redis.createClient();
    if(key != "" || value != ""){
        redisInstance.set(key,value,(err,response) => {
            if(err){
                redisInstance.quit();
                console.log(err);
                reject(EMSG.SVR_UTL_RDSCRERR);
            }else{
                redisInstance.quit();
                resolve(true);
            }
        });
    }else{
        redisInstance.quit();
        reject(EMSG.SVR_UTL_RDSINCERR);
    }
});

//deleting data from the redis cache
//params --> key - stirng
//output --> promise
redisClass.deleteData = (key) => new Promise((resolve,reject) => {
    let redisInstance = redis.createClient();
    if(key != ""){
        redisInstance.del(key, (err,response) => {
            if(err){
                redisInstance.quit();
                console.log(err);
                reject(EMSG.SVR_UTL_RDSDELERR);
            }else{
                redisInstance.quit();
                resolve(true);
            }
        });
    }else{
        redisInstance.quit();
        reject(EMSG.SVR_UTL_RDSUNKEYERR);
    }
});

//reading data from the redis cache
//params --> key - stirng
//output --> promise
redisClass.readData = (key) => new Promise((resolve,reject) => {
    let redisInstance = redis.createClient();
    if(key != ""){
        redisInstance.get(key, (err,response) => {
            if(err){
                redisInstance.quit();
                console.log(err);
                reject(EMSG.SVR_UTL_RDSRDERR);
            }else{
                console.log(response);
                redisInstance.quit();
                resolve(response);
            }
        });  
    }else{
        redisInstance.quit();
        reject(EMSG.SVR_UTL_RDSRDERR);
    }
});

//droping the redis cache
//params --> N/A
//output --> promise
redisClass.dropCache = () => new Promise((resolve,reject) => {
    let redisInstance = redis.createClient();
    redisInstance.flushdb( (err, response) => {
        if(!err){
            redisInstance.quit();
            resolve(true);
        }else{
            redisInstance.quit();
            console.log(err);
            reject(EMSG.SVR_UTL_RDSCLRCHERR);
        }
    });
});

//getting the entire redis cache
//params --> N/A
//output --> promise
redisClass.getAllData = () => new Promise((resolve,reject) => {
    let redisObject = {};
    let keyArray = [];
    let redisInstance = redis.createClient();

    redisInstance.keys("*",(err,response) => {
        if(!err){
            keyArray = [...response];
            for(let i = 0; i< keyArray.length; i++){
                redisInstance.get(keyArray[i], (err,response) => {
                    redisObject[keyArray[i]] = response;
                    if(i == keyArray.length-1){
                        redisInstance.quit();
                        resolve(redisObject);
                    }
                });
            }
        }else{
            redisInstance.quit();
            console.log(err);
            reject(EMSG.SVR_UTL_RDSUSRERR);
        }
    });
});

module.exports = redisClass;
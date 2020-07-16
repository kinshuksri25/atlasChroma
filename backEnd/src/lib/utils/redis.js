// Redis interface

//Dependencies
const redis = require("redis");

//declaring the module
let redisClass = {};


//adding data to the redis cache
//params --> key - stirng, value - string, options - object
//output --> promise
redisClass.addData = (key,value,options) => new Promise((resolve,reject) => {
    let redisInstance = redis.createClient();
    if(key != "" || value != "" || JSON.stringify(options) != JSON.stringify({})){
        redisInstance.set(key,value,options.type,options.expiryTime,(err,response) => {
            if(err){
                redisInstance.quit();
                console.log(err);
                reject(err);
            }else{
                redisInstance.quit();
                resolve(true);
            }
        });
    }else{
        redisInstance.quit();
        reject("incomplete data provided");
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
                reject(false);
            }else{
                redisInstance.quit();
                resolve(true);
            }
        });
    }else{
        redisInstance.quit();
        reject("key not provided");
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
                reject(false);
            }else{
                console.log(response);
                redisInstance.quit();
                resolve(response);
            }
        });  
    }else{
        redisInstance.quit();
        reject("key not provided");
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
            return (true);
        }else{
            redisInstance.quit();
            console.log(err);
            return (false);
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
                        resolve (redisObject);
                    }
                });
            }
        }else{
            redisInstance.quit();
            console.log(err);
            reject(false);
        }
    });
});

module.exports = redisClass;
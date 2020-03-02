/*
* Data layer for the backend 
*/

//Dependencies
let mongoDB = require('mongodb').MongoClient;
let { dbConstants, ERRORS, SINGLE, MULTIPLE } = require('../../../lib/constants/dataConstants');

//mongo object definition
let mongo = {};

//mongo atlas url
mongo.url = "mongodb+srv://admin:" + dbConstants.password + "@atlas-cloud-yrwic.mongodb.net/test?retryWrites=true&w=majority";

//open the connection to the atlas
mongo.openConnection = url => new Promise((resolve,reject) => {
    mongoDB.connect(url)
        .then(db => {
            resolve(db);
        }).catch(err => {
            console.log(err);
            reject(ERRORS.ERR_CONN_DB);
        });
});

//reading data
//Params --> collection - string, query - object, options - object
mongo.read = (collection, query, options) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let resultArr = [];
        let dbinstance = db.db(dbConstants.DB_NAME);
        let col = dbinstance.collection(collection);
        let cursor = col.find(query, options);
        cursor.each(function(err, doc) {
            if(err)
            {
                db.close();
                reject(ERRORS.ERR_RD_DB);    
            }else{
                if(doc != null)
                {
                    resultArr.push(doc);
                }else{

                    db.close();
                    resolve(resultArr);
                }
            }
        });
    }).catch(err => {
        console.log(err);
        reject(ERRORS.ERR_RD_DB);
    });
});

//writing data
//Params-->collection - string, payload -array of object, options - object
mongo.insert = (collection, payload, options) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(dbConstants.DB_NAME);
        let col = dbinstance.collection(collection);
        payload.length == undefined && col.insertOne(payload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERRORS.ERR_WR_DB);
        });

        payload.length > 1 && col.insertMany(payload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERRORS.ERR_WR_DB);
        });
    }).catch(err => {
        console.log(err);
        reject(ERRORS.ERR_WR_DB);
    });
});

//deleting data
//Params --> collection - string, query - object, options - object,selectionType - integer
mongo.delete = (collection, query, options, selectionType) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(dbConstants.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.deleteOne(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERRORS.ERR_DL_DB);
        });

        selectionType == MULTIPLE && col.deleteMany(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERRORS.ERR_DL_DB);
        });
    }).catch(err => {
        console.log(err);
        reject(ERRORS.ERR_DL_DB);
    });
});

//updating data
//Params --> collection - string, query - object,updatedPayload - object ,options - object,selectionType - integer
mongo.update = (collection, query, updatedPayload, options, selectionType) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(dbConstants.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.updateOne(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERRORS.ERR_UP_DB);
        });

        selectionType == MULTIPLE && col.updateMany(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERRORS.ERR_UP_DB);
        });
    }).catch(err => {
        console.log(err);
        reject(ERRORS.ERR_UP_DB);
    });
});

//export the module
module.exports = mongo;

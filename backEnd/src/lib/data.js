/*
 * Data layer for the backend 
 */

//Dependencies
let mongoDB = require('mongo').MongoClient;
let { dbConstants, ERRORS, SINGLE, MULTIPLE } = require('../../../lib/constants/dataConstants');

//mongo object definition
let mongo = {};

//mongo atlas url
mongo.url = "mongodb+srv://admin:" + dbConstants.password + "@atlas-cloud-yrwic.mongodb.net/test?retryWrites=true&w=majority";

//open the connection to the atlas
mongo.openConnection = new Promise(url => {
    MongoClient.connect(url)
        .then(db => {
            resolve(db);
        }).catch(err => {
            reject(ERR_CONN_DB + err);
        });
});

//reading data
//Params --> collection - string, query - object, options - object
mongo.read = new Promise((collection, query, options) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(dataConstants.DB_NAME);
        let col = dbinstance.collection(collection);
        col.find(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERR_RD_DB + err);
        });
    }).catch(err => {
        reject(err);
    });
});

//writing data
//Params-->collection - string, payload -array of object, options - object
mongo.insert = new Promise((collection, payload, options) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(dataConstants.DB_NAME);
        let col = dbinstance.collection(collection);
        payload.length == 1 && col.insertOne(payload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERR_WR_DB + err);
        });

        payload.length > 1 && col.insertMany(payload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERR_WR_DB + err);
        });
    }).catch(err => {
        reject(err);
    });
});

//deleting data
//Params --> collection - string, query - object, options - object,selectionType - integer
mongo.delete = new Promise((collection, query, options, selectionType) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(dataConstants.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.deleteOne(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERR_DL_DB + err);
        });

        selectionType == MULTIPLE && col.deleteMany(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERR_DL_DB + err);
        });
    }).catch(err => {
        reject(err);
    });
});

//updating data
//Params --> collection - string, query - object,updatedPayload - object ,options - object,selectionType - integer
mongo.update = new Promise((collection, query, updatedPayload, options, selectionType) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(dataConstants.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.updateOne(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERR_UP_DB + err);
        });

        selectionType == MULTIPLE && col.updateMany(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            reject(ERR_UP_DB + err);
        });
    }).catch(err => {
        reject(err);
    });
});

//export the module
module.exports = mongo;
/*
* Data layer for the backend 
*/

//Dependencies
let mongoDB = require('mongodb').MongoClient;
let { DBCONST, EMSG, SINGLE, MULTIPLE } = require("../../../../lib/constants/contants");

//mongo object definition
let mongo = {};

//DBaaS url
mongo.url = "mongodb+srv://admin:" + DBCONST.password + "@atlas-cloud-yrwic.mongodb.net/test?retryWrites=true&w=majority";

//open the connection to the atlas
mongo.openConnection = url => new Promise((resolve,reject) => {
    mongoDB.connect(url)
        .then(db => {
            resolve(db);
        }).catch(err => {
            console.log(err);
            reject(EMSG.SVR_DAO_CONNERR);
        });
});

//reading data
//params --> collection - string, query - object, options - object
//returns --> promise
mongo.read = (collection, query, options) =>  new Promise((resolve,reject) => {
    mongo.openConnection(mongo.url).then(db => {

        let resultArr = [];
        let dbinstance = db.db(DBCONST.DB_NAME);
        let col = dbinstance.collection(collection);
        let cursor = col.find(query, options);
        cursor.each(function(err, doc) {
            if(err)
            {
                db.close();
                console.log(err);
                throw err;   
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
        reject(EMSG.ERR_RD_DB);
    });
});

//writing data
//params-->collection - string, payload -array of object, options - object
//returns --> promise
mongo.insert = (collection, payload, options) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(DBCONST.DB_NAME);
        let col = dbinstance.collection(collection);
        payload.length == undefined && col.insertOne(payload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw err;
        });

        payload.length > 1 && col.insertMany(payload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw err;
        });
    }).catch(err => {
        reject(EMSG.SVR_DAO_WRERR);
    });
});

//deleting data
//params --> collection - string, query - object, options - object,selectionType - integer
//returns --> promise
mongo.delete = (collection, query, options, selectionType) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(DBCONST.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.deleteOne(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw err;
        });

        selectionType == MULTIPLE && col.deleteMany(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw err;
        });
    }).catch(err => {
        reject(EMSG.SVR_DAO_DLERR);
    });
});

//updating data
//params --> collection - string, query - object,updatedPayload - object ,options - object,selectionType - integer
//returns --> promise
mongo.update = (collection, query, updatedPayload, options, selectionType) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(DBCONST.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.updateOne(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw err;
        });

        selectionType == MULTIPLE && col.updateMany(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw err;
        });
    }).catch(err => {
        reject(EMSG.SVR_DAO_UPERR);
    });
});

//export the module
module.exports = mongo;

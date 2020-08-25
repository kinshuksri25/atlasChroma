/*
* Data layer for the backend 
*/

//Dependencies
let mongoDB = require('mongodb').MongoClient;
let { DBCONST, EMSG, SINGLE, MULTIPLE, dbConnUrl} = require("../../../../lib/constants/contants");

//mongo object definition
let mongo = {};

//DBaaS url
mongo.url = dbConnUrl;

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
                throw EMSG.ERR_RD_DB;   
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
        reject(err);
    });
});

//aggregating and reading data
//params --> collection - string, pipeline - array, options - object
//returns --> promise
mongo.aggregate = (collection,pipeline,options) => new Promise((resolve, reject) => {
    mongo.openConnection(mongo.url).then(db => {

        let resultArr = [];
        let dbinstance = db.db(DBCONST.DB_NAME);
        let col = dbinstance.collection(collection);
        let cursor = col.aggregate(pipeline,options);
        cursor.each(function(err, doc) {
            if(err)
            {
                db.close();
                console.log(err);
                throw EMSG.ERR_RD_DB;   
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
        reject(err);
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
            throw EMSG.SVR_DAO_WRERR;
        });

        payload.length > 1 && col.insertMany(payload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw EMSG.SVR_DAO_WRERR;
        });
    }).catch(err => {
        reject(err);
    });
});

//deleting data
//params --> collection - string, query - object, options - object,selectionType - integer
//returns --> promise
mongo.delete = (collection, query,updatedPayload, options, selectionType) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(DBCONST.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.findOneAndUpdate(query,updatedPayload,options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw EMSG.SVR_DAO_DLERR;
        });

        selectionType == MULTIPLE && col.deleteMany(query, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw EMSG.SVR_DAO_DLERR;
        });
    }).catch(err => {
        reject(err);
    });
});

//updating data
//params --> collection - string, query - object,updatedPayload - object ,options - object,selectionType - integer
//returns --> promise
mongo.update = (collection, query, updatedPayload, options, selectionType) =>  new Promise((resolve,reject) => {

    mongo.openConnection(mongo.url).then(db => {

        let dbinstance = db.db(DBCONST.DB_NAME);
        let col = dbinstance.collection(collection);

        selectionType == SINGLE && col.findOneAndUpdate(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw EMSG.SVR_DAO_UPERR;
        });

        selectionType == MULTIPLE && col.updateMany(query, updatedPayload, options).then(result => {
            db.close();
            resolve(result);
        }).catch(err => {
            db.close();
            console.log(err);
            throw EMSG.SVR_DAO_UPERR;
        });
    }).catch(err => {
        reject(err);
    });
});

//export the module
module.exports = mongo;

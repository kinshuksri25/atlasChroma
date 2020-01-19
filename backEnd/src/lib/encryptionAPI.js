/*
*   Primary encryption library
*/

//Dependencies
let crypto = require('crypto');

//defining the encryptionAPI object
let encryptionAPI = {};

//password hashing function
//Params --> unhashedData -- string
encryptionAPI.hash = unhashedData =>{
    let salt = "usjv13bs4345yb43g2w9sfkl32h8f342nbkahd32bifu8h378r32yb34fb3478fg7wbefs";
    let hash = crypto.createHmac('sha512', salt);
    hash.update(unhashedData);
    let hashedPassword = hash.digest('hex');
    return hashedPassword;
};

//export the module
module.exports = encryptionAPI;
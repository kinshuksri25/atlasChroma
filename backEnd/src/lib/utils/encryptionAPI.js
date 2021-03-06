/*
*   Primary encryption library
*/

//Dependencies
const crypto = require('crypto');

//defining the encryptionAPI object
const encryptionAPI = {};

//password hashing function
//params --> unhashedData - string
//returns --> hashedData -string 
encryptionAPI.hash = unhashedData =>{
    let salt = "usjv13bs4345yb43g2w9sfkl32h8f342nbkahd32bifu8h378r32yb34fb3478fg7wbefs";
    let hash = crypto.createHmac('sha512', salt);
    hash.update(unhashedData);
    let hashedPassword = hash.digest('hex');
    return hashedPassword;
};

//export the module
module.exports = encryptionAPI;

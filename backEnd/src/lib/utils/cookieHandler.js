//Dependencies
const cookies = require("");

//declaring the module
const cookieHandler = {};

cookieHandler.createCookies = (requestObjectID)  => {
    let newCookie = new cookies(requestObjectID);
    return newCookie.getCookie();
};


//export the module
module.exports = cookieHandler;

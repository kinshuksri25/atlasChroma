//Dependencies
const cookieObject = require("");

//declaring the module
const cookieHandler = {};

cookieHandler.createCookies = (requestObjectID)  => {
    let newCookie = new cookieObject(requestObjectID);
    return newCookie.getCookie();
};


//export the module
module.exports = cookieHandler;

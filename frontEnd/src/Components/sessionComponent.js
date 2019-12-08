var localSession = (function() {

    var getSessionObject = function() {
        var returnObject = {};
        returnObject.sessionID = localStorage.sessionID;
        returnObject.creationTime = localStorage.creationTime;
        return returnObject;
    };

    var setSessionObject = function(sessionObject) {
        localStorage.sessionID = sessionObject.sessionID;
        localStorage.creationTime = sessionObject.creationTime;
    };

    return {
        getSessionObject: getSessionObject,
        setSessionObject: setSessionObject
    }

})();


//export the module
export default localSession;
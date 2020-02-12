let localSession = (function() {

    let getSessionObject = function() {
        var returnObject = {};
        returnObject.sessionID = localStorage.sessionID;
        returnObject.creationTime = localStorage.creationTime;
        return returnObject;
    };

    let setSessionObject = function(sessionObject) {
        localStorage.sessionID = sessionObject.sessionID;
        localStorage.creationTime = sessionObject.creationTime;
    };

    let clearSession = function(){
        localStorage.clear();
    }

    return {
        getSessionObject: getSessionObject,
        setSessionObject: setSessionObject,
        clearSession: clearSession
    }

})();


//export the module
export default localSession;
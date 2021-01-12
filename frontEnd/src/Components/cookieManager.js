import Cookies from "universal-cookie";

let cookieManager = (function() {

    let getSocketDetails = function(){
        let cookie =  new Cookies();
        let socketID = cookie.get("io") ? cookie.get("io") : false;
        return socketID;
    }

    let getUserSessionDetails = function() {
        let cookie =  new Cookies();
        let userID = cookie.get("userID") ? cookie.get("userID") : false;
        return userID;
    };

    let setUserSessionDetails = function(userID) {
        let cookie =  new Cookies();
        cookie.set('userID', userID, {path: '/'});   
    };

    let clearUserSession = function(){
        let cookie =  new Cookies();
        cookie.remove("userID");
    }

    return {
        getUserSessionDetails: getUserSessionDetails,
        setUserSessionDetails: setUserSessionDetails,
        clearUserSession: clearUserSession,
        getSocketDetails: getSocketDetails
    }

})();


//export the module
export default cookieManager;
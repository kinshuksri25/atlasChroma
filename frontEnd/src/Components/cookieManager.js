import Cookies from "universal-cookie";

let cookieManager = (function() {

    let getUserSessionDetails = function() {
        let cookie =  new Cookies();
        let userID = cookie.get("userID") ? cookie.get("userID") : false;
        return userID;
    };

    let setUserSessionDetails = function(userID) {
        let cookie =  new Cookies();
        cookie.set('userID', userID, { path: '/', maxAge: 1800000 });   
    };

    let clearUserSession = function(){
        let cookie =  new Cookies();
        cookie.remove("userID");
    }

    return {
        getUserSessionDetails: getUserSessionDetails,
        setUserSessionDetails: setUserSessionDetails,
        clearUserSession: clearUserSession
    }

})();


//export the module
export default cookieManager;
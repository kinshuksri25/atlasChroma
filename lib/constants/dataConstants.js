var dataConstants = {};

dataConstants.constants = {
    "backEndPort": "5000",
    "secureProtocol": "https:",
    "protocol": "http:",
    "hostname": "localhost"
};

dataConstants.dbConstants = {
    "password": "8658Vokun8658",
    "userCollection": "testCollection",
    "projectCollection": "projectCollection",
    "authCollection": "authCredentials"
};

//Format --> "SUCCESS/ERROR_CAUSE_LOCATION"
dataConstants.ERRORS = {
    //EXTERNAL ERROR
    //DB ERRORS
    "ERR_CONN_DB": "Unable to connect to DB due to the following error -->",
    "ERR_WR_DB": "Unable to write data to DB due to the following error --> ",
    "ERR_RD_DB": "Unable to fetch data from DB due to the following error -->",
    "ERR_UP_DB": "Unable to update data to DB due to the following error -->",
    "ERR_DL_DB": "Unable to delete data from DB due to the following error -->",

    //CLIENT-SIDE ERRORS
    "ERR_INVMET_CLIMID": "Invalid request method used",
    "ERR_CONN_SERVER": "Unable to connect to the server please try after sometime",
    "ERR_INVREQ_CLI" : "Invalid request object recieved",
    "ERR_DISINVREQ_CLI": "Unable to sign the user in please refresh and try again",
    "ERR_INVUSREML_CLI": "EmailID or Username is already registered with us",
    "WAR_CHCKUSEREML_CLI": "We are checking Email and Password validity try again in a few moments",

    //GOOGLE API ERRORS
  

    //INTERNAL ERRORS
    
};

dataConstants.actionTypes = {
     CHANGEURL : "CHANGEURL"   
}


dataConstants.urls = {
    LANDING : "/landing",
    SIGNUP : "/signup",
    LOGIN : "/login",
    DASHBOARD: "/dashboard",
    POSTSIGNUPFORM:"/postSignUpForm"
}

dataConstants.SINGLE = 1;
dataConstants.MULTIPLE = 2;

dataConstants.senderEmail = "atlaschroma@gmail.com";

dataConstants.authURL = "https://accounts.google.com/o/oauth2/v2/auth";

dataConstants.scopes = {
    CALENDAR : "https://www.googleapis.com/auth/calendar",
    CONTACTS : "https://www.googleapis.com/auth/contacts.readonly"
};

dataConstants.emailCredentials = {
    refreshToken : "1//04ve_K_H2d9CaCgYIARAAGAQSNwF-L9IrkoikO4XtmuCRfsJUzi14HUR-OEMLPgM-yOtPWzh_XyT9GBcX8oTRC7quQIa382B9V2I"
}

dataConstants.refreshTokenURL = "https://oauth2.googleapis.com/token";

dataConstants.loginAuth = {
   redirectURL : "https://localhost:3000/postAuth",
   clientID : "1080818671374-c2g6q20tvj4eqsobn2e9fl75ggdncvu4.apps.googleusercontent.com",
   clientSecret:"p8orbG1dvXtprjeYopQ-cF22" 
} 

//export the module
module.exports = {...dataConstants };
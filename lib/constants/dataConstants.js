var dataConstants = {};

dataConstants.constants = {
    "backEndPort": "5000",
    "secureProtocol": "https:",
    "protocol": "http:",
    "hostname": "localhost"
};

dataConstants.dbConstants = {
    "DB_NAME": "atlasChroma",
    "password": "8658Vokun8658",
    "userCollection": "testCollection",
    "projectCollection": "projectCollection"
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
    "ERR_GGLCONN_CLI": "Unable to connect to google please try again or use alt login",
    "ERR_CONN_SERVER": "Unable to connect to the server please try after sometime",
    "ERR_INVREQ_CLI" : "Invalid request object recieved",
    "ERR_DISINVREQ_CLI": "Unable to sign the user in please refresh and try again",
    "ERR_INVUSREML_CLI": "EmailID or Username is already registered with us",
    "WAR_CHCKUSEREML_CLI": "We are checking Email and Password validity try again in a few moments",
    "ERR_MNU_CLI":"unable to render menu, menuArray is undefined",

    //INTERNAL ERRORS  
        //GOOGLE API ERRORS
    "ERR_SNDEML_SVR": "Unable to send email",
    "ERR_INVAUTCDE_SVR": "Invalid authentication_code/state provided",
    "ERR_GGLCONN_SVR": "Unable to connect to google servers please user alt login",    
        //SERVER ERRORS
    "ERR_INVREQOBJ_SVR": "Please check the input",
    "ERR_GGLPRFDE_SVR": "Unable to get profile details please try logging in again",
    "ERR_DBCONN_SVR": "We are unable to connect to our databases please try again in sometime",
    "ERR_INVPASS_SVR": "Invalid password provided",
    "ERR_INVEML_SVR": "Invalid EmailID provided",
    "ERR_INVID_SVR" : "Invalid id recieved",
    "ERR_EXEML_SVR": "An account is already registered with this Email",   
    "ERR_EXUSR_SVR": "An account is already registered with this Username",
    "ERR_INVRUT_SVR": "Maybe you are lost",
    "ERR_PERMDEND_SVR": "Login Permission denied by the user",
    "ERR_SEC_SVR": "Oops looks like someone is trying to steal your data",
    "ERR_INVSESS_SVR":"Session unavailable"   
};  

dataConstants.actionTypes = {
     CHANGEURL : "CHANGEURL",
     SETUSER : "SETUSER",
     SETUSERLIST: "SETUSERLIST"   
}


dataConstants.urls = {
    LANDING : "/landing",
    SIGNUP : "/signup",
    LOGIN : "/login",
    DASHBOARD: "/dashboard",
    POSTSIGNUPFORM:"/postsignupform",
    POSTAUTHFORM: "/postauthform",
    POSTAUTH: "/postauth",
    USER:"/user",
    USERPROJECT:"/user/projects"
}

dataConstants.SINGLE = 1;
dataConstants.MULTIPLE = 2;

dataConstants.senderEmail = "atlaschroma@gmail.com";

dataConstants.authURL = "https://accounts.google.com/o/oauth2/v2/auth";

dataConstants.scopes = {
    SIGNIN :  "https://www.googleapis.com/auth/userinfo.profile",
    CALENDAR : "https://www.googleapis.com/auth/calendar",
    CONTACTS : "https://www.googleapis.com/auth/contacts.readonly",
    PROFILE: "https://www.googleapis.com/userinfo/v2/me"
};

dataConstants.emailCredentials = {
    refreshToken : "1//04ObVXdv-HIECCgYIARAAGAQSNwF-L9Ir9JUqY747db531D1lRHAtdYLAUZ5aGHBLN6-AJV19Ny0BtcGPv8go5Pxn1qcrkygE9sQ"
}

dataConstants.refreshTokenURL = "https://oauth2.googleapis.com/token";

dataConstants.loginAuth = {
   redirectURL : "https://localhost:3000/postAuth",
   clientID : "1080818671374-c2g6q20tvj4eqsobn2e9fl75ggdncvu4.apps.googleusercontent.com",
   clientSecret:"p8orbG1dvXtprjeYopQ-cF22" 
} 

//export the module
module.exports = {...dataConstants };
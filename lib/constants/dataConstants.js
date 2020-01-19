var dataConstants = {};

dataConstants.constants = {
    "backEndPort": "5000",
    "secureProtocol": "https:",
    "protocol": "http:",
    "hostname": "localhost",
    "selfAuth": "selfAuthCredentials"
};

dataConstants.dbConstants = {
    "password": "8658Vokun8658",
    "DB_NAME": "atlasChroma",
    "userCollection": "testCollection",
    "projectCollection": "projectCollection",
    "authCollection": "authCredentials"
};


dataConstants.ERRORS = {
    //EXTERNAL ERROR
    //DB ERRORS
    "ERR_CONN_DB": "Unable to connect to DB due to the following error -->",
    "ERR_WR_DB": "Unable to write data to DB due to the following error --> ",
    "ERR_RD_DB": "Unable to fetch data from DB due to the following error -->",
    "ERR_UP_DB": "Unable to update data to DB due to the following error -->",
    "ERR_DL_DB": "Unable to delete data from DB due to the following error -->",

    //REQUEST OBJECT ERRORS
    "ERR_EMLOBJ_SGN": "Invalid email object provided",
    "ERR_REQ_REQOBJ": "Unable to process the request, Data supplied is in invalid format",
    "ERR_IEML_LGNOBJ": "Please check the supplied Email",
    "ERR_PASS_LGNOBJ": "Please check the supplied Pasword",
    "ERR_EXSESS_LGN": "User is already logged, invalid request",
    "ERR_IUSN_SGN": "The supplied username already exists",

     //CLIENT-SIDE ERRORS
     "ERR_BCKERR_CLI": "Unable to get data",
     "ERR_NET_CLI": "Unable to connect to the network",
     "ERR_INVOBJ_CLI" : "Invalid form object",
     "ERR_INPASS_CLI" : "The password should contain an uppercase, a lowecase, a digit and should be atleast 8 characters long",
     "ERR_PASSMIS_CLI": "Password and Confirm-Password should match",

    //GOOGLE API ERRORS
    "ERR_EML_SGN": "Couldnot reach the provided email, the server came back with the following message -->",

    //INTERNAL ERRORS
    "ERR_SESS_LGN": "Unable to create valid session for the user, the server came back with the following message -->"
};

dataConstants.actionTypes = {
     CHANGEURL : "CHANGEURL"   
}


dataConstants.urls = {
    LANDING : "/landing",
    SIGNUP : "/signup",
    LOGIN : "/login"
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
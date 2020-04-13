//declaring the module
const constants = {};

//DBaaS related Constants object
constants.DBCONST = {
    "DB_NAME": "atlasChroma",
    "password": "8658Vokun8658",
    "userCollection": "testCollection",
    "projectCollection": "projectCollection"
}

constants.connectionConstants = {
    "backEndPort": "5000",
    "secureProtocol": "https:",
    "protocol": "http:",
    "hostname": "localhost"
};


//message structure --> server/client_location(DAO/controller)_errormsg
constants.EMSG = {
    //server side error message
        //NOERROR
        "NOERROR" : "",       
        //DAO
        "SVR_DAO_CONNERR" : "Unable to connect to the Database, please try again",
        "SVR_DAO_RDERR" : "Unable to read data from the Database, please try again",
        "SVR_DAO_WRERR" : "Unable to write to the Database, please try again",
        "SVR_DAO_UPERR" : "Unable update the Database, please try again",
        "SVR_DAO_DLERR" : "Unable to delete data from the Database, please try again",

        //REDIS
        "SVR_UTL_RDSCHERR" : "",
        "SVR_UTL_RDSRDERR" : "",

        //OAUTH
        "SVR_OAUTH_URLERR" : "",
        "SVR_OAUTH_CONNERR" : "",
        "SVR_OAUTH_EMLERR" : "",
        "SVR_OATH_INST" : "OOPS SEEMS LIKE THIS IS NOT YOU",
        "SVR_OATH_LGNDND" : "ITS OK YOU CAN LOGIN REGULARY",
        "SVR_OATH_LGNUSUC" : "LOGIN UNSUCCESSFUL",
        "SVR_OATH_UNPRF" : "UNABLE TO GET PROFILE DATA",

        //ROUTE HANDLERS
        "SVR_LGNH_LGNUSUC" : "LOGIN UNSUCESSFUL",
        "SVR_LGNH_INPASS" : "Invalid password",
        "SVR_LGNH_INEML" : "Invalid email id",
        "SVR_HNDLS_INREQ" : "Invalid request",
        "SVR_SGNH_UNSGNUP" : "UNABLE TO SIGN THE USER UP, PLEASE TRY SIGNING UP AGAIN, OR TRY GOOGLE LOGIN",
        "SVR_SGNH_EUSR" : "USER ALREADY EXISTS",
        "SVR_SGNH_INUSR" : "INVALID USER",
        "SVR_HNDLS_INDLCKIE" : "INVALID COOKIE DATA FOUND",
        "SVR_HNDLS_NOCKIE" : "COOKIE DATA NOT FOUND",
        "SVR_HDNLS_MTHNTFND" : "METHOD NOT FOUND!",
        "SVR_HNDLS_RTNTFND" : "ROUTE NOT FOUND",

    
    //CLIENT-SIDE ERRORS
        "CLI_MID_INVMET": "Invalid request method used",
        "CLI_MNU_IMNUARR":"unable to render menu, menuArray is undefined",
        "CLI_REQ_INVREQ" : "Invalid request object recieved",
        "CLI_SGN_INPASS" : "This password does not meet the requirements",
        "CLI_SGN_PASSMIS" : "Password and confirm password donot match"   
};

//message structure --> server/client_location(DAO/controller)_successmsg
constants.SMSG = {
    //server side success message
        //NOSUCCESS
        "NOSUCCESS" : "",
    
        //OAUTH
        "SVR_OATH_LGNSUC" : "LOGIN SUCCESSFUL",
        "SVR_OATH_NURLSUC" : "New User Discovered,Google Authentication url built successfully",
        "SVR_OATH_URLSUC" : "Welcome Back!,Google Authentication url built successfully",
        "SVR_OATH_LGNSUC" : "LOGIN SUCCESSFUL",
        
        //ROUTE HANDLERS
        "SVR_LGNH_INLGNSUC" : "LOGIN SUCCESSFUL, INCOMPLETE USER DATA AVAILABLE",
        "SVR_LGNH_LGNSUC" : "LOGIN SUCCESSFUL",
        "SVR_SNGH_SGNSUC" : "SIGNUP SUCCESSFUL, LOGGING YOU IN",
        "SVR_SGNH_NUSR" : "NO USER EXISTS FOR THIS DATA",
        "SVR_PHH_USRUP" : "USER DATA UPDATED",
        "SVR_SHH_PRJUP" : "PROJECT DATA UPDATED",
        "SVR_UHH_RDUSR" : "USER FOUND"
};

//oauth related details
constants.OAuthCONST = {

    "authUrlTemplate" : "https://accounts.google.com/o/oauth2/v2/auth",
    "refreshTokenURL" : "https://oauth2.googleapis.com/token",
    "scopeDetails" : {    
                "SIGNIN" :  "https://www.googleapis.com/auth/userinfo.profile",
                "CALENDAR" : "https://www.googleapis.com/auth/calendar",
                "CONTACTS" : "https://www.googleapis.com/auth/contacts.readonly"
              },
    "profileDetails" : "https://www.googleapis.com/userinfo/v2/me",          
    "appAuth" : {  
                "redirectURL" : "https://localhost:3000/postAuth",
                "clientID" : "1080818671374-c2g6q20tvj4eqsobn2e9fl75ggdncvu4.apps.googleusercontent.com",
                "clientSecret" : "p8orbG1dvXtprjeYopQ-cF22",
                "senderEmail" : "atlaschroma@gmail.com",
                "sendEmailRefreshToken" : "1//04ObVXdv-HIECCgYIARAAGAQSNwF-L9Ir9JUqY747db531D1lRHAtdYLAUZ5aGHBLN6-AJV19Ny0BtcGPv8go5Pxn1qcrkygE9sQ" 
            }
};

//paths and headers for all the email templates
constants.EMAILTEMPLATES = {
     "WELCOMEMAIL" : {
                        "templateLocation" : "/home/kinshuk/Documents/CodeBase/atlaschroma/backEnd/src/lib/emailTemplate/welcome.html",
                        "templateHeader" : "Welcome to Atlas Chroma"
                     },
     "ADDSTORY" : {
                    "templateLocation" : "/home/kinshuk/Documents/CodeBase/atlaschroma/backEnd/src/lib/emailTemplate/addStory.html",
                    "templateHeader" : "Hi, a new story has been added under your name"
                  }                  
};

//DBaaS related constant, used for deleting or updating SINGLE or MULTIPLE values in a document
constants.SINGLE = 1;
constants.MULTIPLE = 2;

//redux actionTypes
constants.actionTypes = {
     CHANGEURL : "CHANGEURL",
     SETUSER : "SETUSER",
     SETUSERLIST: "SETUSERLIST",
     CHANGEMSG : "CHANGEMSG"   
};

constants.urls = {
    LANDING : "/landing",
    SIGNUP : "/signup",
    LOGIN : "/login",
    DASHBOARD: "/dashboard",
    POSTSIGNUPFORM:"/postsignupform",
    POSTAUTHFORM: "/postauthform",
    POSTAUTH: "/postAuth",
    USER:"/user",
    USERPROJECT:"/user/projects"
}; 

//export the module
module.exports = {...constants};

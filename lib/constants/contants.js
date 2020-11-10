//declaring the module
const constants = {};

//DBaaS related Constants object
constants.DBCONST = {
    "DB_NAME": "atlasChroma",
    "userCollection": "testCollection",
    "projectCollection": "projectCollection",
    "chatCollection": "chatCollection",
    "password" : "8658Vokun8658",
    "failedEmailCollection" : "failedEmailCollection"
}

constants.dbConnUrl = "mongodb+srv://admin:" + constants.DBCONST.password + "@atlas-cloud-yrwic.mongodb.net/test?retryWrites=true&w=majority";

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
        "SVR_UTL_RDSINCERR" : "Incomplete data provided, unable to add data to redis database",
        "SVR_UTL_RDSUNKEYERR" : "Please provided a key to search data",
        "SVR_UTL_RDSCRERR" : "Unable to add data to the redis database, please try again",
        "SVR_UTL_RDSRDERR" : "Unable to read data from redis database, please try again",
        "SVR_UTL_RDSDELERR" : "Unable to delete data from redis database, please try again",
        "SVR_UTL_RDSCLRCHERR" : "Unable to clear redis database, please try again",
        "SVR_UTL_RDSUSRERR" : "Unable to get userlist from redis database, please try again",

        //MESSAGE
        "SVR_UTL_SOCMSGERR" : "Please provide participants name, to create message room",
        "SVR_UTL_MSGBDYERR" : "Invalid message body provided",
        "SVR_UTL_INCDTAERR" : "Unable to deliver messages, participants are missing",
        "SVR_UTL_MISUSRERR" : "Please provide username to get messages",

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
        "SVR_UHH_INVLDUSRID" : "Cannot find data for the given UserID",

    
    //CLIENT-SIDE ERRORS
        "CLI_MID_INVMET": "Invalid request method used",
        "CLI_PRJ_LEADDEL": "Cant remove the project lead directly, change the project lead and then remove the current one from the contributors",
        "CLI_MNU_IMNUARR":"unable to render menu, menuArray is undefined",
        "CLI_REQ_INVREQ" : "Invalid request object recieved",
        "CLI_SGN_INPASS" : "This password does not meet the requirements",
        "CLI_SGN_PASSMIS" : "Password and confirm password donot match",
        "CLI_SGN_INVEML" : "Email Id is already in use by someone else",
        "CLI_SGN_INUSR" : "Username is already in use by someone else",
        "CLI_LGN_GLECONNERR" : "Unable to connect to google servers",
        "CLI_PRF_DELUSRERR" : "You still contributing in some projects, please remove yourself from them befre deleting the account",
        "CLI_PRJ_UPDERR" : "Duplicate project name found",
        "CLI_PRJ_UPPRJLDR" : "ProjectLeader is already a contributor",
        "CLI_PRJ_UPCNERR" : "The contributor has already been added",
        "CLI_MSG_OFFLINE" : " is offline, we will save this conversation for them to view later",
        "CLI_TMPBLD_PHSWIP" : "Phases with children cannot have WIP, setting it to zero",
        "CLI_TMPBLD_PHSEXT" : "This phase name already exists",
        "CLI_STRY_DTEERR" : "End Date cannot be less than Current Date",
        "CLI_STRY_STRDTILSERR" : "Story details cannot be empty",
        "CLI_STRY_STRMVE" : "Cannot promote this story due to WIP limits",
        "CLI_PRJSTP_INVLDPHS" : "One of the Phases/Subphases has 1 Child This is invalid!!",
        "CLI_PRJSTP_INVLDTMP" : "Template type cannot be left empty"
};

//message structure --> server/client_location(DAO/controller)_successmsg
constants.SMSG = {
    //server side success message
        //NOSUCCESS
        "NOSUCCESS" : "",
    
        //OAUTH
        "SVR_OATH_LGNSUC" : "LOGIN SUCCESSFUL",
        "SVR_OATH_NLGNSUC" : "Signup successful, unable to nortify the user",
        "SVR_OATH_NURLSUC" : "New User Discovered,Google Authentication url built successfully",
        "SVR_OATH_URLSUC" : "Welcome Back!,Google Authentication url built successfully",
        "SVR_OATH_LGNSUC" : "LOGIN SUCCESSFUL",

        //MESSAGE 
        "SVR_UTL_RMNSUC" : "Roomname successfully added to the database",
        "SVR_UTL_SNDSUC" : "Sender has successfully joined : ",
        "SVR_UTL_RVRSUC" : "Reciever has successfully joined : ",
        "SVR_UTL_RVRPRESUC" : "Reciever is already a part of the room",
        "SVR_UTL_MSGUPTSUC" : "Conversation history updated in the database",
        "SVR_UTL_DLVRMSGSUC" : "All Messages have been delivered to the user",
        
        //ROUTE HANDLERS
        "SVR_LGNH_INLGNSUC" : "LOGIN SUCCESSFUL, INCOMPLETE USER DATA AVAILABLE",
        "SVR_LGNH_LGNSUC" : "LOGIN SUCCESSFUL",
        "SVR_SNGH_SGNSUC" : "SIGNUP SUCCESSFUL, LOGGING YOU IN",
        "SVR_SGNH_NUSR" : "NO USER EXISTS FOR THIS DATA",
        "SVR_UHH_RDUSR" : "USER FOUND",
        "SVR_UHH_USRUPSUC": "User Data updated successfully",
        "SVR_UHH_USRDELSUC" : "User Deleted Successfully",
        "SVR_UHH_IUSRDELSUC" : "User Deleted Successfully, but unable to nortify the user",
        "SVR_SHH_STRADDSUC" : "Story details added to the board successfully",
        "SVR_SHH_ISTRADDSUC" : "Story details added to the board successfully, but unable to nortify the user",
        "SVR_SHH_STRUPSUC" : "Story updated successfully",
        "SVR_SHH_ISTRUPSUC" : "Story updated successfully, but unable to nortify the user",
        "SVR_SHH_STRDELSUC" : "Story deleted successfully",
        "SVR_SHH_ISTRDELSUC" : "Story deleted successfully, but unable to nortify the user",
        "SVR_NHH_NTADDSUC" : "Notes added successfully",
        "SVR_NHH_NTUPSUC" : "Notes updated successfully",
        "SVR_NHH_NTDELSUC" : "Notes deleted successfully",
        "SVR_EHH_EVTADDSUC" : "Event added successfully to the scheduler",
        "SVR_EHH_IEVTADDSUC" : "Event added successfully to the scheduler, but unable to nortify the user",
        "SVR_EHH_EVTUPSUC" : "Event updated successfully",
        "SVR_EHH_IEVTUPSUC" : "Event updated successfully, but unable to nortify the user",
        "SVR_EHH_EVTDELSUC" : "Event deleted successfully from the scheduler",
        "SVR_EHH_IEVTDELSUC" : "Event deleted successfully from the scheduler, but unable to nortify the user",
        "SVR_PHH_PRJADDSUC" : "Project added successfully",
        "SVR_PHH_IPRJADDSUC" : "Project added successfully, but unable to nortify the user",        
        "SVR_PHH_PRJUPSUC" : "Project updated successfully",
        "SVR_PHH_IPRJUPSUC" : "Project updated successfully, but unable to nortify the user",
        "SVR_PHH_PRJDELSUC" : "Project deleted successfully",
        "SVR_PHH_IPRJDELSUC" : "Project deleted successfully, but unable to nortify the user",


        //client 
        "CLI_SGN_CHKDATA" : "Hold on while we check if the username/email are valid",
        "CLI_SGN_CHKUSR" : "Hold on while we check if username is valid"

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
                "sendEmailRefreshToken" : "1//0fzU9tg1NK7uGCgYIARAAGA8SNwF-L9IrHsyZ_xFdrME0WCqlzqcJlNvonzl7AaLVxjoUk5eXZnt2yec03tUJLlnJd9qLZOOscsQ" 
            }
};

//paths and headers for all the email templates
constants.EMAILTEMPLATES = {
     "WELCOMEMAIL" : {
                        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/welcome.html",
                        "templateHeader" : "Welcome to Atlas Chroma"
                     },
     "ADDSTORY" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/addStory.html",
                    "templateHeader" : "Hi, a new story has been added under your name"
                  },
    "MOVESTORY" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/movedStory.html",
                    "templateHeader" : "Hi, a story has been moved"
                  },
    "DELETESTORY" : {
                        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/deleteStory.html",
                        "templateHeader" : "Hi, a story has been delete"
                    },
    "ADDEVENT" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/addEvent.html",
                    "templateHeader" : "Hi, a new event has been added to your calender"
                 },
    "DELETEEVENT" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/deleteEvent.html",
                    "templateHeader" : "Hi, an event has been deleted"
                 },  
    "EDITEVENT" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/editEvent.html",
                    "templateHeader" : "Hi, an event has been edited"
                 },                
    "ADDUSER" : {
                        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/addUser.html",
                        "templateHeader" : "Hi, you are now a member of a project"
                   },
    "EDITPROJECT" : {
                        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/editProject.html",
                        "templateHeader" : "Hi, a project has been edited"
                   },
    "REMOVEDUSER" : {
                        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/removeUser.html",
                        "templateHeader" : "Hi, you have been removed from a project"
                   },
    "DELETEDPROJECT" : {
                        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/deleteProject.html",
                        "templateHeader" : "Hi, a project has been deleted"
                    },
    "ADDPROJECT" : {
                        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/addProject.html",
                        "templateHeader" : "Hi, you are now a member of a new project"
                   },
    "ADDNOTES" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/addNotes.html",
                    "templateHeader" : "Hi, a new note has been added to your calender"
               },    
    "DELETENOTES" : {
                "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/deleteNotes.html",
                "templateHeader" : "Hi, a note has been deleted from your calender"
                },
    "EDITNOTES" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/editNotes.html",
                    "templateHeader" : "Hi, a note has been edit in your calender"
                } ,
    "EDITUSER" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/updateUser.html",
                    "templateHeader" : "Hi, your details have been updated"
                },
    "DELETEUSER" : {
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/deleteUser.html",
                    "templateHeader" : "Sorry to see you go"
                },
    "ALLDAYREMINDER" :{
                    "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/allDayeventReminder.html",
                    "templateHeader" : "Lots to do today"
                    },
    "TIMEDREMINDER" :{
        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/timedEventReminder.html",
        "templateHeader" : "Scheduled Events for the Hour"
        },
    "CONVOHISTORY" :{
        "templateLocation" : "/home/kinshuk/Documents/atlasChroma/backEnd/src/lib/emailTemplate/conversationHistory.html",
        "templateHeader" : "Convseration History"
        }                                                                                                                                                                                                                           
};

//DBaaS related constant, used for deleting or updating SINGLE or MULTIPLE values in a document
constants.SINGLE = 1;
constants.MULTIPLE = 2;

//redux actionTypes
constants.actionTypes = {
     CHANGEURL : "CHANGEURL",
     ADDROOM : "ADDROOM",
     SETMSG : "SETMSG",
     ADDMSG : "ADDMSG",
     SETUSER : "SETUSER",
     SETUSERLIST: "SETUSERLIST",
     CHANGEMSG : "CHANGEMSG",
     UPDATEPROJECTDETAILS : "UPDATEPROJECTDETAILS",
     SETSOCKET : "SETSOCKET",
     CHANGELOADINGSTATE : "CHANGELOADINGSTATE" ,
     UPDATEPREVIOUSTIME : "UPDATEPREVIOUSTIME" 
};

constants.urls = {
    LANDING : "/landing",
    SIGNUP : "/signup",
    LOGIN : "/login",
    BOARD : "/boards",
    PROJECT : "/projects",
    SCHEDULER : "/scheduler",
    POSTSIGNUPFORM:"/postsignupform",
    POSTAUTHFORM: "/postauthform",
    POSTAUTH: "/postAuth",
    USER:"/user",
    USERPROJECT:"/user/projects"
}; 

//export the module
module.exports = {...constants};

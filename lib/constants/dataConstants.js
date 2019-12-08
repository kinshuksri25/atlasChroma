var dataConstants = {};

dataConstants.constants = {
    "backEndPort": "5000",
    "secureProtocol": "https:",
    "protocol": "http:",
    "hostname": "localhost",
    "selfAuth": "selfAuthCredentials"
};

dataConstants.dbConstants = {
    "username": "atlascloud@gmail.com",
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

    //GOOGLE API ERRORS
    "ERR_EML_SGN": "Couldnot reach the provided email, the server came back with the following message -->",

    //INTERNAL ERRORS
    "ERR_SESS_LGN": "Unable to create valid session for the user, the server came back with the following message -->"
};

//export the module
module.exports = {...dataConstants };
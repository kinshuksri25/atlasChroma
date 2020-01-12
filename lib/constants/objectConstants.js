var userObject = {
    '_id': '',
    'UserName': '',
    'Email': '',
    'Photo': '',
    'Password': '',
    'FirstName': '',
    'LastName': '',
    'Projects': {},
    'PhoneNumber': '',
    'activeSession': {}
};

var sessionObject = {
    'sessionID': '',
    'creationTime': '',
};

var urlObject = {
    currentUrl:''
}

var authObject = {
    "_id": "",
    "authCred": {
        ClientID: "1080818671374-c2g6q20tvj4eqsobn2e9fl75ggdncvu4.apps.googleusercontent....",
        ClientSecret: "p8orbG1dvXtprjeYopQ-cF22",
        AuthToken: "",
        RefreshToken: "",
        RedirectUrl: "https://localhost:5000/postAuth"
    }
}

module.exports = { userObject, sessionObject, authObject, urlObject };
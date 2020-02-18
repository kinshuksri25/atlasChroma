var userObject = {
    '_id': '',
    'UserName': '',
    'Email': '',
    'Photo': '',
    'Password': '',
    'FirstName': '',
    'LastName': '',
    'Projects': [],
    'PhoneNumber': ''
};

var sessionObject = {
    'sessionID': '',
    'creationTime': '',
};

var userList = [];

var urlObject = {
    currentUrl:''
}

module.exports = { userObject, userList,sessionObject, urlObject };
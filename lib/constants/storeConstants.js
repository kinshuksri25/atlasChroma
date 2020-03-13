let userObject = {
    'UserName': '',
    'Email': '',
    'Photo': '',
    'Password': '',
    'FirstName': '',
    'LastName': '',
    'Projects': [],
    'PhoneNumber': ''
};

let sessionObject = {
    'sessionID': '',
    'creationTime': '',
};

let userList = [];

let urlObject = {
    currentUrl:''
}

let msgObject = {
    msg : '',
    status : ''
}

module.exports = { userObject, userList,sessionObject, urlObject, msgObject };

let userObject = {
    'username': '',
    'email': '',
    'photo': '',
    'password': '',
    'firstname': '',
    'lastname': '',
    'projects': [],
    'phonenumber': ''
};

let userList = [];

let socketObject = {
    io : ""
};

let urlObject = {
    currentUrl:'',
    activeTab: ''
}

let clockObject = {
    previousTime : ""
}

let messageObject = {};

let projectDetails = {}

let msgObject = {
    msg : '',
    status : ''
}

let chatObject = {
    sender : "",
    message : "",
    date : ""
}

let loadingObject = {
    isLoading : false
}

module.exports = { userObject, userList, urlObject, msgObject, projectDetails, socketObject, chatObject, messageObject, loadingObject, clockObject};

//Blueprint for cookie Objects
class cookies {
  constructor(cookieName = ""){
    this.cookieName = cookieName;
  }
  
  getCookie(){
    return ({ID : this.cookieName});
  }
  
  setCookie(cookieName = this.cookieName){
    this.cookieName = cookieName;
  }
};

//export the module
module.exports = cookies;

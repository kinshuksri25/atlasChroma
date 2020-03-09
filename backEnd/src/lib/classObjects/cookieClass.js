//Blueprint for cookie Objects
class cookies {
  constructor(cookieName = "",creationTime = Date.now()){
    this.cookieName = cookieName;
    this.creationTime = creationTime;
  }
  
  getCookie(){
    return ({cookieName:this.cookieName, creationTime:this.creationTime});
  }
  
  setCookie(cookieName = this.cookieName,creationTime = this.creationTime){
    this.cookieName = cookieName;
    this.creationTime = creationTime;
  }
};

//export the module
module.exports = cookies;

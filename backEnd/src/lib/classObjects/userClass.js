//Dependencies
const {randValueGenerator} = require("../utils/helper");

//Blueprint for the user objects
class userObject{
  constructor({_id = randValueGenerator(), 
              username = "",
              email = "",
              photo = "",
              password = "",
              firstname = "",
              lastname = "",
              projects = [],
              phonenumber = "",
              state = "",
              refreshtoken = ""}){
    
    this._id = _id;
    this.username = username;
    this.email = email;
    this.photo = photo;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.projects = projects;
    this.phoneno = phonenumber;
    this.state = state;
    this.refreshToken = refreshtoken;
  }
 
  getUserObject(){
  return({_id : this._id,
          userName : this.username,
          email : this.email,
          photo : this.photo,
          password : this.password,
          firstname : this.firstname,
          lastname : this.lastname,
          projects : this.projects,
          phonenumber : this.phoneno,
          state : this.state,
          refreshtoken : this.refreshtoken});
  }
  
  setUserObject({_id = this._id,
                username = this.username,
                email = this.email,
                photo = this.photo,
                password = this.password,
                firstname = this.firstname,
                lastname = this.lastname,
                projects = this.projects,
                phoneno = this.phoneno,
                state = this.state,
                refreshtoken = this.refreshtoken}){
  
    this._id = _id;
    this.username = username;
    this.email = email;
    this.photo = photo;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.projects = projects;
    this.phoneno = phoneno;
    this.state = state;
    this.refreshtoken = refreshtoken;
  }
}

//export the module
module.exports = userObject;

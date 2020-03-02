//Dependencies
const randValueGenerator = require("");

//Blueprint for the user objects

class userObject{
  constructor(_id = randValueGenerator(), UserName = "",Email = "",Photo = "",Password = "",FirstName = "",LastName = "",Projects = [],PhoneNumber = ""){
    
    this._id = _id;
    this.username = UserName;
    this.email = Email;
    this.photo = Photo;
    this.password = Password;
    this.firstname = FirstName;
    this.lastname = LastName;
    this.projects = Projects;
    this.phoneno = PhoneNumber;
  }
 
  getUserObject(){
  return({_id : this._id,
          UserName : this.username,
          Email : this.email,
          Photo : this.photo,
          Password : this.password,
          FirstName : this.firstname,
          LastName : this.lastname,
          Projects : this.projects,
          PhoneNumber : this.phoneno});
  }
  
  setUserObject(_id = this._id,
                username = this.username,
                email = this.email,
                photo = this.photo,
                password = this.password,
                firstname = this.firstname,
                lastname = this.lastname,
                projects = this.projects,
                phoneno = this.phoneno){
  
    this._id = _id;
    this.username = username;
    this.email = email;
    this.photo = photo;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.projects = projects;
    this.phoneno = phoneno;
  }
}

//export the module
module.exports = userObject;

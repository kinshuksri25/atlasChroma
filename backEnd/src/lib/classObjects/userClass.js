//Blueprint for the user objects

class userObject{
  constructor(UserName = "",Email = "",Photo = "",Password = "",FirstName = "",LastName = "",Projects = [],PhoneNumber = ""){
    
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
  return({UserName : this.username,
          Email : this.email,
          Photo : this.photo,
          Password : this.password,
          FirstName : this.firstname,
          LastName : this.lastname,
          Projects : this.projects,
          PhoneNumber : this.phoneno});
  }
  
  setUserObject(username = this.username,
                email = this.email,
                photo = this.photo,
                password = this.password,
                firstname = this.firstname,
                lastname = this.lastname,
                projects = this.projects,
                phoneno = this.phoneno){
                
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

//Blueprint for response Object 
class responseObject{

  constructor(status = 500,smsg = "", payload = {}, emsg = ""){
    this.status = status;
    this.smsg =  smsg;
    this.payload = payload;
    this.emsg = emsg;
  }
  
  getResponseObject(){
    return({STATUS: this.status,SUCCESSMSG: this.smsg,PAYLOAD: this.payload,ERRORMSG: this.emsg});
  }
  
  setResponseObject(status = this.status,smsg = this.smsg,payload = this.payload,emsg = this.emsg){
    this.status = status;
    this.smsg =  smsg;
    this.payload = payload;
    this.emsg = emsg;
  }

};

//export the module
module.exports = responseObject;

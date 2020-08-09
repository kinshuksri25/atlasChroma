//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import "../../StyleSheets/login.css";
import SimpleForm from '../../Forms/simpleform';
import cookieManager from '../../Components/cookieManager';
import formConstants from '../../Forms/formConstants';
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import {urls} from "../../../../lib/constants/contants";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "selectedTemplate": "",
            "disableButton" : false                   
        };
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    componentDidMount(){
        this.props.chosenTemplate == "GoogleLogin" && this.setState({"selectedTemplate": <SimpleForm formAttributes = { formConstants.googleLogin }
                                                                                            submitHandler = { this.onSubmitHandler }
                                                                                            changeFieldNames = {[]}/>});
        
        this.props.chosenTemplate == "Login" && this.setState({"selectedTemplate": <SimpleForm formAttributes = { formConstants.login }
                                                                                    submitHandler = { this.onSubmitHandler }
                                                                                    changeFieldNames = {[]}/>});                                                            
    }

    onSubmitHandler(formObject) {
        let headers = {};
        let errorObject = {...msgObject};
        let gmailPatternError = "";
        let globalThis = this;
        if(formObject.route != "/login"){
            let gmailRegex = new RegExp(/([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g);
            gmailPatternError = gmailRegex.test(formObject.formData.Email) ? "" : "invalid email";
            if(gmailPatternError == "")
                    formObject.formData = "Email="+formObject.formData.Email;
        }
        if(gmailPatternError == "" && !this.state.disableButton){ 
          this.setState({disableButton : true});
          httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData,function(error,responseObject) {
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.ERRORMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }else{
                if(formObject.route == "/login"){
                    if(responseObject.PAYLOAD.hasOwnProperty("uniqueID")){
                        localStorage.uniqueID = responseObject.PAYLOAD.uniqueID;
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.POSTSIGNUPFORM);   
                    }else{
                        //set the session
                        cookieManager.setUserSessionDetails(responseObject.PAYLOAD.userID);
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.DASHBOARD);
                    }
                }else{
                    if(JSON.stringify(responseObject.Payload) == JSON.stringify({})){
                        errorObject.msg = "Unable to connect to google servers";
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);  
                    }else{
                        window.location = responseObject.PAYLOAD.authURL;
                    }
                }
            }   
        });
        }else{
            if(!this.state.disableButton){
                errorObject.msg = "Invalid Email ID";
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }
        }
    }

    render() {
            return (<div className="loginPageContainer">
                        <button onClick={this.props.closeModal}>X</button>
                        <h1 className="loginTitle">Welcome Back!</h1>
                        <div className="loginContainer">
                            { this.state.selectedTemplate }  
                        </div>
                    </div>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        }
    };
};

export default connect(null,mapDispatchToProps)(Login);

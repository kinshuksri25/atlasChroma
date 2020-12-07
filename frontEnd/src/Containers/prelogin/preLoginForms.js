//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Accordion,Card,OverlayTrigger,Tooltip} from 'react-bootstrap';

import signUpLogo from '../../Images/icons/signUpIcon.png';
import loginLogo from '../../Images/icons/loginIcon.png';
import googleLogo from '../../Images/icons/googleIcon.png';
import signUpLogoColor from '../../Images/icons/signUpIconColor.png';
import loginLogoColor from '../../Images/icons/loginIconColor.png';
import googleLogoColor from '../../Images/icons/googleIconColor.png';
import SimpleForm from '../../Forms/simpleform';
import cookieManager from '../../Components/cookieManager';
import formConstants from '../../Forms/formConstants';
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import {EMSG,urls} from "../../../../lib/constants/contants";
import setLoadingAction from '../../store/actions/loadingActions';

class PreLoginForms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "validEmail": false,
            "isCheckingEmail": false,
            "isCheckingUsername": false,
            "validUserName": false,
            "email": "",
            "username": "",
            "disableButton" : false,
            "loginHover" : false, 
            "signUpHover" : false, 
            "googleHover" : false, 
            "activeTab" : "signUp"
        };
        this.onLoginSubmitHandler = this.onLoginSubmitHandler.bind(this);
        this.checkPasswordValidity = this.checkPasswordValidity.bind(this);
        this.onSignupSubmitHandler = this.onSignupSubmitHandler.bind(this);
        this.emailValidator = this.emailValidator.bind(this);
        this.userNameValidator = this.userNameValidator.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.mouseOverHandler = this.mouseOverHandler.bind(this);
        this.mouseOutHandler = this.mouseOutHandler.bind(this);
        this.changeActiveTab = this.changeActiveTab.bind(this);
    }

    componentDidMount(){
        this.props.changeLoadingState(false);
    }

    //TODO --> this has to be called when offclick happens
    changeHandler(formObject) {
        var globalThis = this;
        formObject.Email != this.state.email && this.emailValidator(formObject.Email, globalThis);
        formObject.UserName != this.state.username && this.userNameValidator(formObject.UserName, globalThis);
        this.setState({
            "email": formObject.Email,
            "username": formObject.UserName
        });
    }

    emailValidator(email, globalThis) {
        var globalThis = this;
        var emailCheckQueryString = 'Email=' + email;
        var headers = { "Origin": "https://localhost:3000" };
        this.setState({
            "isCheckingEmail": true
        }, () => {
            httpsMiddleware.httpsRequest('/signup/userAvaliablity', 'GET', headers, emailCheckQueryString,function(error,responseObject) {
                let errorObject = {...msgObject};
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    if (responseObject.EMSG != "") {
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                        globalThis.setState({
                            "validEmail": false,
                            "isCheckingEmail": false
                        });
                    } else {
                        //set the state
                        globalThis.setState({
                            "validEmail": true,
                            "isCheckingEmail": false
                        });
                    }
                }
            });
        });
    };

    userNameValidator(userName, globalThis) {
        var globalThis = this;
        var userNameCheckQueryString = 'UserName=' + userName;
        var headers = { "Origin": "https://localhost:3000" };

        this.setState({
            "isCheckingUsername": true
        }, () => {
            httpsMiddleware.httpsRequest('/signup/userAvaliablity', 'GET', headers, userNameCheckQueryString,function(error,responseObject) {
                let errorObject = {...msgObject};
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    if (responseObject.EMSG != "") {
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                        globalThis.setState({
                            "validUserName": false,
                            "isCheckingUsername": false
                        })
                    } else {
                        //set the state
                        globalThis.setState({
                            "validUserName": true,
                            "isCheckingUsername": false
                        });
                    }
                }
            }); 
        });
    }  

    onSignupSubmitHandler(formObject) {
        let headers = {};
        let errorObject = {...msgObject};
        let globalThis = this;
        if (formObject.formData.hasOwnProperty('UserName') && formObject.formData.hasOwnProperty('Email') && formObject.formData.hasOwnProperty('Password') && formObject.formData.hasOwnProperty('ConfirmPassword')) {
            this.props.changeLoadingState(true);
            var EMSG = this.checkPasswordValidity(formObject.formData.Password, formObject.formData.ConfirmPassword);
            if (this.state.validEmail && this.state.validUserName) {
                if(EMSG == ""){
                    httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData,function(error,responseObject) {
                        globalThis.props.changeLoadingState(false);
                        if(responseObject.STATUS != 200 || error){
                            if(error){
                                errorObject.msg = error;
                                errorObject.status = "ERROR";
                                globalThis.props.setMsgState(errorObject);
                            }else{
                                errorObject.msg = responseObject.EMSG;
                                errorObject.status = "ERROR";
                                globalThis.props.setMsgState(errorObject);
                            }
                        }else{
                            //set the localstorage
                            localStorage.uniqueID = responseObject.PAYLOAD.uniqueID;
                            //TODO --> change the pushState 'state' and 'title'
                            window.history.pushState({},"",urls.POSTSIGNUPFORM);
                        }
                    });
                } else {
                        errorObject.msg = EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                } 
            } else {
                if(globalThis.state.isCheckingEmail && globalThis.state.isCheckingUsername){
                    errorObject.msg = SMSG.CLI_SGN_CHKDATA;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = globalThis.state.validEmail ? EMSG.CLI_SGN_INUSR : EMSG.CLI_SGN_INVEML;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }
        } else {
            errorObject.msg = EMSG.CLI_REQ_INVREQ;
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
    }
     
    checkPasswordValidity(password, confirmPassword) {
        var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!regex.test(password)) {
            return EMSG.CLI_SGN_INPASS;
        }
        if (password != confirmPassword) {
            return EMSG.CLI_SGN_PASSMIS;
        }
        return "";
    };

    onLoginSubmitHandler(formObject) {
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
            this.props.changeLoadingState(true);
            this.setState({disableButton : true});
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData,function(error,responseObject) {
                globalThis.props.changeLoadingState(false);
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                    if(error){
                        errorObject.msg = error;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }else{
                        errorObject.msg = responseObject.EMSG;
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
                            cookieManager.setUserSessionDetails(responseObject.PAYLOAD);
                            //TODO --> change the pushState 'state' and 'title'
                            window.history.pushState({},"",urls.PROJECT);
                        }
                    }else{
                        if(JSON.stringify(responseObject.Payload) == JSON.stringify({})){
                            errorObject.msg = EMSG.CLI_LGN_GLECONNERR;
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
                errorObject.msg = EMSG.CLI_SGN_INVEML;
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }
        }
        this.setState({disableButton : false});
    }

    mouseOverHandler(event){
        if(event.currentTarget.className.indexOf("signUpOptionContainer")>=0){
            this.setState({"loginHover" : false, 
                            "signUpHover" : true, 
                            "googleHover" : false,});
        }else if(event.currentTarget.className.indexOf("loginOptionContainer")>=0){
            this.setState({"loginHover" : true, 
                            "signUpHover" : false, 
                            "googleHover" : false,});
        }else if(event.currentTarget.className.indexOf("googleOptionContainer")>=0){
            this.setState({"loginHover" : false, 
                            "signUpHover" : false, 
                            "googleHover" : true,});
        }
    }

    mouseOutHandler(event){
        if(event.currentTarget.className.indexOf("signUpOptionContainer")>=0){
            this.setState({"signUpHover" : false});
        }else if(event.currentTarget.className.indexOf("loginOptionContainer")>=0){
            this.setState({"loginHover" : false});
        }else if(event.currentTarget.className.indexOf("googleOptionContainer")>=0){
            this.setState({"googleHover" : false});
        }
    }

    changeActiveTab(event){
        if(event.target.className.indexOf("buttonText")>=0){
            if(event.currentTarget.className.indexOf("signUpOptionContainer")>=0){
                this.state.activeTab == "signUp" || this.setState({"activeTab" : "signUp"});
                this.state.activeTab == "signUp" && this.setState({"activeTab" : ""});
            }else if(event.currentTarget.className.indexOf("loginOptionContainer")>=0){
                this.state.activeTab == "login" || this.setState({"activeTab" : "login"});
                this.state.activeTab == "login" && this.setState({"activeTab" : ""});
            }else if(event.currentTarget.className.indexOf("googleOptionContainer")>=0){
                this.state.activeTab == "google" || this.setState({"activeTab" : "google"});
                this.state.activeTab == "google" && this.setState({"activeTab" : ""});
            }
        }
    }

    render() {
        let signUp = this.state.activeTab == "signUp" ? signUpLogoColor : this.state.signUpHover ? signUpLogoColor : signUpLogo;
        let login = this.state.activeTab == "login" ? loginLogoColor : this.state.loginHover ? loginLogoColor : loginLogo;
        let google = this.state.activeTab == "google" ? googleLogoColor : this.state.googleHover ? googleLogoColor : googleLogo;
        return (<Accordion  className="signUpContainer" defaultActiveKey="0">
                    <Card className = "signUpOptionContainer" onMouseOver={this.mouseOverHandler} onMouseOut={this.mouseOutHandler} onClick={this.changeActiveTab}>
                        <OverlayTrigger placement="left" overlay={<Tooltip> <strong>SignUp</strong>.</Tooltip>}>
                        <Accordion.Toggle className="buttonText" id = "signup" as={Card.Header} eventKey="0">
                            <img src={signUp} alt="signUpLogo" width="50" height="50"/>
                        </Accordion.Toggle>      
                        </OverlayTrigger>
                        <Accordion.Collapse className = "preloginAccordianBody" eventKey="0">
                            <Card.Body className ="preloginCardBody">
                                <h3 className="signUpTitle">All right! Lets get started.</h3>
                                <SimpleForm formAttributes = { formConstants.signup }
                                submitHandler = { this.onSignupSubmitHandler }
                                changeHandler = { this.changeHandler }
                                changeFieldNames = {["Email", "UserName"]}/> 
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card className = "loginOptionContainer" onMouseOver={this.mouseOverHandler} onMouseOut={this.mouseOutHandler} onClick={this.changeActiveTab}>
                        <OverlayTrigger placement="left" overlay={<Tooltip> <strong>Login</strong>.</Tooltip>}>
                            <Accordion.Toggle className="buttonText" as={Card.Header} eventKey="1">
                                <img src={login} alt="loginLogo" width="50" height="50"/>
                            </Accordion.Toggle>          
                        </OverlayTrigger>
                        <Accordion.Collapse className = "preloginAccordianBody" eventKey="1">
                            <Card.Body className ="preloginCardBody">
                                <h4 className="loginTitle">Login using your Sokratic Credentials</h4>
                                <SimpleForm formAttributes = { formConstants.login }
                                submitHandler = { this.onLoginSubmitHandler }
                                changeFieldNames = {[]}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card className = "googleOptionContainer" onMouseOver={this.mouseOverHandler} onMouseOut={this.mouseOutHandler} onClick={this.changeActiveTab}>
                        <OverlayTrigger placement="left" overlay={<Tooltip> <strong>Google SignUp/Login</strong>.</Tooltip>}>
                            <Accordion.Toggle className="buttonText" as={Card.Header} eventKey="2">
                                <img src={google} alt="googleLogo" width="50" height="50"/>
                            </Accordion.Toggle>
                        </OverlayTrigger>
                        <Accordion.Collapse className = "preloginAccordianBody" eventKey="2">
                            <Card.Body className ="preloginCardBody"> 
                                <h4 className="loginTitle">Use One Click Google SignUp/Login</h4>
                                <SimpleForm formAttributes = { formConstants.googleLogin }
                                submitHandler = { this.onLoginSubmitHandler }
                                changeFieldNames = {[]}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        },
        changeLoadingState: (isLoading) =>{
            dispatch(setLoadingAction(isLoading));
        } 
    };
};

export default connect(null,mapDispatchToProps)(PreLoginForms);
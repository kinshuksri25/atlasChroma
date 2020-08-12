//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../StyleSheets/signUp.css';
import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import {EMSG,urls} from "../../../../lib/constants/contants";

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "validEmail": false,
            "isCheckingEmail": false,
            "isCheckingUsername": false,
            "validUserName": false,
            "email": "",
            "username": ""
        };
        this.checkPasswordValidity = this.checkPasswordValidity.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.emailValidator = this.emailValidator.bind(this);
        this.userNameValidator = this.userNameValidator.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
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

    onSubmitHandler(formObject) {
        let headers = {};
        let errorObject = {...msgObject};
        let globalThis = this;
        if (formObject.formData.hasOwnProperty('UserName') && formObject.formData.hasOwnProperty('Email') && formObject.formData.hasOwnProperty('Password') && formObject.formData.hasOwnProperty('ConfirmPassword')) {
            var EMSG = this.checkPasswordValidity(formObject.formData.Password, formObject.formData.ConfirmPassword);
            if (this.state.validEmail && this.state.validUserName) {
                if(EMSG == ""){
                    httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData,function(error,responseObject) {
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

    render() {
        return ( <div className="signUpContainer">
                    <button onClick={this.props.closeModal}>X</button>
                    <h1 className="signUpTitle">All right! Lets get started.</h1>
                    <SimpleForm formAttributes = { formConstants.signup }
                    submitHandler = { this.onSubmitHandler }
                    changeHandler = { this.changeHandler }
                    changeFieldNames = {["Email", "UserName"]}/> 
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

export default connect(null,mapDispatchToProps)(SignUp);
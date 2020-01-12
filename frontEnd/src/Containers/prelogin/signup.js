//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import localSession from '../../Components/sessionComponent';
import {urls} from "../../../../lib/constants/dataConstants";
import {ERRORS} from "../../../../lib/constants/dataConstants";
import setUrlAction from "../../store/actions/urlActions";

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
            httpsMiddleware.httpsRequest('/checkEmail', 'GET', headers, emailCheckQueryString, function(error,responseObject) {
                if(error){
                    //TODO --> add error msg div
                }else{
                    if (!responseObject.Status) {
                        //do something!!
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
            httpsMiddleware.httpsRequest('/checkUserName', 'GET', headers, userNameCheckQueryString, function(error,responseObject) {
                if(error){
                    //TODO --> add error msg div
                }else{
                    if (!responseObject.Status) {
                        //do something!!
                        globalThis.setState({
                            "validUserName": false,
                            "isCheckingUsername": false
                        })
                    } else {
                        //set the state
                        globalThis.setState({
                            "validUserName": true,
                            "isCheckingUsername": false
                        })
                    }
                }
            });
        });
    };

    onSubmitHandler(formObject) {
            var headers = { "Origin": "https://localhost:3000" };
            if (formObject.hasOwnProperty('UserName') && formObject.hasOwnProperty('Email') && formObject.hasOwnProperty('Password') && formObject.hasOwnProperty('ConfirmPassword')) {
                var errorMsgObject = this.checkPasswordValidity(formObject.Password, formObject.ConfirmPassword);
                if (this.state.validEmail && this.state.validUserName && errorMsgObject == "") {
                        httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
                           if(error){
                                //TODO --> add error msg div
                           }else{
                                // if (!responseObject.Status) {
                                //     console.log(responseObject.ErrorMsg);
                                // } else {
                                //     //set the session
                                //     var session = localSession;
                                //     var sessionObject = session.setSessionObject(Result);
                                //     //post login form
                                //     window.location.pathname = "/postSignUp";
                                // }
                           }
                        });
                    } else {
                        //display message saying we are checking your credentials please wait a sec!
                        console.log(errorMsgObject);
                    }
            } else {
                //invalid formObject
                console.log("invalid object");
            }
        }

    checkPasswordValidity(password, confirmPassword) {
        var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!regex.test(password)) {
            return ERRORS.ERR_INPASS_CLI;
        }
        if (password != confirmPassword) {
            return ERRORS.ERR_PASSMIS_CLI;
        }
        return "";
    };

    render() {
        return ( <div>
                    <SimpleForm formAttributes = { formConstants.signup }
                    submitHandler = { this.onSubmitHandler }
                    changeHandler = { this.changeHandler }
                    changeFieldNames = {["Email", "UserName"]}/> 
                </div>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUrlState: (url) => {
            dispatch(setUrlAction(url));
        }
    };
};

export default connect(null, mapDispatchToProps)(SignUp);
//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import SimpleForm from './Forms/simpleform';
import formConstants from './Forms/formConstants';
import httpsMiddleware from '../middleware/httpsMiddleware';
import localSession from '../Components/sessionComponent';

//sessionComponent has to be added to dependencies

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "validEmail": false,
            "isCheckingEmail": false,
            "isCheckingUsername": false,
            "validUserName": false,
            "errorMsgObject": {},
            "email": "",
            "username": ""
        };
        this.checkPasswordValidity = this.checkPasswordValidity.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.emailValidator = this.emailValidator.bind(this);
        this.userNameValidator = this.userNameValidator.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    //this has to be called when offclick happens
    changeHandler(formObject) {
        var globalThis = this;
        formObject.Email != this.state.email && this.emailValidator(formObject, globalThis);
        formObject.UserName != this.state.username && this.userNameValidator(formObject, globalThis);
        this.setState({
            "email": formObject.Email,
            "username": formObject.UserName
        });
    }

    emailValidator(formObject, globalThis) {
        var emailCheckQueryString = 'Email=' + formObject.Email;
        delete formObject.SignUp;
        var headers = { "Origin": "https://localhost:3000" };
        this.setState({
            "isCheckingEmail": true
        }, () => {
            httpsMiddleware.httpsRequest('/checkEmail', 'GET', headers, emailCheckQueryString, function(responseObject) {
                if (!responseObject.Status) {
                    //do something!!
                    globalThis.setState({
                        "email": "",
                        "isCheckingEmail": false
                    });
                } else {
                    //set the state
                    globalThis.setState({
                        "validEmail": true,
                        "isCheckingEmail": false
                    });
                }
            });
        });
    };

    userNameValidator(formObject, globalThis) {

        var userNameCheckQueryString = 'UserName=' + formObject.UserName;
        delete formObject.SignUp;
        var headers = { "Origin": "https://localhost:3000" };
        this.setState({
            "isCheckingUsername": true
        }, () => {
            httpsMiddleware.httpsRequest('/checkUserName', 'GET', headers, userNameCheckQueryString, function(responseObject) {
                if (!responseObject.Status) {
                    //do something!!
                    globalThis.setState({
                        "username": "",
                        "isCheckingUsername": false
                    })
                } else {
                    console.log(responseObject);
                    //set the state
                    globalThis.setState({
                        "validUserName": true,
                        "isCheckingUsername": false
                    })
                }
            });
        });
    };

    onSubmitHandler(formObject) {
            //inital formObject setup
            delete formObject.SignUp;
            var headers = { "Origin": "https://localhost:3000" };
            var formParam;
            formConstants.signup.map(param => {
                if (param.type == "form") {
                    formParam = param;
                }
            });
            if (formObject.hasOwnProperty('UserName') && formObject.hasOwnProperty('Email') && formObject.hasOwnProperty('Password') && formObject.hasOwnProperty('ConfirmPassword')) {
                //password check
                var errorMsgObject = this.checkPasswordValidity(formObject.Password, formObject.ConfirmPassword);
                //set the state!
                this.setState({
                    "errorMsgObject": errorMsgObject
                }, () => {
                    if (this.state.validEmail && this.state.validUserName && JSON.stringify(errorMsgObject) == JSON.stringify({})) {
                        httpsMiddleware.httpsRequest(formParam.route, formParam.method, headers, formObject, function(responseObject) {
                            if (!responseObject.Status) {
                                console.log(responseObject.ErrorMsg);
                            } else {
                                //set the session
                                var session = localSession;
                                var sessionObject = session.setSessionObject(Result);
                                //post login form
                                window.location.pathname = "/postSignUp";
                            }
                        });
                    } else {
                        //display message saying we are checking your credentials please wait a sec!
                        console.log(errorMsgObject);
                    }
                });
            } else {
                //invalid formObject
            }
        }
        //check password
    checkPasswordValidity(password, confirmPassword) {
        var errorMsgObject = {};
        //check password validity
        if (password.match(/[a-z]/g).length == 0) {
            errorMsgObject.invalidPassLower = "The password should contain a lowercase character";
        }
        if (password.match(/[A-Z]/g).length == 0) {
            errorMsgObject.invalidPassUpper = "The password should contain an uppercase character";
        }
        if (password.match(/[0-9]/g).length == 0) {
            errorMsgObject.invalidPassDigit = "The password should contain a digit";
        }
        if (password.length < 8) {
            errorMsgObject.shortPassword = "The password should be atleast 8 characters long";
        }
        if (password != confirmPassword) {
            errorMsgObject.passwordMisMatch = "Password and Confirm-Password should match";
        }
        return errorMsgObject;
    };
    render() {
        return ( < div >
            <
            SimpleForm formAttributes = { formConstants.signup }
            submitHandler = { this.onSubmitHandler }
            changeHandler = { this.changeHandler }
            changeFieldNames = {
                ["Email", "UserName"]
            }
            /> < /
            div >
        );
    }
}


export default hot(module)(SignUp);
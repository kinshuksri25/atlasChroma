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
                    //TODO --> add error msg div (ERR_CONN_SERVER)
                    console.log(error);
                }else{
                    if (responseObject.Status == "ERROR") {
                        //TODO --> add error msg div
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
                    //TODO --> add error msg div (ERR_CONN_SERVER)
                    console.log(error);
                }else{
                    if (responseObject.Status == "ERROR") {
                        //TODO --> add error msg div
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
        let globalThis = this;
        if (formObject.formData.hasOwnProperty('UserName') && formObject.formData.hasOwnProperty('Email') && formObject.formData.hasOwnProperty('Password') && formObject.formData.hasOwnProperty('ConfirmPassword')) {
            var errorMsgObject = this.checkPasswordValidity(formObject.formData.Password, formObject.formData.ConfirmPassword);
            if (this.state.validEmail || this.state.validUserName) {
                if(errorMsgObject == ""){
                    httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
                        console.log(responseObject);
                        if(error || responseObject.Status == "ERROR"){
                            if(error){
                                console.log(error);
                                //TODO --> add errormsg div(ERR_CONN_SERVER)
                            }else{
                                //TODO --> add error msg div(errormsg)
                            }
                        }else{
                           //set the session 
                            localSession.setSessionObject(responseObject.Payload);
                
                            //TODO --> change the pushState 'state' and 'title'
                            window.history.pushState({},"",urls.POSTSIGNUPFORM);
                            globalThis.props.setUrlState(urls.POSTSIGNUPFORM);
                                                
                            globalThis.props.reRenderRoot();
                        }
                    });
                } else {
                        //TODO --> add errormsg div (ERR_INPASS_CLI/ERR_PASSMIS_CLI)
                } 
            } else {
                if(globalThis.state.isCheckingEmail && globalThis.state.isCheckingUsername){
                    //TODO --> add errormsg div (WAR_CHCKUSEREML_CLI)
                }else{
                    //TODO --> add errormsg div (ERR_INVUSREML_CLI)
                }
            }
        } else {
                //TODO --> add error msg div (ERR_DISINVREQ_CLI)
                console.log(urls.ERR_INVREQ_CLI);
        }
    }
                        
    onSubmitHandler(formObject) {
            let headers = {};
            let globalThis = this;
            if (formObject.formData.hasOwnProperty('UserName') && formObject.formData.hasOwnProperty('Email') && formObject.formData.hasOwnProperty('Password') && formObject.formData.hasOwnProperty('ConfirmPassword')) {
                var errorMsgObject = this.checkPasswordValidity(formObject.formData.Password, formObject.formData.ConfirmPassword);
                if (this.state.validEmail || this.state.validUserName) {
                    if(errorMsgObject == ""){
                        httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
                           console.log(responseObject);
                            if(error || responseObject.Status == "ERROR"){
                                if(error){
                                    console.log(error);
                                    //TODO --> add errormsg div(ERR_CONN_SERVER)
                                }else{
                                    //TODO --> add error msg div(errormsg)
                                }
                           }else{
                                //set the session 
                                localSession.setSessionObject(responseObject.Payload);

                                 //TODO --> change the pushState 'state' and 'title'
                                window.history.pushState({},"",urls.POSTSIGNUPFORM);
                                globalThis.props.setUrlState(urls.POSTSIGNUPFORM);
                                
                                globalThis.props.reRenderRoot();
                           }
                        });
                    } else {
                         //TODO --> add errormsg div (ERR_INPASS_CLI/ERR_PASSMIS_CLI)
                        } 
                } else {
                        if(globalThis.state.isCheckingEmail && globalThis.state.isCheckingUsername){
                            //TODO --> add errormsg div (WAR_CHCKUSEREML_CLI)
                        }else{
                            //TODO --> add errormsg div (ERR_INVUSREML_CLI)
                        }
                    }
            } else {
                //TODO --> add error msg div (ERR_DISINVREQ_CLI)
                console.log(urls.ERR_INVREQ_CLI);
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
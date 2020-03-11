//Dependencies
import React, { Component } from 'react';
import url from 'url';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import cookieManager from '../../Components/cookieManager';
import {urls} from "../../../../lib/constants/dataConstants";
import {ERRORS} from "../../../../lib/constants/dataConstants";
import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';

//TODO --> add phone check functionality

export default class postAuth extends Component{

        constructor(props){
                super(props);
                this.state ={
                      displayForm:false,
                      "isCheckingUsername": false,
                      "validUserName": false,
                      "username": "",
                      "state": ""  
                };
                this.postAuthReq = this.postAuthReq.bind(this);
                this.onSubmitHandler = this.onSubmitHandler.bind(this);
                this.onChangeHandler = this.onChangeHandler.bind(this);
                this.userNameValidator = this.userNameValidator.bind(this);
                this.checkPasswordValidity = this.checkPasswordValidity.bind(this);
        }

        componentDidMount(){
                let authObject = url.parse(window.location.href,true);
                this.setState({state:authObject.query.state},() =>{
                    this.postAuthReq(authObject.query);
                });
        };

        postAuthReq(queryObject){
                let headers = {};
                let globalThis = this;
                httpsMiddleware.httpsRequest("/googleAuth/postAuth", "POST", headers,queryObject, function(error,responseObject) {
                         if(error || responseObject.STATUS != 200){
                             //TODO --> add error msg div
                             //TODO --> use set timeout to display errormsg
                             //return the user to login page
                        }else{
                                if(JSON.stringify(responseObject.PAYLOAD) == JSON.stringify({})){
                                    console.log(globalThis.state.state);
                                    //TODO --> change the pushState 'state' and 'title'
                                     window.history.pushState({},"",urls.POSTAUTH);
                                     globalThis.setState({displayForm:true});            
                                }else{
                                    //set the session 
                                     cookieManager.setUserSessionDetails(responseObject.PAYLOAD.userID);
                                    //TODO --> change the pushState 'state' and 'title'
                                    window.history.pushState({},"",urls.DASHBOARD);
                                }
                        }
                });  
        }

        onSubmitHandler(formObject){
                let headers = {};
                let globalThis = this;
                if (formObject.formData.hasOwnProperty('UserName') && formObject.formData.hasOwnProperty('Phone') && formObject.formData.hasOwnProperty('Password') && formObject.formData.hasOwnProperty('ConfirmPassword')) {
                    var errorMsgObject = globalThis.checkPasswordValidity(formObject.formData.Password, formObject.formData.ConfirmPassword);
                    if (globalThis.state.validUserName) {
                        if(errorMsgObject == ""){
                            delete formObject.formData.confirmPassword;
                            formObject.formData.state = globalThis.state.state;
                            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
                                if(error || responseObject.Status == "ERROR"){
                                    if(error){
                                        console.log(error);
                                        //TODO --> add errormsg div(ERR_CONN_SERVER)
                                    }else{
                                        //TODO --> add error msg div(errormsg)
                                    }
                                }else{
                                    //set the session
                                    cookieManager.setUserSessionDetails(responseObject.PAYLOAD.uniqueID);
                                    //TODO --> change the pushState 'state' and 'title'
                                    window.history.pushState({},"",urls.DASHBOARD);
                                }
                            });
                        } else {
                                //TODO --> add errormsg div (ERR_INPASS_CLI/ERR_PASSMIS_CLI)
                        } 
                    } else {
                        if(globalThis.state.isCheckingUsername){
                            //TODO --> add errormsg div (WAR_CHCKUSER_CLI)
                        }else{
                            //TODO --> add errormsg div (ERR_INVUSR_CLI)
                        }
                    }
                } else {
                        //TODO --> add error msg div (ERR_DISINVREQ_CLI)
                        console.log(urls.ERR_INVREQ_CLI);
                }
        }

        onChangeHandler(formObject){
                var globalThis = this;
                formObject.UserName != this.state.username && this.userNameValidator(formObject.UserName, globalThis);
                this.setState({
                        "username": formObject.UserName
                });
        }

        userNameValidator(userName, globalThis) {
                var userNameCheckQueryString = 'UserName=' + userName;
                var headers = {};
        
                this.setState({
                    "isCheckingUsername": true
                }, () => {
                    httpsMiddleware.httpsRequest('/signup/userAvaliablity', 'GET', headers, userNameCheckQueryString, function(error,responseObject) {
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

        render(){
                let postAuthContainer = this.state.displayForm ? 

                <SimpleForm formAttributes = { formConstants.postAuthForm }
                submitHandler = { this.onSubmitHandler }
                changeHandler = { this.onChangeHandler }
                changeFieldNames = {["UserName","Phone"]}/>  
                : 
                <div>loading wheel goes here</div>

                return (<div>{postAuthContainer}</div>);
        }             
}

//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import url from 'url';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import cookieManager from '../../Components/cookieManager';
import {EMSG,urls} from "../../../../lib/constants/contants";
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';

//TODO --> add phone check functionality

class PostAuth extends Component{

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
            if(authObject.query.hasOwnProperty("state"))
                this.setState({state:authObject.query.state},() =>{
                    this.postAuthReq(authObject.query);
                });
            else
                window.history.pushState({},"",urls.LANDING);
    };

    postAuthReq(queryObject){
            let headers = {};
            let errorObject = {...msgObject};
            let globalThis = this;
            httpsMiddleware.httpsRequest("/googleAuth/postAuth", "POST", headers,queryObject, function(error,responseObject) {
                        if(error || responseObject.STATUS != 200){
                            errorObject.msg = error;
                            errorObject.status = "ERROR";
                            this.props.setMsgState(errorObject);
                            window.history.pushState({},"",urls.LOGIN);
                    }else{
                            if(JSON.stringify(responseObject.PAYLOAD) == JSON.stringify({})){
                                //TODO --> change the pushState 'state' and 'title'
                                window.history.pushState({},"",urls.POSTAUTH);
                                globalThis.setState({displayForm:true});            
                            }else{
                                //set the session 
                                cookieManager.setUserSessionDetails(responseObject.PAYLOAD.uniqueID);
                                //TODO --> change the pushState 'state' and 'title'
                                window.history.pushState({},"",urls.DASHBOARD);
                            }
                    }
            });  
    }

    onSubmitHandler(formObject){
            let headers = {};
            let errorObject = {...msgObject};
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
                                    errorObject.msg = error;
                                    errorObject.status = "ERROR";
                                    globalThis.props.setMsgState(errorObject);
                                }else{
                                    errorObject.msg = responseObject.ERRORMSG;
                                    errorObject.status = "ERROR";
                                    globalThis.props.setMsgState(errorObject);
                                }
                            }else{
                                //set the session
                                cookieManager.setUserSessionDetails(responseObject.PAYLOAD.uniqueID);
                                //TODO --> change the pushState 'state' and 'title'
                                window.history.pushState({},"",urls.DASHBOARD);
                            }
                        });
                    } else {
                            errorObject.msg = "ERR_INPASS_CLI/ERR_PASSMIS_CLI";
                            errorObject.status = "ERROR";
                            globalThis.props.setMsgState(errorObject);
                    } 
                } else {
                    if(globalThis.state.isCheckingUsername){
                        errorObject.msg = "WAR_CHCKUSER_CLI";
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }else{
                        errorObject.msg = "ERR_INVUSR_CLI";
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }
                }
            } else {
                    errorObject.msg = EMSG.CLI_MID_INVMET;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
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
        let errorObject = {...msgObject};
        var headers = {};
        this.setState({
            "isCheckingUsername": true
        }, () => {
            httpsMiddleware.httpsRequest('/signup/userAvaliablity', 'GET', headers, userNameCheckQueryString, function(error,responseObject) {
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    if (responseObject.Status == "ERROR") {
                        errorObject.msg = responseObject.ERRORMSG;
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

const mapDispatchToProps = dispatch => {
    return {
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(null,mapDispatchToProps)(PostAuth);
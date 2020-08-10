//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import url from 'url';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import cookieManager from '../../Components/cookieManager';
import Modal from 'react-modal';
import {EMSG,urls} from "../../../../lib/constants/contants";
import setMsgAction from '../../store/actions/msgActions';
import ProfilePicture from "../generalContainers/profilePictureGen";
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
                    "state": "",
                    "photo": "",
                    "displayPhotoSel" : false  
            };
            this.postAuthReq = this.postAuthReq.bind(this);
            this.onSubmitHandler = this.onSubmitHandler.bind(this);
            this.changeProfilePic = this.changeProfilePic.bind(this);
            this.onChangeHandler = this.onChangeHandler.bind(this);
            this.showPhotoSelector = this.showPhotoSelector.bind(this);
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

    userNameValidator(userName, globalThis) {
        var userNameCheckQueryString = 'UserName=' + userName;
        let errorObject = {...msgObject};
        var headers = {};
        this.setState({
            "isCheckingUsername": true
        }, () => {
            httpsMiddleware.httpsRequest('/signup/userAvaliablity', 'GET', headers, userNameCheckQueryString,function(error,responseObject) {
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

    changeProfilePic(event){
        this.setState({'photo': event.target.src, displayPhotoSel : !this.state.displayPhotoSel});
    }

    onChangeHandler(formObject){
            var globalThis = this;
            formObject.UserName != this.state.username && this.userNameValidator(formObject.UserName, globalThis);
            this.setState({
                    "username": formObject.UserName
            });
    }
    
    showPhotoSelector(){
        this.setState({displayPhotoSel : !this.state.displayPhotoSel});
    }

    postAuthReq(queryObject){
        let headers = {};
        let errorObject = {...msgObject};
        let globalThis = this;
        httpsMiddleware.httpsRequest("/googleAuth/postAuth", "POST", headers,queryObject,{},function(error,responseObject) {
            if(error || responseObject.STATUS != 200){
                errorObject.msg = error;
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
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
                    formObject.formData.ProfilePhoto = this.state.photo;
                    httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData,function(error,responseObject) {
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
                            globalThis.setState({displayForm:false});
                            //set the session
                            cookieManager.setUserSessionDetails(responseObject.PAYLOAD.cookieDetails);
                            //TODO --> change the pushState 'state' and 'title'
                            window.history.pushState({},"",urls.DASHBOARD);
                        }
                    });
                } else {
                        errorObject.msg = EMSG.CLI_SGN_PASSMIS;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                } 
            } else {
                if(globalThis.state.isCheckingUsername){
                    errorObject.msg = EMSG.CLI_SGN_CHKUSR;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = EMSG.CLI_SGN_INUSR;
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

    render(){
            let buttonInner = this.state.photo == "" ? <div>+</div> : <img src={this.state.photo} width = "200" height = "200"/>;
            return (<div>   
                        <Modal
                        isOpen={this.state.displayForm}
                        contentLabel="">
                            <button onClick = {() => { this.setState({displayForm : false})}}>X</button>
                            <button onClick ={this.showPhotoSelector}>{buttonInner}</button>
                            {this.state.displayPhotoSel && <ProfilePicture selectProfilePic = {this.changeProfilePic} cancelHandler = {this.showPhotoSelector}/>}
                            <SimpleForm formAttributes = { formConstants.postAuthForm }
                            submitHandler = { this.onSubmitHandler }
                            changeHandler = { this.onChangeHandler }
                            changeFieldNames = {["UserName","Phone"]}/> 
                        </Modal>
                        <div>loading wheel goes here</div>
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

export default connect(null,mapDispatchToProps)(PostAuth);
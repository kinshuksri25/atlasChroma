//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import cookieManager from '../../Components/cookieManager';
import ProfilePicture from "../generalContainers/profilePictureGen";
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
import {EMSG,urls} from "../../../../lib/constants/contants";


class Profile extends Component{
    
    constructor(props){
        super(props);
        this.state ={
            firstName : this.props.user.firstname,
            photo : this.props.user.photo,
            lastName : this.props.user.lastname,
            userName : this.props.user.username,
            email : this.props.user.email,
            phonenumber : this.props.user.phonenumber,
            password : "",
            confirmPassword : "",
            displayPhotoSel : false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.showPhotoSelector = this.showPhotoSelector.bind(this);
        this.changeProfilePic = this.changeProfilePic.bind(this);
        this.onDeleteHandler = this.onDeleteHandler.bind(this);
        this.checkPasswordValidity = this.checkPasswordValidity.bind(this);
    }

    onChangeHandler (event){
        switch(event.target.className){
            case "firstName" : 
                this.setState({firstName : event.target.value});
                break;
            case "lastName" :
                this.setState({lastName : event.target.value});
                break;    
            case "password" :
                this.setState({password : event.target.value});                
                break;
            case "confirmPassword" : 
                this.setState({confirmPassword : event.target.value});
            case "phonenumber":                
                this.setState({phonenumber : event.target.value});
                break;    
        }
    }

    showPhotoSelector(){
        this.setState({displayPhotoSel : !this.state.displayPhotoSel});
    }

    onSubmitHandler (event){
        event.preventDefault();
        let globalThis = this;
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let errorObject = {...msgObject};
        let passwordValid = this.checkPasswordValidity() == "" || 
                                (this.state.password == "" && this.state.confirmPassword == "") ? true : false;
        if(passwordValid){

            let userObject = {};
            userObject.username = this.state.userName;
            userObject.email = this.state.email;
            if(this.state.password != ""){
                userObject.password = this.state.password;
            }if(this.state.firstName != this.props.user.firstname){
                userObject.firstname = this.state.firstname;
            }if(this.state.lastName != this.props.user.lastname){
                userObject.lastname = this.state.lastName;
            }if(this.state.phonenumber != this.props.user.phonenumber){
                userObject.phonenumber = this.state.phonenumber;
            }if(this.state.photo != this.props.user.photo){
                userObject.photo = this.state.photo;
            }

            httpsMiddleware.httpsRequest("/user",'PUT',headers,{...userObject},{},function(error,responseObject){
                if(responseObject.STATUS != 200 || error){
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
                    let user = {...globalThis.props.user};
                    if(userObject.hasOwnProperty("firstname")){
                        user.firstName = this.state.firstName;
                    }if(userObject.hasOwnProperty("lastname")){
                        user.lastname = this.state.lastName;
                    }if(userObject.hasOwnProperty("phonenumber")){
                        user.phonenumber = this.state.lastName;
                    }if(userObject.hasOwnProperty("photo")){
                        user.photo = this.state.photo;
                    }
                    globalThis.props.setUserState({...user});
                }
            });

        }else{
            errorObject.msg = this.checkPasswordValidity();
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);
        }
    }

    onDeleteHandler (){
        let projectNames = [];
        let projectIDs = [];
        let errorObject = {...msgObject};
        this.props.user.projects.map(project => {
            project.projectlead == this.props.user.username && projectNames.push(project.title);
            project.contributors.indexOf(this.state.userName) >= 0 && projectIDs.push(project._id);
        });
        if(projectNames.length == 0){
            let globalThis = this;
            let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
            let userQuery = "username="+this.props.user.username;
            httpsMiddleware.httpsRequest("/user", "DELETE", headers,userQuery,{"projectIDs" : [...projectIDs],email : this.state.email},function(error,responseObject) {
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
                    cookieManager.clearUserSession();
                    window.history.replaceState({}, "",urls.LANDING);
                }
            });
        }else{
            errorObject.msg = "You the project lead for some projects, please remove yourself from them befre deleting the account";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);
        }
    }

    changeProfilePic(event){
        this.setState({'photo': event.target.src, displayPhotoSel : !this.state.displayPhotoSel});
    }

    checkPasswordValidity(){
        var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!regex.test(this.state.password)) {
            return EMSG.CLI_SGN_INPASS;
        }
        if (this.state.password != this.state.confirmPassword) {
            return EMSG.CLI_SGN_PASSMIS;
        }
        return "";
    }
    
    render(){
        let buttonInner = this.state.photo == "" ? <div>+</div> : <img src={this.state.photo} width = "200" height = "200"/>;
        let disabledUpdate = this.state.firstName != this.props.user.firstname || this.state.lastName != this.props.user.lastname || 
                                this.state.photo != this.props.user.photo || this.state.phonenumber != this.props.user.phonenumber || 
                                this.state.password != "" && (this.state.confirmPassword != "" && this.state.firstName != "" && this.state.lastName != "" && 
                                        this.state.phonenumber != 0 && this.state.phonenumber != "") ? false : true;
        return (<div>
                    <button onClick ={this.showPhotoSelector}>{buttonInner}</button>
                    {this.state.displayPhotoSel && <ProfilePicture selectProfilePic = {this.changeProfilePic} cancelHandler = {this.showPhotoSelector}/>}
                    <form onSubmit={this.onSubmitHandler}>
                        <input type = "text" onChange={this.onChangeHandler} value = {this.state.firstName} className = "firstName"/>
                        <input type = "text" onChange={this.onChangeHandler} value = {this.state.lastName} className = "lastName"/>
                        <input type = "text" value = {this.state.userName} className = "userName" disabled/>
                        <input type = "text" value = {this.state.email} className = "email" disabled/>
                        <input type = "number" onChange={this.onChangeHandler} value = {this.state.phonenumber} className = "phonenumber"/>
                        <input type = "text" onChange={this.onChangeHandler} value = {this.state.password} className = "password"/>
                        <input type = "text" onChange={this.onChangeHandler} value = {this.state.confirmPassword} className = "confirmPassword"/>
                        <button className = "updateButton" disabled = {disabledUpdate} >Update</button>
                    </form>
                    <button className = "deleteButton" onClick={this.onDeleteHandler}>Delete Account</button>
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Profile); 

//Dependencies
import React, { Component } from 'react';

import SimpleForm from '../../Forms/simpleform';
import cookieManager from '../../Components/cookieManager';
import formConstants from '../../Forms/formConstants';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import {urls} from "../../../../lib/constants/contants";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "loginForm": ""
        };
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onSubmitHandler(formObject) {
        let headers = {};
        let globalThis = this;
        formObject.formData = formObject.route == "/login" ? formObject.formData : "Email="+formObject.formData.Email;
        httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
            if(responseObject.ERRORMSG != "" || error){
                if(error){
                    console.log(error);
                    //TODO --> errormsg div(ERR_CONN_SERVER)
                }else{
                    //TODO --> errormsg div(errorMsg)
                }
            }else{
                if(formObject.route == "/login"){
                    if(responseObject.PAYLOAD.hasOwnProperty("uniqueID")){
                        localStorage.uniqueID = responseObject.PAYLOAD.uniqueID;
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.POSTSIGNUPFORM);   
                    }else{
                        //set the session
                        cookieManager.setUserSessionDetails(responseObject.PAYLOAD.uniqueID);
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.DASHBOARD);
                    }
                }else{
                    if(JSON.stringify(responseObject.Payload) == JSON.stringify({})){
                        //TODO --> errormsg div(ERR_GGLCONN_CLI)    
                    }else{
                        window.location = responseObject.PAYLOAD.authURL;
                    }
                }
            }   
        });
    }

    onClickHandler(event) {
            event.target.id == "login" && this.setState({
                        "loginForm": <SimpleForm formAttributes = { formConstants.login }
                        submitHandler = { this.onSubmitHandler }
                        changeFieldNames = {[]}/>});

            event.target.id == "googleLogin" && this.setState({
                                "loginForm": <SimpleForm formAttributes = { formConstants.googleLogin }
                                submitHandler = { this.onSubmitHandler }
                                changeFieldNames = {[]}/>});
    }

    render() {
            return ( <div>
                        <button id = "login"onClick = { this.onClickHandler } > Login </button> 
                        <button id = "googleLogin"onClick = { this.onClickHandler } > Login with Google </button> 
                        { this.state.loginForm }  
                    </div>);
    }
}

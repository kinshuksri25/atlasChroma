//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import "../../StyleSheets/login.css";
import SimpleForm from '../../Forms/simpleform';
import cookieManager from '../../Components/cookieManager';
import formConstants from '../../Forms/formConstants';
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import {urls} from "../../../../lib/constants/contants";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "loginForm": ""                      
        };
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    componentDidMount(){
        this.setState({
            "loginForm" : <SimpleForm formAttributes = { formConstants.login }
            submitHandler = { this.onSubmitHandler }
            changeFieldNames = {[]}/>  
        });
    }

    onSubmitHandler(formObject) {
        let headers = {};
        let errorObject = {...msgObject};
        let gmailPatternError = "";
        let globalThis = this;
        if(formObject.route != "/login"){
            // let gmailRegex = new RegExp("/\S+@gmail+\.com+/");
            // gmailPatternError = gmailRegex.test(formObject.formData.Email) ? "" : "invalid email";
            // if(gmailPatternError == "")
                    formObject.formData = "Email="+formObject.formData.Email;
        }
        if(gmailPatternError == ""){ 
          httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData,{},function(error,responseObject) {
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
                if(formObject.route == "/login"){
                    if(responseObject.PAYLOAD.hasOwnProperty("uniqueID")){
                        localStorage.uniqueID = responseObject.PAYLOAD.uniqueID;
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.POSTSIGNUPFORM);   
                    }else{
                        //set the session
                        cookieManager.setUserSessionDetails(responseObject.PAYLOAD.userID);
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.DASHBOARD);
                    }
                }else{
                    if(JSON.stringify(responseObject.Payload) == JSON.stringify({})){
                        errorObject.msg = "Unable to connect to google servers";
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);  
                    }else{
                        window.location = responseObject.PAYLOAD.authURL;
                    }
                }
            }   
        });
        }else{
            errorObject.msg = "Invalid Email ID";
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
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
            return (<div className="loginPageContainer">
                        <h1 className="loginTitle">Login using your credentials, or just use google!</h1>
                        <div className="loginContainer">
                            <div className="loginButtonsContainer">
                                <button id = "login" onClick = { this.onClickHandler } > Login </button> 
                                <button id = "googleLogin" onClick = { this.onClickHandler } > Login with Google </button> 
                            </div>
                            { this.state.loginForm }  
                        </div>
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

export default connect(null,mapDispatchToProps)(Login);

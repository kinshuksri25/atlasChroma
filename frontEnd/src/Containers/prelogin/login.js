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

class Login extends Component {

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
            if(error || responseObject.Status == "ERROR"){
                if(error){
                    console.log(error);
                    //TODO --> errormsg div(ERR_CONN_SERVER)
                }else{
                    //TODO --> errormsg div(errorMsg)
                }
             }else{
                if(formObject.route == "/login"){
                    if(typeof(responseObject.Payload) != Object){
                        localStorage.uniqueID = responseObject.Payload;
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.POSTSIGNUPFORM);
                        globalThis.props.setUrlState(urls.POSTSIGNUPFORM);    
                    }else{
                        //set the session
                        localSession.setSessionObject(responseObject.Payload);
                        //TODO --> change the pushState 'state' and 'title'
                        window.history.pushState({},"",urls.DASHBOARD);
                        globalThis.props.setUrlState(urls.DASHBOARD);
                    }
                    
                    globalThis.props.reRenderRoot();
                }else{
                    if(responseObject.Payload == ""){
                        //TODO --> errormsg div(ERR_GGLCONN_CLI)    
                    }else{
                        window.location = responseObject.Payload;
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

const mapDispatchToProps = dispatch => {
    return {
        setUrlState: (url) => {
            dispatch(setUrlAction(url));
        }
    };
};

export default connect(null, mapDispatchToProps)(Login);
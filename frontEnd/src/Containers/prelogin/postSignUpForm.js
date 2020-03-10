import React, { Component } from 'react';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import {urls} from "../../../../lib/constants/dataConstants";
import {ERRORS} from "../../../../lib/constants/dataConstants";
import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';

export default class PostSignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            "ID": ""
        };
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    } 

    componentDidMount() {
        let id = localStorage.uniqueID;
        let sessionExists = id == 'undefined' ? false : true;
        if (!sessionExists) {
            window.history.pushState({},"",urls.LANDING);
        }else{
            this.setState({ID:id});
        }
    }

    onSubmitHandler(formObject){
        let headers = {};
        let globalThis = this;
        if (formObject.formData.hasOwnProperty('FirstName') && formObject.formData.hasOwnProperty('LastName') && formObject.formData.hasOwnProperty('Phone')) {
            formObject.formData.id = this.state.ID;
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
            if(error || responseObject.Status == "ERROR"){
                if(error){
                    console.log(error);
                    //TODO --> add errormsg div(ERR_CONN_SERVER)
                }else{
                    //TODO --> add error msg div(errormsg)
                }
            }else{
                localSession.clearSession();
                //set the session
                
                //TODO --> change the pushState 'state' and 'title'
                window.history.pushState({},"",urls.DASHBOARD);
            }
        });
        } else {
                //TODO --> add error msg div (ERR_DISINVREQ_CLI)
                console.log(urls.ERR_INVREQ_CLI);
        }
    }

    onChangeHandler(formObject){
    };


    render() {
        return (<div>
                    <SimpleForm formAttributes = { formConstants.postSignup }
                    submitHandler = { this.onSubmitHandler }
                    changeHandler = { this.onChangeHandler }
                    changeFieldNames = {["Phone"]}/>  
                </div>);
    }
}
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import localSession from '../../Components/sessionComponent';
import {urls} from "../../../../lib/constants/dataConstants";
import {ERRORS} from "../../../../lib/constants/dataConstants";
import setUrlAction from "../../store/actions/urlActions";
import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';

class PostSignUpForm extends Component {
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
        let sessionExists = id != undefined ? true : false;
        if (!sessionExists) {
            window.history.pushState({},"",urls.LANDING);
            this.props.setUrlState(urls.LANDING);              
            this.props.reRenderRoot();
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
                localSession.setSessionObject(responseObject.Payload);
                //TODO --> change the pushState 'state' and 'title'
                window.history.pushState({},"",urls.DASHBOARD);
                globalThis.props.setUrlState(urls.DASHBOARD);
                                                
                globalThis.props.reRenderRoot();
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

const mapDispatchToProps = dispatch => {
    return {
        setUrlState: (url) => {
            dispatch(setUrlAction(url));
        }
    };
};

export default connect(null, mapDispatchToProps)(PostSignUpForm);
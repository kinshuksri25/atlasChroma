import React, { Component } from 'react';
import { connect } from 'react-redux';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import {EMSG,urls} from "../../../../lib/constants/contants";
import SimpleForm from '../../Forms/simpleform';
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
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
        let sessionExists = id == undefined ? false : true;
        if (!sessionExists) {
            window.history.pushState({},"",urls.LANDING);
        }else{
            this.setState({ID:id});
        }
    }

    onSubmitHandler(formObject){
        let headers = {};
        let errorObject = {...msgObject};
        let globalThis = this;
        if (formObject.formData.hasOwnProperty('FirstName') && formObject.formData.hasOwnProperty('LastName') && formObject.formData.hasOwnProperty('Phone')) {
            formObject.formData.id = this.state.ID;
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
                    localStorage.clear();
                    //TODO --> change the pushState 'state' and 'title'
                    window.history.pushState({},"",urls.DASHBOARD);
                }
            });
        } else {
                errorObject.msg = EMSG.CLI_MID_INVMET;
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
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
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(null,mapDispatchToProps)(PostSignUpForm);
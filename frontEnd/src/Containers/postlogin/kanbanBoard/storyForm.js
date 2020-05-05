//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import setUserAction from '../../../store/actions/userActions';
import cookieManager from '../../../Components/cookieManager';
import SimpleForm from '../../../Forms/simpleform';
import setMsgAction from '../../../store/actions/msgActions';
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import formConstants from '../../../Forms/formConstants';

class StoryForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            priorityList : ["StoryPriority","Urgent","High","Medium","Low","OnHold"],
            contributorList : ["Contributors",...this.props.projectDetails.contributors],
            currentMode: this.props.currentMode,
        };
        this.onStoryAddHandler = this.onStoryAddHandler.bind(this);
    }

    onStoryAddHandler(formObject){
        let globalThis = this;
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        if(formObject.formData.Priority != "" && formObject.formData.Contributor != ""){
            let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
            formObject.formData.currentStatus = this.props.projectDetails.templatedetails[0]._id;
            formObject.formData.projectID = projectID;
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
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
                    let updatedUser = {...globalThis.props.user};
                    for(let i = 0;i < updatedUser.projects.length;i++){
                        if(updatedUser.projects[i]._id == projectID){
                            updatedUser.projects[i].storydetails.push({...responseObject.PAYLOAD});
                        }
                    }
                    globalThis.props.setUserState(updatedUser);
                }
            });
        }else{
            errorObject.msg = "priority or contributors is empty";
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
    }

    render(){
        let storyFormJSX = this.props.currentMode == "ADD" ? <SimpleForm formAttributes = { formConstants.storyForm }
                                                                submitHandler = { this.onStoryAddHandler }
                                                                options = {[this.state.contributorList,this.state.priorityList]}
                                                                changeFieldNames = {[]}/>  : "";
        return (<div> {storyFormJSX} </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
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

export default connect(mapStateToProps,mapDispatchToProps)(StoryForm); 
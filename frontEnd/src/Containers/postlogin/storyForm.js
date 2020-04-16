//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import {urls} from '../../../../lib/constants/contants';
import setUserAction from '../../store/actions/userActions';
import cookieManager from '../../Components/cookieManager';
import SimpleForm from '../../Forms/simpleform';
import setProjectAction from '../../store/actions/projectActions';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import formConstants from '../../Forms/formConstants';

class StoryForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            storyForm : "",
            priorityList : ["StoryPriority","Urgent","High","Medium","Low","OnHold"],
            contributorList : ["Contributors",...this.props.projectDetails.currentProject.contributors],
            currentMode: this.props.currentMode,
        };
        this.buildAddStoryForm = this.buildAddStoryForm.bind(this);
        this.onStoryAddHandler = this.onStoryAddHandler.bind(this);
    }

    componentDidMount(){
        if(this.state.currentMode == "ADD"){
            this.buildAddStoryForm();
        }else if(currentMode == "EDIT"){

        }
    }

    buildAddStoryForm(){
        this.setState({
            storyForm : <SimpleForm formAttributes = { formConstants.storyForm }
                        submitHandler = { this.onStoryAddHandler }
                        options = {[this.state.contributorList,this.state.priorityList]}
                        changeFieldNames = {[]}/> 
        });
    }

    //this is a serious issue currentproject redux store is getting updated automatically this is not supposed to happen
    onStoryAddHandler(formObject){
        let globalThis = this;
        if(formObject.formData.Priority != "" && formObject.formData.Contributor != ""){
            let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
            formObject.formData.currentStatus = this.props.projectDetails.currentProject.boarddetails.templatedetails[0]._id;
            console.log(this.props.projectDetails.currentProject.boarddetails.templatedetails[0]._id);
            formObject.formData.projectID = this.props.projectDetails.currentProject._id;
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData, function(error,responseObject) {
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                    if(error){
                        console.log(error);
                        //TODO --> errormsg div(ERR_CONN_SERVER)
                    }else{
                        //TODO --> errormsg div(errorMsg)
                    }
                }else{
                    let updatedUser = {...globalThis.props.user};
                    for(let i = 0;i < updatedUser.projects.length;i++){
                        if(updatedUser.projects[i]._id == globalThis.props.projectDetails.currentProject._id){
                            updatedUser.projects[i].storydetails.push({...responseObject.PAYLOAD});
                        }
                    }
                    globalThis.props.setUserState(updatedUser);
                }
            });
        }else{
            //priority or contributors is empty
        }
    }

    render(){
        return (<div> {this.state.storyForm} </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer,
        projectDetails: state.projectStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(StoryForm); 
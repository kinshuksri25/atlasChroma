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

//end date can also be edited
class StoryForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            priorityList : ["StoryPriority","Urgent","High","Medium","Low","OnHold"],
            contributorList : ["Contributors",...this.props.projectDetails.contributors],
            currentMode: this.props.currentMode,
            storyTitle : "",
            storyDescription : "",
            storyComments : "",
            storyContributor : "",
            storyPriority : "",
            oldStoryDetails : {}
        };
        this.onStoryAddHandler = this.onStoryAddHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.updateFormhandler = this.updateFormhandler.bind(this);
    }

    componentDidMount(){
        if(this.state.currentMode != "ADD"){
            this.props.projectDetails.storydetails.map(story => {
                if(this.props.storyID == story._id){
                    this.setState({
                        oldStoryDetails : {...story},
                        storyTitle : story.storytitle,
                        storyDescription : story.description,
                        storyComments : story.comments,
                        storyContributor : story.contributor,
                        storyPriority : story.priority
                    });
                }
            });
        }
    }

    onChangeHandler(event){
        switch(event.target.className){
            case "storyTitle":
                this.setState({storyTitle : event.target.value});
                break;
            case "storyDescription":
                this.setState({storyDescription : event.target.value});
                break;
            case "comments":
                this.setState({storyComments : event.target.value});
                break;
            case "priority":
                this.setState({storyPriority : event.target.value});
                break;
            case "contributor":
                this.setState({storyContributor : event.target.value});
                break;        
        }
    }

    updateFormhandler(){

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
        let disableUpdate = this.state.currentMode == "ADD" ? true : this.state.storyTitle != this.state.oldStoryDetails.storytitle || 
                                                                        this.state.storyDescription != this.state.oldStoryDetails.description ||
                                                                            this.state.storyComments != this.state.oldStoryDetails.comments ||
                                                                                this.state.storyContributor != this.state.oldStoryDetails.contributor ||
                                                                                    this.state.storyPriority != this.state.oldStoryDetails.priority ? false : true;                                                                                 
                                                                                
        let storyFormJSX = this.props.currentMode == "ADD" ? <SimpleForm formAttributes = { formConstants.storyForm }
                                                            submitHandler = { this.onStoryAddHandler }
                                                            options = {[this.state.contributorList,this.state.priorityList]}
                                                            changeFieldNames = {[]}/>
                                                                : <div>
                                                                    <input type ="text" value = {this.state.storyTitle} className = "storyTitle" onChange = {this.onChangeHandler}/>
                                                                    <input type ="textarea" rows = "5" cols = "20" value = {this.state.storyDescription} className = "storyDescription" onChange = {this.onChangeHandler}/>
                                                                    <input type = "textarea" rows = "5" cols = "20" value = {this.state.storyComments} className = "comments" onChange = {this.onChangeHandler}/>
                                                                    <select className = "priority" onChange = {this.onChangeHandler}>
                                                                        {
                                                                            this.state.priorityList.map(priority => {
                                                                                if(this.state.storyPriority == priority)
                                                                                    return (<option value = { priority } selected>{priority}</option>);
                                                                                else
                                                                                return (<option value = { priority }>{priority}</option>);
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <select className = "contributor" onChange = {this.onChangeHandler}>
                                                                        {
                                                                            this.state.contributorList.map(contributor => {
                                                                                if(this.state.storyContributor == contributor)
                                                                                return (<option value = { contributor } selected>{contributor}</option>);
                                                                            else
                                                                            return (<option value = { contributor }>{contributor}</option>);
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <button disabled = {disableUpdate} onClick = {this.updateFormhandler}>Update</button>
                                                                  </div>;
        return (<div> 
                    {storyFormJSX}
                    <button onClick = {this.props.closeForm}>Back</button>
                </div>);
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
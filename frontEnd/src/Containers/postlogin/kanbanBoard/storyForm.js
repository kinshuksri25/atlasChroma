//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import setUserAction from '../../../store/actions/userActions';
import cookieManager from '../../../Components/cookieManager'
import setMsgAction from '../../../store/actions/msgActions';
import httpsMiddleware from '../../../middleware/httpsMiddleware';

class StoryForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            priorityList : ["StoryPriority","Urgent","High","Medium","Low","OnHold"],
            contributorList : ["Contributors",...this.props.projectDetails.contributors],
            currentMode: this.props.currentMode,
            currentStatus: "",
            storyTitle : "",
            storyDescription : "",
            storyComments : "",
            duedate : "",
            storyContributor : "",
            storyPriority : "",
            columnArray : [],
            oldStoryDetails : {}
        };
        this.onStoryAddHandler = this.onStoryAddHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.generateColumnArray = this.generateColumnArray.bind(this);
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
                        duedate : story.duedate, 
                        storyContributor : story.contributor,
                        storyPriority : story.priority
                    });
                }
            });
        }else{
            this.state.columnArray.length==0 && this.setState({columnArray : [...this.generateColumnArray()]});
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
            case "duedate":
                this.setState({duedate : event.target.value});
                break;    
            case "contributor":
                this.setState({storyContributor : event.target.value});
                break;
            case "selectPhase":
                this.setState({currentStatus : event.target.value});
                break;        
        }
    }

    updateFormhandler(){
        let globalThis = this;
        let storyObject = {};
        let errorObject = {};
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()}
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        if(this.state.storyTitle != this.state.oldStoryDetails.storytitle){
            storyObject.StoryTitle = this.state.storyTitle;
        }if(this.state.storyDescription != this.state.oldStoryDetails.description){
            storyObject.Description = this.state.storyDescription;
        }if(this.state.storyComments != this.state.oldStoryDetails.comments){
            storyObject.Comments = this.state.storyComments;
        }if(this.state.storyContributor != this.state.oldStoryDetails.contributor){
            storyObject.Contributor = this.state.storyContributor;
        }if(this.state.storyPriority != this.state.oldStoryDetails.priority){
            storyObject.Priority = this.state.storyPriority;
        }if(this.state.duedate != this.state.oldStoryDetails.duedate){
            storyObject.DueDate = this.state.oldStoryDetails.duedate;
        }
        storyObject._id = this.props.storyID;
        httpsMiddleware.httpsRequest("/stories","PUT", headers,{storyDetails : {...storyObject},contributorUsername : this.state.storyContributor},{},function(error,responseObject) {
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
                updatedUser.projects.map(project => {
                    if(project._id == projectID){
                        project.storydetails.map(story => {
                            if(story._id == globalThis.props.storyID){
                                story.storytitle = globalThis.state.storyTitle;
                                story.description = globalThis.state.storyDescription;
                                story.comments = globalThis.state.storyComments;
                                story.duedate = globalThis.state.duedate;
                                story.contributor = globalThis.state.storyContributor;
                                story.priority = globalThis.state.storyPriority;
                            }
                        });
                    }
                });
                globalThis.props.setUserState(updatedUser);
                globalThis.props.closeForm();
            }
        });  
    }

    onStoryAddHandler(){
        let globalThis = this;
        let errorObject = {};

        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+(new Date().getMonth()+1) : (new Date().getMonth()+1);
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+new Date().getDate();
        if(this.state.storyTitle != "" && this.state.storyDescription != "" && 
            this.state.storyContributor != "" && this.state.duedate > currentDate && this.state.storyPriority != "" &&
                this.state.currentStatus != "" && this.state.storyComments != ""){

            let formData = {
                "StoryTitle" : this.state.storyTitle,
                "Description" : this.state.storyDescription,
                "Contributor" : this.state.storyContributor,
                "Priority" : this.state.storyPriority,
                "EndDate" : this.state.duedate,
                "currentStatus" : this.state.currentStatus,
                "Comments" : this.state.storyComments,
                "projectID" : this.props.projectDetails._id
            };

            let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
            httpsMiddleware.httpsRequest("/stories","POST", headers, {...formData},{},function(error,responseObject) {
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
                        if(updatedUser.projects[i]._id == globalThis.props.projectDetails._id){
                            updatedUser.projects[i].storydetails.push({...responseObject.PAYLOAD});
                        }
                    }
                    globalThis.props.setUserState(updatedUser);
                    globalThis.props.closeForm();
                }
            });
        }else{
            if(this.state.duedate < currentDate){
                errorObject.msg = "End Date cannot be less than Current Date";
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }else{
                errorObject.msg = "story details empty";
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }
        }
    }

    generateColumnArray(){
        let templates = [...this.props.projectDetails.templatedetails];
        let columnsArray = templates.map(template => {
            let column = {
                "NAME" : template.EXTENDS != "" ? template.EXTENDS +"->"+template.NAME : template.NAME,
                "ID" : template._id,
                "hasChildren": template.CHILDREN.length > 0 ? true : false
            }
            return ({...column});
        });
        return columnsArray;
    }

    render(){
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+(new Date().getMonth()+1) : (new Date().getMonth()+1);
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+new Date().getDate();
        let disableUpdate = this.state.currentMode == "ADD" ? true : (this.state.storyTitle != this.state.oldStoryDetails.storytitle || 
                                                                        this.state.storyDescription != this.state.oldStoryDetails.description || 
                                                                            this.state.storyComments != this.state.oldStoryDetails.comments || 
                                                                                this.state.storyContributor != this.state.oldStoryDetails.contributor || 
                                                                                    this.state.duedate != this.state.oldStoryDetails.duedate ||
                                                                                        this.state.storyPriority != this.state.oldStoryDetails.priority) && (this.state.storyTitle != "" && 
                                                                                            this.state.storyDescription != "" && this.state.storyComments != "" && 
                                                                                                this.state.storyContributor != "Contributors" && this.state.duedate != "" && 
                                                                                                    this.state.duedate >= currentDate && this.state.storyPriority != "StoryPriority") ? false : true;                                                                                 
                                                                                
        let storyFormJSX =  <div>
                                <input type ="text" value = {this.state.storyTitle} className = "storyTitle" onChange = {this.onChangeHandler}/>
                                <input type ="textarea" rows = "5" cols = "20" value = {this.state.storyDescription} className = "storyDescription" onChange = {this.onChangeHandler}/>
                                <input type = "textarea" rows = "5" cols = "20" value = {this.state.storyComments} className = "comments" onChange = {this.onChangeHandler}/>
                                <input type ="date" value = {this.state.duedate} className = "duedate" onChange = {this.onChangeHandler}/>
                                <select className = "priority" onChange = {this.onChangeHandler}>
                                    {
                                        this.state.priorityList.map(priority => {
                                            if(this.state.storyPriority == priority  && this.props.currentMode != "ADD")
                                                return (<option value = { priority } selected>{priority}</option>);
                                            else
                                                return (<option value = { priority }>{priority}</option>);
                                        })
                                    }
                                </select>
                                <select className = "contributor" onChange = {this.onChangeHandler}>
                                    {
                                        this.state.contributorList.map(contributor => {
                                            if(this.state.storyContributor == contributor && this.props.currentMode != "ADD")
                                                return (<option value = { contributor } selected>{contributor}</option>);
                                            else
                                                return (<option value = { contributor }>{contributor}</option>);
                                        })
                                    }
                                </select>
                                <select className = "selectPhase" onChange = {this.onChangeHandler} hidden = {this.props.currentMode != "ADD"}>
                                    <option value = "" selected>Select Phase</option>
                                    {
                                        this.state.columnArray.map(column => {
                                            if(!column.hasChildren){
                                                return(<option value = { column.ID }>{column.NAME}</option>);
                                            }
                                        })
                                    }
                                </select>
                                <button hidden = {this.props.currentMode == "ADD"} disabled = {disableUpdate} onClick = {this.updateFormhandler}>Update</button>
                                <button hidden = {this.props.currentMode != "ADD"} onClick = {this.onStoryAddHandler}>Add</button>
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
//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import url from 'url';

import httpsMiddleware from '../../../middleware/httpsMiddleware';
import setMsgAction from '../../../store/actions/msgActions';
import Modal from 'react-modal';
import {urls,EMSG} from '../../../../../lib/constants/contants';
import cookieManager from '../../../Components/cookieManager';
import DateHelper from '../../generalContainers/date';

class Story extends Component{
    constructor(props){
        super(props);
        this.state = {
                        priorityList : ["StoryPriority","Urgent","High","Medium","Low","OnHold"],
                        contributorList : [],
                        columnPosition : "",
                        hover : false,
                        isOpen : false,
                        oldStoryDetails : {...this.props.storyDetails},
                        storyTitle : "",
                        storyDescription : "",
                        storyComments : "",
                        duedate : "",
                        columnArray : [],
                        storyContributor : "",
                        storyPriority : "",
                     };
                          
        this.moveStory = this.moveStory.bind(this);
        this.editStory = this.editStory.bind(this);
        this.findPhoto = this.findPhoto.bind(this);
        this.closeStoryModel = this.closeStoryModel.bind(this);
        this.deleteStory = this.deleteStory.bind(this);
        this.updateFormhandler = this.updateFormhandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);   
        this.currentProject = this.currentProject.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.generateColumnArray = this.generateColumnArray.bind(this); 
        this.checkMovementValidity = this.checkMovementValidity.bind(this);
    }

    componentDidMount(){
        let storyID = url.parse(window.location.href,true).query.storyID;
        if(storyID != undefined && storyID == this.props.storyDetails._id){
            window.history.pushState({}, "",this.currentProject()._id+"?storyID="+storyID);
            this.setState({isOpen : true,
                            contributorList : ["Contributors",...this.currentProject().contributors],
                            oldStoryDetails : {...this.props.storyDetails},
                            storyTitle : this.props.storyDetails.storytitle,
                            storyDescription : this.props.storyDetails.description,
                            storyComments : this.props.storyDetails.comments,
                            duedate : this.props.storyDetails.duedate, 
                            storyContributor : this.props.storyDetails.contributor,
                            storyPriority : this.props.storyDetails.priority,   
                            contributorPhoto: photo
                        });
        }
        let columnPostion = 0;
        let columns = this.generateColumnArray();
        for(let i =0;i<columns.length;i++){
            if(this.props.storyDetails.currentstatus == columns[i]._id){
                columnPostion = i;
                break;
            }
        }
        this.setState({columnPosition:columnPostion});                      
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
                if(event.target.value >= this.props.currentProject.duedate){
                    errorObject.msg = "Invalid date selected";
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);
                }else{
                    this.setState({duedate : event.target.value});
                }
                break;    
            case "contributor":
                this.setState({storyContributor : event.target.value});
                break;      
        }
    }

    currentProject(){
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let projectObject = {};
        this.props.user.projects.map(project => {
            if(project._id == projectID)
                    projectObject = project;      
        });
        return projectObject;
    }

    editStory(event){
        window.history.pushState({}, "",this.currentProject()._id+"?storyID="+this.props.storyDetails._id);
        this.setState({isOpen : true,
                        contributorList : ["Contributors",...this.currentProject().contributors],
                        oldStoryDetails : {...this.props.storyDetails},
                        storyTitle : this.props.storyDetails.storytitle,
                        storyDescription : this.props.storyDetails.description,
                        storyComments : this.props.storyDetails.comments,
                        duedate : this.props.storyDetails.duedate, 
                        storyContributor : this.props.storyDetails.contributor,
                        storyPriority : this.props.storyDetails.priority
                    });
    }

    closeStoryModel(event){
        window.history.pushState({}, "",this.currentProject()._id);
        this.setState({isOpen : false,
            storyTitle : "",
            storyDescription : "",
            storyComments : "",
            duedate : "", 
            storyContributor : "",
            storyPriority : ""
        });
    }

    generateColumnArray(){
        let columnArray = [];
        this.currentProject().templatedetails.map(template => {
            template.CHILDREN.length == 0 && columnArray.push(template);
        });
        return columnArray;
    }

    checkMovementValidity(columnArray,position,eventType){
        switch(eventType){
            case "promoteStory" : 
                        position += 1;
                        break;
            case "demoteStory" : 
                        position -= 1;
                        break;                                                           
        }
        let selectedColumn = columnArray[position];

        if(selectedColumn.WIP == 0)
            return true;

        let queueCounter = 0;
        this.currentProject().storydetails.map(story =>{
            story.currentStatus == selectedColumn._id && queueCounter++;
        });
        let isMoveValid = queueCounter < selectedColumn.WIP ? true : false;
        return isMoveValid;
    }

    updateFormhandler(){
        let globalThis = this;
        let storyObject = {};
        let errorObject = {};
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()}
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
            storyObject.DueDate = this.state.duedate;
        }
        storyObject._id = this.props.storyDetails._id;
        storyObject.oldName = this.state.oldStoryDetails.storytitle;
        globalThis.closeStoryModel();
        httpsMiddleware.httpsRequest("/stories","PUT", headers,{storyDetails : {...storyObject}},function(error,responseObject) {
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }
        });  
    }

    moveStory(event){
        event.stopPropagation();
        let globalThis = this;
        let newPosition = globalThis.state.columnPosition;
        let columns = globalThis.generateColumnArray();
        let isMoveValid = globalThis.checkMovementValidity(columns,newPosition,event.target.className);
        let errorObject = {};
        if(isMoveValid){
            let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
            switch(event.target.className){
                case "promoteStory" : 
                            newPosition += 1;
                            break;
                case "demoteStory" : 
                            newPosition -= 1;
                            break;
                                                                        
            }
            let storyDetails = {};
            storyDetails._id = this.props.storyDetails._id;
            storyDetails.currentStatus = columns[newPosition]._id;
            console.log(this.props.storyDetails.status);
            if(columns[newPosition].workFlowEnd == true){
                storyDetails.status = "Finished";
            }else if(columns[newPosition].workFlowEnd == undefined && this.props.storyDetails.status == "Finished"){
                storyDetails.status = "Ongoing";
            }
            storyDetails.oldName = this.state.storytitle;
            httpsMiddleware.httpsRequest("/stories","PUT", headers, {storyDetails: {...storyDetails}},function(error,responseObject){
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                    if(error){
                        errorObject.msg = error;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }else{
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }
                }
            });
        }else{
            errorObject.msg = EMSG.CLI_STRY_STRMVE;
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
    }

    deleteStory(event){
        event.stopPropagation();
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let globalThis = this;
        let errorObject = {};
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let queryParams = "projectID="+projectID+"&storyID="+this.props.storyDetails._id;
        httpsMiddleware.httpsRequest("/stories","DELETE", headers,queryParams,function(error,responseObject){
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }
        });
    }

    onMouseLeave(){
        this.setState({hover:false});
    }

    onMouseOver(){
        this.setState({hover:true});
    }

    findPhoto(){
        let photo = "";
        this.props.userList.map(user => {
            photo = this.props.storyDetails.contributor == user.username ? user.photo : photo;
        });

        return photo;
    }

    render(){
        let disableInput = this.props.user.username == this.state.storyContributor || this.props.user.username == this.props.currentProject.projectlead ? false : true;
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentMonth = parseInt(currentDateObject.month)+1;
        let currentDate = currentDateObject.year+"-"+currentMonth+"-"+currentDateObject.date;
        let disableUpdate = (this.state.storyTitle != this.state.oldStoryDetails.storytitle || 
                                this.state.storyDescription != this.state.oldStoryDetails.description || 
                                    this.state.storyComments != this.state.oldStoryDetails.comments || 
                                        this.state.storyContributor != this.state.oldStoryDetails.contributor ||
                                            this.state.duedate != this.state.oldStoryDetails.duedate ||
                                                this.state.storyPriority != this.state.oldStoryDetails.priority) && (this.state.storyTitle != "" && 
                                                    this.state.storyDescription != "" && this.state.storyComments != "" && 
                                                        this.state.storyContributor != "Contributors" && this.state.duedate != "" && 
                                                            this.state.duedate >= currentDate && this.state.storyPriority != "StoryPriority") ? false : true;   
                                                                                                                                        
        let demoteShow = this.state.columnPosition != 0 && this.state.hover ? false : true;
        let promoteShow = this.state.columnPosition != this.generateColumnArray().length-1 && this.state.hover ? false : true;
        let storyJSX = this.props.storyDetails.storyTitle != "" && 
                        this.props.storyDetails.storyDescription != "" ? 
                            <div className = "storyTileContainer" 
                                id = {this.props.storyDetails._id} 
                                onClick={this.editStory}
                                onMouseOver={this.onMouseOver}
                                onMouseLeave={this.onMouseLeave}>
                                <p className = "tileHeading">{this.props.storyDetails.storytitle}</p>
                                <p className = "tileDescription">{this.props.storyDetails.description}</p>
                                {this.props.storyDetails.status == "Finished" || <p className = "duedate">Due: {this.props.storyDetails.duedate}</p>}
                                {this.props.storyDetails.status != "Finished" && this.props.storyDetails.duedate > currentDate && <p className = "duedate">OverDue</p>}
                                {this.props.storyDetails.status == "Finished" && <p className = "status">Finished</p>}
                                <p className = "storyContributor">Contributor: <img className = "Picture" src={this.findPhoto()}/></p> 
                                <button className="promoteStory" hidden={promoteShow} onClick={this.moveStory}>&gt;</button>
                                <button className="demoteStory" hidden={demoteShow} onClick={this.moveStory}>&lt;</button>
                                <button className="deleteStory" hidden={!this.state.hover} onClick={this.deleteStory}>/_\</button>
                            </div> 
                            :"";
        return(<div>
                {storyJSX}
                <Modal
				isOpen={this.state.isOpen}
				onRequestClose={this.closeStoryModel}
				contentLabel="">
                    <input disabled={disableInput} type ="text" value = {this.state.storyTitle} className = "storyTitle" onChange = {this.onChangeHandler}/>
                    <input disabled={disableInput} type ="textarea" rows = "5" cols = "20" value = {this.state.storyDescription} className = "storyDescription" onChange = {this.onChangeHandler}/>
                    <input disabled={disableInput} type = "textarea" rows = "5" cols = "20" value = {this.state.storyComments} className = "comments" onChange = {this.onChangeHandler}/>
                    <input disabled={disableInput} type ="date" value = {this.state.duedate} className = "duedate" onChange = {this.onChangeHandler}/>
                    <select disabled={disableInput} className = "priority" onChange = {this.onChangeHandler}>
                        {
                            this.state.priorityList.map(priority => {
                                if(this.state.storyPriority == priority)
                                    return (<option value = { priority } selected>{priority}</option>);
                                else
                                    return (<option value = { priority }>{priority}</option>);
                            })
                        }
                    </select>
                    <select disabled={disableInput} className = "contributor" onChange = {this.onChangeHandler}>
                        {
                            this.state.contributorList.map(contributor => {
                                if(this.state.storyContributor == contributor)
                                    return (<option value = { contributor } selected>{contributor}</option>);
                                else
                                    return (<option value = { contributor }>{contributor}</option>);
                            })
                        }
                    </select>
                    <button hidden = {disableInput} disabled = {disableUpdate} onClick = {this.updateFormhandler}>Update</button>
				</Modal>
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

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer,
        userList : state.userListStateReducer
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Story); 

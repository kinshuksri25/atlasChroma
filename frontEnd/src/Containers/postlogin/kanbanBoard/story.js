//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import url from 'url';

import cancel from "../../../Images/icons/cancel.png";
import {Button,Form} from "react-bootstrap";
import promote from "../../../Images/icons/right.png";
import demote from "../../../Images/icons/left.png";
import del from "../../../Images/icons/delete.png";
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import setMsgAction from '../../../store/actions/msgActions';
import Modal from 'react-modal';
import {OverlayTrigger,Tooltip} from 'react-bootstrap';
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
                          
        this.dummyHandler = this.dummyHandler.bind(this);
        this.moveStory = this.moveStory.bind(this);
        this.editStory = this.editStory.bind(this);
        this.findUser = this.findUser.bind(this);
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
            window.history.replaceState({}, "",this.currentProject()._id+"?storyID="+storyID);
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
    }

    dummyHandler(event){
        event.stopPropagation();
    }

    onChangeHandler(event){
        switch(event.currentTarget.id){
            case "storyTitle":
                this.setState({storyTitle : event.currentTarget.value});
                break;
            case "storyDescription":
                this.setState({storyDescription : event.currentTarget.value});
                break;
            case "comments":
                this.setState({storyComments : event.currentTarget.value});
                break;
            case "priority":
                this.setState({storyPriority : event.currentTarget.value});
                break;
            case "duedate":
                if(event.currentTarget.value >= this.props.currentProject.duedate){
                    errorObject.msg = "Invalid date selected";
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);
                }else{
                    this.setState({duedate : event.currentTarget.value});
                }
                break;    
            case "contributor":
                this.setState({storyContributor : event.currentTarget.value});
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
        window.history.replaceState({}, "",this.currentProject()._id+"?storyID="+this.props.storyDetails._id);
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
        window.history.replaceState({}, "",this.currentProject()._id);
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
            case "demoteStoryRight" :
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
                    errorObject.msg = EMSG.CLI_QURY_BCKDWN;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                    window.history.pushState({},"",urls.LOGOUT);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                    window.history.pushState({},"",urls.LOGOUT);
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
                case "demoteStoryRight" : 
                            newPosition -= 1;
                            break;                            
                                                                        
            }
            let storyDetails = {};
            storyDetails._id = this.props.storyDetails._id;
            storyDetails.currentStatus = columns[newPosition]._id;
            if(columns[newPosition].workFlowEnd == true){
                storyDetails.status = "Finished";
            }else if(columns[newPosition].workFlowEnd == undefined && this.props.storyDetails.status == "Finished"){
                storyDetails.status = "Ongoing";
            }
            storyDetails.oldStoryName = this.props.storyDetails.storytitle;
            httpsMiddleware.httpsRequest("/stories","PUT", headers, {storyDetails: {...storyDetails}},function(error,responseObject){
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                    if(error){
                        errorObject.msg = EMSG.CLI_QURY_BCKDWN;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                        window.history.pushState({},"",urls.LOGOUT);
                    }else{
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                        window.history.pushState({},"",urls.LOGOUT);
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
                    errorObject.msg = EMSG.CLI_QURY_BCKDWN;
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                    window.history.pushState({},"",urls.LOGOUT);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                    window.history.pushState({},"",urls.LOGOUT);
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

    findUser(){
        let foundUser = {name:"", photo:""};
        this.props.userList.map(user => {
            foundUser.photo = this.props.storyDetails.contributor == user.username ? user.photo : foundUser.photo;
            foundUser.name = this.props.storyDetails.contributor == user.username ? user.firstname+" "+user.lastname : foundUser.name;
        });

        return {...foundUser};
    }

    render(){
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              padding               : '1.8rem',
              borderRadius          : '8px',
              transform             : 'translate(-50%, -50%)'
            }
        };
        let disableInput = this.props.user.username == this.state.storyContributor || this.props.user.username == this.props.currentProject.projectlead ? false : true;
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        let disableUpdate = (this.state.storyTitle != this.state.oldStoryDetails.storytitle || 
                                this.state.storyDescription != this.state.oldStoryDetails.description || 
                                    this.state.storyComments != this.state.oldStoryDetails.comments || 
                                        this.state.storyContributor != this.state.oldStoryDetails.contributor ||
                                            this.state.duedate != this.state.oldStoryDetails.duedate ||
                                                this.state.storyPriority != this.state.oldStoryDetails.priority) && (this.state.storyTitle != "" && 
                                                    this.state.storyDescription != "" && this.state.storyComments != "" && 
                                                        this.state.storyContributor != "Contributors" && this.state.duedate != "" && 
                                                            (this.state.duedate > currentDate || this.state.duedate == currentDate) && this.state.storyPriority != "StoryPriority") ? false : true;   
                                                                                                                                        
        let demoteShow = this.props.storyDetails.priority != "OnHold" && this.state.columnPosition != 0 && this.state.hover ? false : true;
        let promoteShow = this.props.storyDetails.priority != "OnHold" && this.state.columnPosition != this.generateColumnArray().length-1 && this.state.hover ? false : true;
        let storyStatus = this.props.storyDetails.status == "Finished" ? "storyFinished" : this.props.storyDetails.duedate > currentDate ? "storyInProgress" : "storyOverDue";
        storyStatus = this.props.storyDetails.priority == "OnHold" ? "storyOnHold" : storyStatus;
        let demoteStoryClass = promoteShow ? "demoteStoryRight" : "demoteStory";
        let storyJSX = this.props.storyDetails.storyTitle != "" && 
                        this.props.storyDetails.storyDescription != "" ? 
                            <div className = {storyStatus}
                                id = {this.props.storyDetails._id} 
                                onClick={this.editStory}
                                onMouseOver={this.onMouseOver}
                                onMouseLeave={this.onMouseLeave}>
                                <div className = "tileHeading" title={this.props.storyDetails.storytitle}>{this.props.storyDetails.storytitle}</div>
                                <div className = "tileDescription" title={this.props.storyDetails.description}>{this.props.storyDetails.description}</div>
                                {this.props.storyDetails.priority != "OnHold" && this.props.storyDetails.status != "Finished" && this.props.storyDetails.duedate > currentDate && <p className = "storyDuedate">Due: {this.props.storyDetails.duedate}</p>}
                                {this.props.storyDetails.priority != "OnHold" &&this.props.storyDetails.status != "Finished" && this.props.storyDetails.duedate < currentDate && <p className = "duedate">OverDue</p>}
                                {this.props.storyDetails.priority != "OnHold" &&this.props.storyDetails.status == "Finished" && <p className = "storyStatus">Finished</p>}
                                {this.props.storyDetails.priority == "OnHold" && <p className = "storyStatus">OnHold</p>}
                                <p className = "storyContributor">Contributor: <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{this.findUser().name}</strong>.</Tooltip>}>
                                                                                    <img className = "Picture" src={this.findUser().photo} onClick={this.dummyHandler}/>
                                                                                </OverlayTrigger></p> 
                                { this.props.currentProject.status != "Finished" && <img className="promoteStory" hidden={promoteShow} src={promote} onClick={this.moveStory}/>}
                                { this.props.currentProject.status != "Finished" && <img className={demoteStoryClass} hidden={demoteShow} src={demote} onClick={this.moveStory}/>}
                                { this.props.currentProject.status != "Finished" && <img className="deleteStory" hidden={!this.state.hover} src={del} onClick={this.deleteStory}/>}
                            </div> 
                            :"";
        return(<div>
                {storyJSX}
                <Modal
				isOpen={this.state.isOpen}
				contentLabel=""
                style = {customStyles}>
                    <button id="notesAddCancel" className = "hideFormButton addCancel" onClick={this.closeStoryModel}><img src={cancel}/></button>
                    <Form.Group>
                        <Form.Control disabled={disableInput} type ="text" value = {this.state.storyTitle} id = "storyTitle" onChange = {this.onChangeHandler}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control disabled={disableInput} as ="textarea" rows = "5" value = {this.state.storyDescription} id = "storyDescription" onChange = {this.onChangeHandler}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control disabled={disableInput} as = "textarea" rows = "3" value = {this.state.storyComments} id = "comments" onChange = {this.onChangeHandler}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control disabled={disableInput} type ="date" value = {this.state.duedate} id = "duedate" onChange = {this.onChangeHandler}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as="select" disabled={disableInput} id = "priority" onChange = {this.onChangeHandler}>
                            {
                                this.state.priorityList.map(priority => {
                                    if(this.state.storyPriority == priority)
                                        return (<option value = { priority } selected>{priority}</option>);
                                    else
                                        return (<option value = { priority }>{priority}</option>);
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as="select" disabled={disableInput} id = "contributor" onChange = {this.onChangeHandler}>
                            {
                                this.state.contributorList.map(contributor => {
                                    if(this.state.storyContributor == contributor)
                                        return (<option value = { contributor } selected>{contributor}</option>);
                                    else
                                        return (<option value = { contributor }>{contributor}</option>);
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Button id="updateStoryButton" variant="warning" hidden = {disableInput} disabled = {disableUpdate} onClick = {this.updateFormhandler}>Update</Button>
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

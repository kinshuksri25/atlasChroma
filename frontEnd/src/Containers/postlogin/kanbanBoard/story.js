//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import httpsMiddleware from '../../../middleware/httpsMiddleware';
import setMsgAction from '../../../store/actions/msgActions';
import setUserAction from '../../../store/actions/userActions';
import cookieManager from '../../../Components/cookieManager';

class Story extends Component{
    constructor(props){
        super(props);
        this.state = {
                        columnPosition : "",
                        hover : false
                     };
        this.moveStory = this.moveStory.bind(this);
        this.editStory = this.editStory.bind(this);
        this.deleteStory = this.deleteStory.bind(this);
        this.currentProject = this.currentProject.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.generateColumnArray = this.generateColumnArray.bind(this); 
    }

    componentDidMount(){
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
        this.props.editStory(this.props.storyDetails._id);
    }

    generateColumnArray(){
        let columnArray = [];
        this.currentProject().templatedetails.map(template => {
            template.CHILDREN.length == 0 && columnArray.push(template);
        });
        return columnArray;
    }

    moveStory(event){
        event.stopPropagation();
        let newPosition = this.state.columnPosition;
        let errorObject = {};
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let globalThis = this;
        let columns = globalThis.generateColumnArray();
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
        httpsMiddleware.httpsRequest("/stories","PUT", headers, {storyDetails: {...storyDetails},contributorUsername :this.props.storyDetails.contributor}, function(error,responseObject){
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
                let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
                updatedUser.projects.map(project => {
                    if(project._id == projectID){
                        project.storydetails.map(story => {
                            if(story._id == globalThis.props.storyDetails._id){
                                story.currentstatus = columns[newPosition]._id;
                            }
                        });
                    }
                });
                globalThis.props.setUserState(updatedUser);
            }
        });
    }

    deleteStory(event){
        event.stopPropagation();
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let globalThis = this;
        let errorObject = {};
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let queryParams = "projectID="+projectID+"&storyID="+this.props.storyDetails._id+"&contributor="+this.props.storyDetails.contributor;
        httpsMiddleware.httpsRequest("/stories","DELETE", headers,queryParams, function(error,responseObject){
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
                        for(let i=0;i<project.storydetails.length;i++){
                            if(project.storydetails[i]._id == globalThis.props.storyDetails._id){
                                project.storydetails.splice(i,1);
                                break;
                            }
                        }
                    }
                });
                globalThis.props.setUserState(updatedUser);
            }
        });
    }

    onMouseLeave(){
        this.setState({hover:false});
    }

    onMouseOver(){
        this.setState({hover:true});
    }

    render(){
        let demoteShow = this.state.columnPosition != 0 && this.state.hover ? false : true;
        let promoteShow = this.state.columnPosition != this.generateColumnArray().length-1 && this.state.hover ? false : true;
        let storyJSX = this.props.storyDetails.storyTitle != "" && 
                        this.props.storyDetails.storyDescription != "" ? 
                            <div className = "storyTileContainer" 
                                id = {this.props.storyDetails._id} 
                                onClick={this.editStory}
                                onMouseOver={this.onMouseOver}
                                onMouseLeave={this.onMouseLeave}>
                                <h3 className = "tileHeading">{this.props.storyDetails.storytitle}</h3>
                                <h4 className = "tileDescription">{this.props.storyDetails.storydescription}</h4>
                                <button className="promoteStory" hidden={promoteShow} onClick={this.moveStory}>-\</button>
                                <button className="demoteStory" hidden={demoteShow} onClick={this.moveStory}>/-</button>
                                <button className="deleteStory" hidden={!this.state.hover} onClick={this.deleteStory}>/_\</button>
                            </div> 
                            :"";
        return(<div>{storyJSX}</div>);
    }
}

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

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Story); 

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
                        columnPosition : ""
                     };
        this.moveStory = this.moveStory.bind(this);
        this.editStory = this.editStory.bind(this);
        this.deleteStory = this.deleteStory.bind(this);
        this.currentProject = this.currentProject.bind(this);
        this.buildStoryTile = this.buildStoryTile.bind(this); 
        
    }

    componentDidMount(){
        let columnPostion = 0;
        for(let i =0;i<this.currentProject().templatedetails.length;i++){
            if(this.props.storyDetails.currentstatus == this.currentProject().templatedetails[i]._id){
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

    }

    moveStory(event){
        let newPosition = this.state.columnPosition;
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let globalThis = this;
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
        storyDetails.currentStatus = globalThis.currentProject().templatedetails[newPosition]._id;
        httpsMiddleware.httpsRequest("/stories","PUT", headers, {storyDetails: {...storyDetails}}, function(error,responseObject){
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    setMsgState(errorObject);
                }
            }else{
                let updatedUser = {...globalThis.props.user};
                let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
                updatedUser.projects.map(project => {
                    if(project._id == projectID){
                        project.storydetails.map(story => {
                            if(story._id == this.props.storyDetails._id){
                                story.currentstatus = project.templatedetails[newPosition]._id;
                            }
                        });
                    }
                });
                globalThis.props.setUserState(updatedUser);
            }
        });
    }

    deleteStory(event){
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let globalThis = this;
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let queryParams = "projectID="+projectID+"&storyID="+this.props.storyDetails._id+"&contributor="+this.props.storyDetails.contributor;
        httpsMiddleware.httpsRequest("/stories","DELETE", headers,queryParams, function(error,responseObject){
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    setMsgState(errorObject);
                }
            }else{
                let updatedUser = {...globalThis.props.user};
                updatedUser.projects.map(project => {
                    if(project._id == projectID){
                        for(let i=0;i<project.storydetails.length;i++){
                            if(project.storydetails[i] == this.props.storyDetails._id){
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

    buildStoryTile(mouseOver){
        let storyJSX;
        if(mouseOver){
             storyJSX = <div>
                            <h3 className = "tileHeading">{this.props.storyDetails.storyTitle}</h3>
                            <h4 className = "tileDescription">{this.props.storyDetails.storyDescription}</h4>
                        </div>;
        }else{
            if(this.state.columnPosition == 0){
                storyJSX = <div>
                                <h3 className = "tileHeading">{this.props.storyDetails.storyTitle}</h3>
                                <h4 className = "tileDescription">{this.props.storyDetails.storyDescription}</h4>
                                <button className="promoteStory" onClick={this.updateStory}>-\</button>
                                <button className="deleteStory" onClick={this.deleteStory}>/_\</button>
                            </div>;
              }else if(this.state.columnPosition == this.currentProject().templatedetails.length-1){
                storyJSX = <div>
                                <h3 className = "tileHeading">{this.props.storyDetails.storyTitle}</h3>
                                <h4 className = "tileDescription">{this.props.storyDetails.storyDescription}</h4>
                                <button className="promoteStory" onClick={this.updateStory}>/-</button>
                                <button className="deleteStory" onClick={this.deleteStory}>/_\</button>
                            </div>;
              }else{
                  storyJSX = <div>
                                <h3 className = "tileHeading">{this.props.storyDetails.storyTitle}</h3>
                                <h4 className = "tileDescription">{this.props.storyDetails.storyDescription}</h4>
                                <button className="promoteStory" onClick={this.updateStory}>-\</button>
                                <button className="demoteStory" onClick={this.updateStory}>/-</button>
                                <button className="deleteStory" onClick={this.deleteStory}>/_\</button>
                            </div>;
              } 
        }
        return storyJSX;
    }

    render(){
        let mouseOver = false;
        function mouseOverHandlerEvent (){
            mouseOver = !mouseOver;
        }
        return(<div className = "storyTileContainer" 
                    id = {this.props.storyDetails._id} 
                    onClick={this.editStory} 
                    onMouseOver = {mouseOverHandlerEvent}
                    onMouseLeave = {mouseOverHandlerEvent}>
                        {this.props.storyDetails.storyTitle != "" && this.props.storyDetails.storyDescription != "" && this.buildStoryTile(mouseOver)}
                        {this.props.storyDetails.storyTitle != "" || ""}
                </div>);
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

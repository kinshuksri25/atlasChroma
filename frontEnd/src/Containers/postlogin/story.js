//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import setUserAction from '../../store/actions/userActions';
import cookieManager from '../../Components/cookieManager';
import setProjectAction from '../../store/actions/projectActions';

class Story extends Component{
    constructor(props){
        super(props);
        this.state = {
                        storyTitle : "",
                        storyDescription : "",
                        currentStatus : "",
                        id : "",
                        contributor : "",
                        priority : "",
                        startDate : "",
                        dueDate : "",
                        comments : "",
                        storyJSX : "",
                        columnPosition : ""
                     };
        this.buildStoryTile = this.buildStoryTile.bind(this);     
        this.onClickHandler = this.onClickHandler.bind(this);      
        this.mouseOverHandler = this.mouseOverHandler.bind(this); 
        this.moveStory = this.moveStory.bind(this);
        this.deleteStory = this.deleteStory.bind(this);
        this.editStory = this.editStory.bind(this);
    }

    componentDidMount(){
        let columnPostion = 0;
        for(let i =0;i<this.props.projectDetails.activePhases.length;i++){
            if(this.props.storyDetails._id == this.props.projectDetails.activePhases[i]){
                columnPostion = i;
                break;
            }
        }
        this.setState({storyTitle:this.props.storyDetails.storytitle,
                       storyDescription:this.props.storyDetails.description,
                       currentStatus:this.props.storyDetails.currentstatus,
                       id:this.props.storyDetails._id,
                       contributor:this.props.storyDetails.contributor,
                       priority:this.props.storyDetails.priority,
                       startDate:this.props.storyDetails.startdate,
                       dueDate : this.props.storyDetails.duedate,
                       comments:this.props.storyDetails.comments,
                       columnPosition:columnPostion},() => {
                        this.buildStoryTile();
                       });                      
    }

    editStory(event){

    }

    moveStory(event){
        let newPosition = this.props.projectDetails.activePhases[this.props.projectDetails.activePhases.indexOf(this.state.currentStatus)];
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
        storyDetails._id = this.state.id;
        storyDetails.storytitle = this.state.storyTitle;
        storyDetails.description = this.state.storyDescription;
        storyDetails.contributor = this.state.contributor;
        storyDetails.priority = this.state.priority;
        storyDetails.startdate = this.state.startDate;
        storyDetails.duedate = this.state.dueDate;
        storyDetails.currentstatus = this.state.currentStatus;
        storyDetails.comments = this.state.comments
        httpsMiddleware.httpsRequest("/stories", PUT, headers, {projectID : this.props.projectDetails.currentProject._id, storyDetails: {...storyDetails}}, function(error,responseObject){
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    console.log(error);
                    //TODO --> errormsg div(ERR_CONN_SERVER)
                }else{
                    //TODO --> errormsg div(errorMsg)
                }
            }else{
                let updatedUser = {...this.props.user};
                let updatedProjectDetails;

                updatedUser.projects.map(project => {
                    if(project._id == this.projectDetails.currentProject._id){
                        project.storydetails.map(story => {
                            if(story._id == this.state.id){
                                story.currentstatus = this.props.projectDetails.activePhases[newPosition];
                            }
                        });
                        updatedProjectDetails = {...project};
                    }
                });
                this.props.setUserState(updatedUser);
                this.props.updateProjectState({currentProject : {...updatedProjectDetails}});
                this.setState({columnPosition : newPosition});
            }
        });
    }

    deleteStory(event){
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let storyDetails = {};
        storyDetails._id = this.state.id;
        storyDetails.storytitle = this.state.storyTitle;
        storyDetails.description = this.state.storyDescription;
        storyDetails.contributor = this.state.contributor;
        storyDetails.priority = this.state.priority;
        storyDetails.startdate = this.state.startDate;
        storyDetails.duedate = this.state.dueDate;
        storyDetails.currentstatus = this.state.currentStatus;
        storyDetails.comments = this.state.comments
        httpsMiddleware.httpsRequest("/stories", DELETE, headers, {projectID : this.props.projectDetails.currentProject._id, storyDetails: {...storyDetails}}, function(error,responseObject){
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    console.log(error);
                    //TODO --> errormsg div(ERR_CONN_SERVER)
                }else{
                    //TODO --> errormsg div(errorMsg)
                }
            }else{
                let updatedUser = {...this.props.user};
                let updatedProjectDetails;

                updatedUser.projects.map(project => {
                    if(project._id == this.projectDetails.currentProject._id){
                        for(let i=0;i<project.storydetails.length;i++){
                            if(project.storydetails[i] == this.state.id){
                                while(i < project.storydetails.length){
                                    project.storydetails[i] = project.storydetails[i+1];
                                    i++;
                                }
                                break;
                            }
                        }
                        project.storydetails.pop();
                        updatedProjectDetails = {...project};
                    }
                });
                this.props.setUserState(updatedUser);
                this.props.updateProjectState({currentProject : {...updatedProjectDetails}});
                this.setState({columnPosition : newPosition});
            }
        });
    }

    mouseOverHandler(event){
      if(this.state.columnPosition == 0){
        this.setState({storyJSX :  <div>
                                        <h3 className = "tileHeading">{this.state.storyTitle}</h3>
                                        <h4 className = "tileDescription">{this.state.storyDescription}</h4>
                                        <button className="promoteStory">-\</button>
                                        <button className="deleteStory">/_\</button>
                                    </div>});
      }else if(this.state.columnPosition == this.props.stories.length-1){
        this.setState({storyJSX :  <div>
                                        <h3 className = "tileHeading">{this.state.storyTitle}</h3>
                                        <h4 className = "tileDescription">{this.state.storyDescription}</h4>
                                        <button className="demoteStory">/-</button>
                                        <button className="deleteStory">/_\</button>
                                    </div>});
      }else{
        this.setState({storyJSX :  <div>
                                        <h3 className = "tileHeading">{this.state.storyTitle}</h3>
                                        <h4 className = "tileDescription">{this.state.storyDescription}</h4>
                                        <button className="promoteStory">-\</button>
                                        <button className="demoteStory">/-</button>
                                        <button className="deleteStory">/_\</button>
                                    </div>});
      } 
    }

    buildStoryTile(){
        this.setState({
            storyJSX : <div>
                            <h3 className = "tileHeading">{this.state.storyTitle}</h3>
                            <h4 className = "tileDescription">{this.state.storyDescription}</h4>
                        </div>});
    }

    render(){
        return(<div className = "storyTileContainer" 
                    id = {this.state.id} 
                    onClick={this.editStory} 
                    onMouseOver = {this.mouseOverHandler}
                    onMouseLeave = {this.buildStoryTile}>
                        {this.state.storyJSX}
                </div>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        updateProjectState: (project) => {
            dispatch(setProjectAction(project));
        }
    };
};

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer,
        projectDetails: state.projectStateReducer
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Story); 

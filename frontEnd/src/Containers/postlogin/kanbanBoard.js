//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import SetupProject from '../generalContainers/setupProject';
import StoryForm from './storyForm';
import Story from './story';
import {urls} from '../../../../lib/constants/contants';

class KanbanBoard extends Component {

    constructor(props){
        super(props);
        this.state={
            currentProject:{},
            parentBoard:"",
            storyPopUp: false,
            showStoryForm:false
        };
        this.buildBoard = this.buildBoard.bind(this);
        this.updateCurrentProject = this.updateCurrentProject.bind(this);
        this.addStory = this.addStory.bind(this);
        this.placeStories = this.placeStories.bind(this);
    }
    //TODO --> directly hitting this page will immediately redirect to dashboard as the user is not available 
    //this needs to be fixed in the next refactor
    componentDidMount(){
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let projectObject = {};
        this.props.user.projects.map(project => {
            if(project._id == projectID)
                    projectObject = project;      
        });

        if(JSON.stringify(projectObject) == JSON.stringify({})){
            window.history.replaceState({}, "",urls.DASHBOARD);
        }else{
            this.setState({currentProject:{...projectObject}},()=> {
                if(this.state.currentProject.boarddetails.templatedetails != undefined)
                {
                    this.buildBoard();
                }
            });
        }
    }

    placeStories(stories){
       stories.map(story => {
            let parentPhase = document.getElementById(story.currentstatus);
            let storyTile = document.createElement("DIV");
            storyTile.innerHTML = story.storytitle;
            storyTile.id = storyTile._id;
            parentPhase.appendChild(storyTile); 
       });
    }

    addStory(){
        let showOrHide = !this.state.showStoryForm;
        this.setState({showStoryForm : showOrHide});
    }

    updateCurrentProject(updatedProject){
        this.setState({currentProject : updatedProject},()=> {
            this.buildBoard();
        });
    }
    
    buildBoard(template = this.state.currentProject.boarddetails){
        let board = ""; 
        let phaseContainerStyle = {};
        let numberOfElements = 0;
        template.templatedetails.map(template => {
            if(template.EXTENDS == "")
                numberOfElements +=1;  
        });
        let centralContainer = document.getElementById("boardContainer");
        if(centralContainer != null){
            
            phaseContainerStyle = {
                float : "left",
                width : centralContainer.offsetWidth / numberOfElements
            };  
        }

        board = template.templatedetails.map(template => {
            if(template.EXTENDS == "" && template.CHILDREN.length == 0){
                return(
                    <div className="phaseContainer" id={template._id} style = {phaseContainerStyle}>
                        <div className="phaseHeading">{template.NAME}</div>
                        <div className="storiesContainer"></div>
                    </div>
                );
            }else if(template.EXTENDS == "" && template.CHILDREN.length != 0){
                return(
                    <div className="phaseContainer" id={template._id} style = {phaseContainerStyle}>
                        <div className="phaseHeading">{template.NAME}</div>
                    </div>
                );
            }
        });
        //set the parentboard
        this.setState({parentBoard : board}, () => {
            this.renderChild();
        });
    }

    renderChild(templateArr = this.state.currentProject.boarddetails){
        templateArr.templatedetails.map(template => {
                let parentTemplateID = "";
                templateArr.templatedetails.map(parentTemp => {
                    if(parentTemp.NAME == template.EXTENDS)
                        parentTemplateID = parentTemp._id;
                });

                let phaseContainer = document.createElement("DIV");
                let phaseHeading = document.createElement("DIV");

                phaseContainer.className = "phaseContainer";
                phaseContainer.id = template._id;
                phaseHeading.innerHTML = template.NAME;

                phaseContainer.appendChild(phaseHeading);
                let style = {};
            if(template.EXTENDS != "" && template.CHILDREN.length != 0){
                let parentComponent = document.getElementById(parentTemplateID);
                let numberOfElements = 0;
                templateArr.templatedetails.map(temp => {
                    if(temp.NAME == template.EXTENDS)
                    numberOfElements = temp.CHILDREN.length;
                });

                phaseContainer.style.float = "left";
                phaseContainer.style.width = parentComponent.offsetWidth/numberOfElements;
                parentComponent.appendChild(phaseContainer);

            } else if(template.EXTENDS != "" && template.CHILDREN.length == 0){
                let storiesContainer = document.createElement("DIV");
                storiesContainer.className = "storiesContainer";
                phaseHeading.appendChild(storiesContainer);

                let parentComponent = document.getElementById(parentTemplateID);
                let style = {};
                let numberOfElements = 0;
                templateArr.templatedetails.map(temp => {
                    if(temp.NAME == template.EXTENDS)
                    numberOfElements = temp.CHILDREN.length;
                });
                phaseContainer.style.float = "left";
                phaseContainer.style.width = parentComponent.offsetWidth/numberOfElements;
                parentComponent.appendChild(phaseContainer);
            }
        });
        let stories = [...this.state.currentProject.storydetails];
        stories != undefined && this.placeStories(stories);
    }

    render(){
        let boardStyle = {
            width : screen.width
        };
        let setupProject = "";
        if(JSON.stringify(this.state.currentProject) != JSON.stringify({}) && this.state.currentProject.boarddetails.templatedetails == undefined){
            setupProject = <SetupProject projectObject = {this.state.currentProject} updateCurrentProject = {this.updateCurrentProject}/>;
        }
        return (<div>
                    {this.state.showStoryForm && <StoryForm currentProject={this.state.currentProject} closeForm={this.addStory} placeStories={this.placeStories} currentMode = "ADD"/>}
                    {setupProject} 
                    <div className ="boardContainer" id="boardContainer" style = {boardStyle}>
                        {this.state.parentBoard}
                        {this.state.parentBoard != "" && <button onClick={this.addStory} id="addStoryButton">+</button>}
                    </div>
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(KanbanBoard); 

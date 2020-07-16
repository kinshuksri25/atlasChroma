//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import url from 'url';

import SetupProject from './setupProject';
import StoryForm from './storyForm';
import BoardColumn from './boardColumn';
import {urls} from '../../../../../lib/constants/contants';
import story from './story';

class KanbanBoard extends Component {

    constructor(props){
        super(props);
        this.state={
            showStoryForm:false,
            componentWidth : screen.width,
            currentMode : "",
            storyID : ""
        };
        this.addStory = this.addStory.bind(this);
        this.closeStory = this.closeStory.bind(this);
        this.editStory = this.editStory.bind(this);
        this.buildBoard = this.buildBoard.bind(this);
        this.selectProject = this.selectProject.bind(this);
        this.groupTemplate = this.groupTemplate.bind(this);
    }
    
    componentDidMount(){
        JSON.stringify(this.selectProject()) == JSON.stringify({}) && window.history.replaceState({}, "",urls.DASHBOARD);
        let storyObject = url.parse(window.location.href,true);
        let storyID = storyObject.query.storyID;
        if(storyID != undefined){
            this.editStory(storyID);
        }
    }

    groupTemplate(template){
        let groupedTemplate = [];
        template.map(element => {
            element.CHILDREN.length == 0 && element.EXTENDS == "" && groupedTemplate.push(element);
            if(element.CHILDREN.length != 0 && element.EXTENDS == ""){
                template.map(childElement => {
                    if(element.CHILDREN.includes(childElement.NAME)){
                        element.CHILDREN.splice(element.CHILDREN.indexOf(childElement.NAME),1,childElement);
                    }
                });
                groupedTemplate.push(element);
            }
        });
        return groupedTemplate;
    }

    editStory(storyID){
        this.state.showStoryForm || this.setState({showStoryForm : true,currentMode : "EDIT",storyID : storyID}); 
    }

    selectProject(){
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let projectObject = {};
        this.props.user.projects.map(project => {
            if(project._id == projectID)
                    projectObject = project;      
        });
        return projectObject;
    }
    
    buildBoard(template = this.selectProject().templatedetails){
        let board = "";
        let groupedTemplate = this.groupTemplate(template);
        let width = this.state.componentWidth/groupedTemplate.length;
        board = groupedTemplate.map(template => {
            return(<BoardColumn editStory = {this.editStory} columnDetails = {template} width = {width}/>);    
        });
        return (<div>{board}</div>);
    }

    addStory(){
        this.setState({showStoryForm : true,currentMode : "ADD",storyID : ""});
    }

    closeStory(){
        this.setState({showStoryForm : false,currentMode : "",storyID : ""});      
    }

    render(){
        let boardStyle = {
            width : this.state.componentWidth
        };
        let currentProject = this.selectProject();
        let boardJSX = JSON.stringify(currentProject) == JSON.stringify({}) ? "" : 
                            JSON.stringify(currentProject.templatedetails) != JSON.stringify({}) ? this.buildBoard() :
                                 <SetupProject/>;
        return (<div>
                    {this.state.showStoryForm && <StoryForm closeForm={this.closeStory} storyID = {this.state.storyID} currentMode = {this.state.currentMode} projectDetails = {currentProject} />}
                    <div className ="boardContainer" id="boardContainer" style = {boardStyle}>
                        {boardJSX}
                    </div>
                    {JSON.stringify(currentProject) != JSON.stringify({}) && 
                        JSON.stringify(currentProject.templatedetails) != JSON.stringify({}) && 
                            <button hidden = {this.state.showStoryForm} onClick={this.addStory} id="addStoryButton">+</button>}
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps)(KanbanBoard); 

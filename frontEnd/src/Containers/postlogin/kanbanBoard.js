//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import SetupProject from '../generalContainers/setupProject';
import StoryForm from './storyForm';
import BoardColumn from './boardColumn';
import setProjectAction from '../../store/actions/projectActions';
import {urls} from '../../../../lib/constants/contants';

class KanbanBoard extends Component {

    constructor(props){
        super(props);
        this.state={
            parentBoard:"",
            storyPopUp: false,
            showStoryForm:false,
            componentWidth : screen.width
        };
        this.buildBoard = this.buildBoard.bind(this);
        this.addStory = this.addStory.bind(this);
        this.updateCurrentProject = this.updateCurrentProject.bind(this);
        this.groupTemplate = this.groupTemplate.bind(this);
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
            this.props.updateProjectState({currentProject : projectObject, activePhases : [...projectObject.boarddetails.templatedetails]});
            projectObject.boarddetails.templatedetails != undefined && this.buildBoard(projectObject.boarddetails);
        }
    }

    addStory(){
        let showOrHide = !this.state.showStoryForm;
        this.setState({showStoryForm : showOrHide});
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

    updateCurrentProject(template){
        this.props.updateProjectState({activePhases : [...template]});
        buildBoard(template);
    }
    
    buildBoard(template = this.props.projectDetails.currentProject.boarddetails){
        let board = "";
        let groupedTemplate = this.groupTemplate(template.templatedetails);
        let width = this.state.componentWidth/groupedTemplate.length;
        board = groupedTemplate.map(template => {
            return(<BoardColumn columnDetails = {template} width = {width}/>);    
        });
        this.setState({parentBoard : board});
    }

    render(){
        let boardStyle = {
            width : this.state.componentWidth
        };
        let setupProject = "";
        if(JSON.stringify(this.props.projectDetails.currentProject) != JSON.stringify({}) && this.props.projectDetails.currentProject.boarddetails.templatedetails == undefined){
            setupProject = <SetupProject updateCurrentProject = {this.updateCurrentProject}/>;
        }
        return (<div>
                    {this.state.showStoryForm && <StoryForm closeForm={this.addStory} currentMode = "ADD"/>}
                    {setupProject} 
                    <div className ="boardContainer" id="boardContainer" style = {boardStyle}>
                        {this.state.parentBoard}
                    </div>
                    {this.state.parentBoard != "" && <button onClick={this.addStory} id="addStoryButton">+</button>}
                </div>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
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

export default connect(mapStateToProps,mapDispatchToProps)(KanbanBoard); 

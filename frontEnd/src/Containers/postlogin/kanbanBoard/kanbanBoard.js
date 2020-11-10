//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import Modal from 'react-modal';
import "../../../StyleSheets/kanbanBoard.css";

import SetupProject from './setupProject';
import StoryForm from './storyForm';
import BoardColumn from './boardColumn';
import {urls} from '../../../../../lib/constants/contants';

class KanbanBoard extends Component {

    constructor(props){
        super(props);
        this.state={
            showStoryForm:false,
            componentWidth : screen.width
        };
        this.addStory = this.addStory.bind(this);
        this.closeStory = this.closeStory.bind(this);
        this.buildBoard = this.buildBoard.bind(this);
        this.selectProject = this.selectProject.bind(this);
        this.groupTemplate = this.groupTemplate.bind(this);
    }
    
    static getDerivedStateFromProps(props,state){
        let projectObject = {};
        props.user.projects.map(project => {
            if(project._id == props.projectID)
                    projectObject = project;      
        });
        if(JSON.stringify(projectObject) == JSON.stringify({}))
        {
            window.history.replaceState({}, "",urls.PROJECT);
        }
        return null;    
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

    selectProject(){
        let projectObject = {};
        this.props.user.projects.map(project => {
            if(project._id == this.props.projectID)
                    projectObject = project;      
        });
        return projectObject;
    }
    
    buildBoard(template = this.selectProject().templatedetails){
        let board = "";
        let groupedTemplate = this.groupTemplate(template);
        let width = this.state.componentWidth/groupedTemplate.length;
        board = groupedTemplate.map(template => {
            return(<BoardColumn columnDetails = {template} width = {width}/>);    
        });
        return (<div>{board}</div>);
    }

    addStory(){
        this.setState({showStoryForm : true});
    }

    closeStory(){
        this.setState({showStoryForm : false});      
    }

    render(){
        let currentProject = this.selectProject();
        let boardJSX = JSON.stringify(currentProject.templatedetails) != JSON.stringify({}) ? this.buildBoard() : <SetupProject/>;
        return (<div className="boardContainer">
                    <Modal
                    isOpen={this.state.showStoryForm}
                    contentLabel="">
                        <StoryForm closeForm={this.closeStory} projectDetails = {currentProject}/>
                    </Modal>
                    <div>
                        {boardJSX}
                    </div>
                    {JSON.stringify(currentProject) != JSON.stringify({}) && 
                        JSON.stringify(currentProject.templatedetails) != JSON.stringify({}) && 
                            <button onClick={this.addStory} id="addStoryButton">+</button>}
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps)(KanbanBoard); 

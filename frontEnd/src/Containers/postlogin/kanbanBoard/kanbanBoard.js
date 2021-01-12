//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import Modal from 'react-modal';

import cancel from "../../../Images/icons/cancel.png";
import "../../../StyleSheets/kanbanBoard.css";
import {Button} from "react-bootstrap";
import SetupProject from './setupProject';
import StoryForm from './storyForm';
import BoardColumn from './boardColumn';
import ProjectDetails from './projectDetails';
import {urls} from '../../../../../lib/constants/contants';

class KanbanBoard extends Component {

    constructor(props){
        super(props);
        this.state={
            showStoryForm:false,
            openProjectInfo : false
        };
        this.addStory = this.addStory.bind(this);
        this.closeStory = this.closeStory.bind(this);
        this.buildBoard = this.buildBoard.bind(this);
        this.selectProject = this.selectProject.bind(this);
        this.groupTemplate = this.groupTemplate.bind(this);
        this.openProjectInfoModal = this.openProjectInfoModal.bind(this);
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
        let maxStoryWidth = "";
        let validColumns = 0;
        template.map(template => {
            if(template.CHILDREN.length==0){
                validColumns++;
            }
        });
        validColumns = validColumns > 5 ? 5 : validColumns;
        maxStoryWidth = screen.availWidth-(16+(validColumns*16)+((validColumns-1)*8)+8);
        maxStoryWidth = maxStoryWidth/validColumns;

        board = groupedTemplate.map(template => {
            return(<BoardColumn currentProject={this.selectProject()} columnDetails = {template} maxStoryWidth = {maxStoryWidth}/>);    
        });
        return (<div className = "innerBoardContainer">{board}</div>);
    }

    addStory(){
        this.setState({showStoryForm : true});
    }

    closeStory(){
        this.setState({showStoryForm : false});      
    }

    openProjectInfoModal(){
        this.setState({openProjectInfo : !this.state.openProjectInfo});
    }

    render(){
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              heigth                : '10%',
              marginRight           : '-50%',
              paddingTop            : '1.8rem',
              paddingBottom         : '1.8rem',
              borderRadius          : '5px',
              transform             : 'translate(-50%, -50%)'
            }
        };
        let currentProject = this.selectProject();
        let hideBoardDetails = JSON.stringify(currentProject) != JSON.stringify({}) && currentProject.templatedetails.length > 0 ? false : true;
        let boardJSX = JSON.stringify(currentProject.templatedetails) != JSON.stringify({}) ? this.buildBoard() : <SetupProject/>;
        return (<div className="boardContainer" style={JSON.stringify(currentProject.templatedetails) != JSON.stringify({}) ? {} : {background:"linear-gradient(145deg,#FDC5F5 20%,#F7AEF8 20% 40%,#B388EB 40% 60%,#8093F1 60% 80%,#72DDF7 80% 100%)"}}>
                    {JSON.stringify(currentProject) != JSON.stringify({}) && currentProject.templatedetails.length > 0 && <h3>{currentProject.title}</h3>}
                    {JSON.stringify(currentProject) != JSON.stringify({}) && currentProject.templatedetails.length > 0 && <Button className = "Info" onClick={this.openProjectInfoModal}>i</Button>}
                    <Modal
                    isOpen={this.state.showStoryForm}
                    contentLabel=""
                    style = {customStyles}>
                        <StoryForm closeForm={this.closeStory} projectDetails = {currentProject}/>
                    </Modal>
                    <Modal
                    isOpen={this.state.openProjectInfo}
                    contentLabel=""
                    style = {customStyles}>
                        <button className = "infoCancel" onClick={this.openProjectInfoModal}><img src={cancel}/></button>
                        <ProjectDetails projectDetails = {currentProject}/>
                    </Modal>
                    {boardJSX}
                    {JSON.stringify(currentProject) != JSON.stringify({}) && currentProject.templatedetails.length > 0 && <Button onClick={this.addStory} id="addStoryButton">+</Button>}
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps)(KanbanBoard); 

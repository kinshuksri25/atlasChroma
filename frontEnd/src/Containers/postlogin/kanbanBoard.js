//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import SetupProject from '../generalContainers/setupProject';
import {urls} from '../../../../lib/constants/contants';

class KanbanBoard extends Component {

    constructor(props){
        super(props);
        this.state={
            currentProject:{}
        };
        this.buildBoard = this.buildBoard.bind(this);
        this.groupTemplates = this.groupTemplates.bind(this);
    }
    //TODO --> directly hitting this page will immediately redirect to dashboard as the user is not available 
    //this needs to be fixed in the next refactor
    componentDidMount(){
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let columnTracker = [];
        let projectObject = {};
        this.props.user.projects.map(project => {
            if(project._id == projectID)
                    projectObject = project;      
        });

        if(JSON.stringify(projectObject) == JSON.stringify({})){
            window.history.replaceState({}, "",urls.DASHBOARD);
        }else{
            this.setState({currentProject:{...projectObject}});
        }
    }

    buildBoard(template = this.state.currentProject.boarddetails){
        let board = "";
        let groupedTemplate = this.groupTemplates();
        console.log(groupedTemplate);
        return board;
    }

    groupTemplates(){
        let template = this.state.currentProject.boarddetails.templatedetails;
        let groupedTemplate = [];
        template.map(element => {
            if(element.EXTENDS != ""){
                for(let i=0;i< groupedTemplate.length;i++){
                    for(let j=0;j<groupedTemplate[i].length;j++){
                        if(groupedTemplate[i][j].NAME == element.EXTENDS){
                            groupedTemplate[i].push(element);
                        }
                    }
                }
            }else{
                let parentArr = [];
                parentArr.push(element);
                groupedTemplate.push(parentArr);
            }  
        }); 
        return groupedTemplate;
    }
        
    render(){
        let boardStyle = {
            width : screen.width
        };
        let setupProject = "";
        if(JSON.stringify(this.state.currentProject) != JSON.stringify({})){
            setupProject = JSON.stringify(this.state.currentProject.boarddetails) == JSON.stringify({}) ? 
                                    <SetupProject projectObject = {this.state.currentProject}/>
                                    :
                                    <div className ="boardContainer" style = {boardStyle}>
                                        {this.buildBoard()}
                                    </div>;
        }
        return (<div>
                    {setupProject} 
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(KanbanBoard); 

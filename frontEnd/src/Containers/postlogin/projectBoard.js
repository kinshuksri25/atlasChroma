//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import SimpleBoard from './simpleBoard';
import KanbanBoard from './kanbanBoard';

class ProjectBoard extends Component 
{
    constructor(props){
        super(props);
        this.projectSelector = this.projectSelector.bind(this);
    }

    projectSelector(){
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        let projectObject = {};
        this.props.user.projects.map(project => {
            if(project._id == projectID)
                 projectObject = project;      
        });
        return projectObject;
    }

    render(){
        let activeProject = this.projectSelector();
        let board = JSON.stringify(activeProject) == JSON.stringify({}) ? 
                    "Invalid projectID" 
                    : 
                    activeProject.projecttype == "Simple" ? <SimpleBoard projectObject = {activeProject}/> 
                                                : 
                                                <KanbanBoard projectObject = {activeProject}/>
        return (<div> {board} </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(ProjectBoard);
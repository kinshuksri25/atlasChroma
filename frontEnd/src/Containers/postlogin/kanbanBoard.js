//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

class KanbanBoard extends Component {

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
        JSON.stringify(projectObject) == JSON.stringify({}) && window.history.replaceState({}, "",urls.DASHBOARD);
        return projectObject;
    }      
        render(){
                let projectObject = this.projectSelector();
                return (<div>{projectObject.title}</div>);
        }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(KanbanBoard); 

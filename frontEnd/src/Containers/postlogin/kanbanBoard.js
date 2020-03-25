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
        JSON.stringify(projectObject) == JSON.stringify({}) && window.history.replaceState({}, "",urls.DASHBOARD);
        this.setState({currentProject:{...projectObject}});
    }
        
    render(){
        let setupProject = "";
            if(this.state.currentProject.storydetails != undefined)
                setupProject = this.state.currentProject.storydetails.length == 0 ? <SetupProject projectObject = {this.state.currentProject}/>:"";
            
            return (<div>
                        {setupProject} 
                        {this.state.currentProject.title} 
                    </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(KanbanBoard); 

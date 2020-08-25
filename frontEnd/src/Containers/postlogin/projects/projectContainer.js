//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {urls} from '../../../../../lib/constants/contants';

class ProjectContainer extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            projects : {}
        }
        this.renderProjectTabs = this.renderProjectTabs.bind(this);
        this.sortProjects = this.sortProjects.bind(this);
        this.onClick = this.onClick.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.hideEdit = this.hideEdit.bind(this);
    }

    renderProjectTabs(){
      if(this.props.user.projects.length != 0){
        let sortedProjectArray = this.sortProjects(this.props.orderBy,this.props.user.projects);
        let projectContainer = sortedProjectArray.map(project => {
            let buttonHidden = this.state.projects[project._id] == undefined ? true : this.state.projects[project._id];
            return(
                    //TODO add the project lead's photo (link)  
                    //TODO add a list of contributors (profilePhotos)(link)
                <button className = {project._id} onClick = {this.onClick} onMouseOver = {this.showEdit} onMouseLeave = {this.hideEdit}>
                    <h3 className = {project._id}>{project.title}</h3>
                    <h4 className = {project._id}>Project Lead:</h4>
                    <h5 className = {project._id}>{project.description}</h5>
                    <button hidden = {buttonHidden} onClick = {this.props.showEditProject} id = {project._id} className = "openEditModal">/\</button>
                </button>   
            );
        });
      return (<div>{projectContainer}</div>);
      }else{
            //TODO add in dataConstants
          return (<h1>You are not collaborating on any projects...</h1>);
      }
    }

    hideEdit(event){
        let projects = this.state.projects;
        projects[event.target.className] = true;
        this.setState({projects : {...projects}}); 
    }

    showEdit(event){
        let projects = this.state.projects;
        projects[event.target.className] = false;
        this.setState({projects : {...projects}});
    }

    onClick(event){
        let projectID = event.target.className;
        window.history.pushState({},"",urls.PROJECT+"/"+projectID);
    }

    sortProjects(orderBy,projectArray){
        let sortedArray = [...projectArray];
        let selection = "";
        switch(orderBy){
            case "Recently Created":
                selection="creationdate";
                break;
            case "Recently Modified":
                selection="modificationdate";
                break;
            case "Alphabetically":
                selection="title";
                break;
             default:
                 selection="creationdate";
                 break;           
        }

        let sel={},tempVal={},counter=0,selIndex=0;
        let arrLen = sortedArray.length;
        for(let i = 0; i < arrLen; i++){
            counter = i;
            sel = sortedArray[i];
            while(counter < arrLen){
                if(sortedArray[counter][selection] <= sel[selection])
                {
                    sel = sortedArray[counter];
                    selIndex = counter;
                }
                counter++;
            }
            tempVal = sortedArray[i];
            sortedArray[i] = sel;
            sortedArray[selIndex] = tempVal;
        }
        return sortedArray;
    }

    render(){
        let container = this.renderProjectTabs();
        return(<div>
                {container}
              </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(ProjectContainer);

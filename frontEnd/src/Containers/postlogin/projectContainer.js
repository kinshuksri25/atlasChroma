//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProjectContainer extends Component{
    
    constructor(props){
        super(props);
        this.renderProjectTabs = this.renderProjectTabs.bind(this);
        this.sortProjects = this.sortProjects.bind(this);
    }

    renderProjectTabs(){
      if(this.props.user.projects.length != 0){
        let sortedProjectArray = this.sortProjects(this.props.orderBy,this.props.user.projects);
        let projectContainer = sortedProjectArray.map(project => {
            return(
                    //TODO add the project lead's photo (link)  
                    //TODO add a list of contributors (profilePhotos)(link)
                <button id = {project.title} className = {project.projecttype} onClick = {this.onClick}>
                    <h3>{project.title}</h3>
                    <h4>Project Lead:</h4>
                    <h5>{project.description}</h5>
                </button>   
            );
        });
      return (<div>{projectContainer}</div>);
      }else{
            //TODO add in dataConstants
          return (<h1>You are not collaborating on any projects...</h1>);
      }
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

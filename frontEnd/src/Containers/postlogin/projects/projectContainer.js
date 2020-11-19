//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {Card,Button} from "react-bootstrap";
import {OverlayTrigger,Tooltip} from 'react-bootstrap';

import DateHelper from "../../generalContainers/date";
import "../../../StyleSheets/projectContainer.css";
import {urls} from '../../../../../lib/constants/contants';

class ProjectContainer extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            projects : {},
            showContributors: false
        }
        this.renderProjectTabs = this.renderProjectTabs.bind(this);
        this.sortProjects = this.sortProjects.bind(this);
        this.onClick = this.onClick.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.hideEdit = this.hideEdit.bind(this);
        this.getProfilePictures = this.getProfilePictures.bind(this);
        this.openContributorListModal = this.openContributorListModal.bind(this);
    }

    getProfilePictures(typeOfProfile){
        let users = typeof(typeOfProfile) == "object" ? [...typeOfProfile] : [typeOfProfile];
        let profilePictureList = [];
        this.props.userList.map(user => {
            if(users.indexOf(user.username) >= 0){
                profilePictureList.push(user);
            }
        });
        return profilePictureList;
    }

    renderProjectTabs(){
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentMonth = parseInt(currentDateObject.month)+1;
        let currentDate= currentDateObject.year+"-"+currentMonth+"-"+currentDateObject.date;
        if(this.props.user.projects.length != 0){
            let sortedProjectArray = this.sortProjects(this.props.orderBy,this.props.user.projects);
            let projectContainer = sortedProjectArray.map(project => {
                let numberOfContributors = 3;
                let contributorList = this.getProfilePictures(project.contributors);
                let contributorJSX=[];
                if(contributorList.length !=0)
                {
                    let minContriLength = numberOfContributors < contributorList.length ? numberOfContributors : contributorList.length;
                    for(let i=0;i<minContriLength;i++){
                        let name = contributorList[i].firstname+" "+contributorList[i].lastname;
                        let photo = contributorList[i].photo;
                        contributorJSX.push(
                            <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{name}</strong>.</Tooltip>}>
                                <img className = "profilePicture" src={photo}/>                                     
                            </OverlayTrigger>
                        );
                    }
                }

                let buttonHidden = this.state.projects[project._id] == undefined ? true : this.state.projects[project._id];
                return(
                        <div id = "projectCard" className = {project._id} onMouseOver = {this.showEdit} onMouseLeave = {this.hideEdit} onClick = {this.onClick}>
                            <h3 id="projectTitle" className = {project._id} onMouseOver = {this.showEdit} onMouseLeave = {this.hideEdit}>{project.title}</h3>
                            <p id="projectDescription" className = {project._id} onMouseOver = {this.showEdit} onMouseLeave = {this.hideEdit}>
                                {project.description}
                            </p>
                            <h6 id="contributors" className = {project._id}>
                                Contributors:
                                    {contributorJSX}
                                    {contributorList.length > numberOfContributors && <span onClick={this.openContributorListModal}> +{contributorList.length-numberOfContributors}</span>}                              
                            </h6>
                            <h6 id="projectLead" className = {project._id}>
                                Project Lead:
                                    {
                                        this.getProfilePictures(project.projectlead).map(user => {
                                            return (<OverlayTrigger placement="right" overlay={<Tooltip> <strong>{user.firstname+" "+user.lastname}</strong>.</Tooltip>}>
                                                        <img className = "profilePicture" src={user.photo}/>
                                                    </OverlayTrigger>);
                                        })
                                    }
                            </h6>
                            <p id="projectStatus" className = {project._id} onMouseOver = {this.showEdit} onMouseLeave = {this.hideEdit}>
                                {project.status == "InProgress" && project.duedate <= currentDate && <span>Due: {project.duedate}</span>}
                                {project.status == "InProgress" && project.duedate > currentDate && <span>OverDue</span>}
                                {project.status == "InProgress" || <span>{project.status}</span>}
                            </p>
                            <button hidden = {buttonHidden} onClick = {this.props.showEditProject} id = {project._id} className = "openEditModal">/\</button>
                            <Modal
                            isOpen={this.state.showContributors}
                            contentLabel="">
                                <button className = "openAddModal" onClick={this.openContributorListModal}>X</button>
                                {
                                    contributorList.map(contributor => {
                                        return(
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{contributor.firstname+" "+contributor.lastname}</strong>.</Tooltip>}>
                                                <img className = "profilePicture" src={contributor.photo}/>                                     
                                            </OverlayTrigger>
                                        )
                                    })
                                }
                            </Modal>
                        </div> 
                    );
                });
            return (<div className = "innerContainer">{projectContainer}</div>);
        }else{
            return (<div className = "innerEmptyContainer"><h3 className = "noProjectTitle">You are not collaborating on any projects...</h3></div>);
        }
    }

    openContributorListModal(event){
        event.stopPropagation();
        this.setState({showContributors : !this.state.showContributors});
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
            case "Project DueDate":
                    selection="duedate";
                    break;                
             default:
                 selection="creationdate";
                 break;           
        }
        let sel={},counter=0,selIndex=-1;
        let arrLen = sortedArray.length;
        for(let i = 0; i < arrLen; i++){
            selIndex = -1;
            counter = i-1;
            sel = sortedArray[i];
            while(counter >= 0){
                if((sortedArray[counter][selection] > sel[selection]) || (sortedArray[counter][selection] == sel[selection] && sortedArray[counter]["title"] > sel["title"]))
                {
                    selIndex = counter;
                }
                counter--;
            }
            if(selIndex != -1){
                let temp = i-1;
                while(temp >= selIndex){
                    sortedArray[temp+1] = sortedArray[temp];
                    temp --;
                }
                sortedArray[selIndex] = sel;
            }
        }
        return sortedArray;
    }

    render(){
        let container = this.renderProjectTabs();
        return(<div className = "projectDashboardLower">
                {container}
                <button className = "openAddModal" onClick={this.props.showEditProject} hidden = {this.props.action != ""}>+</button>
              </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer,
        userList: state.userListStateReducer
    }
};

export default connect(mapStateToProps,null)(ProjectContainer);

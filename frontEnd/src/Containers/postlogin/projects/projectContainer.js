//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {Card,Button} from "react-bootstrap";
import {OverlayTrigger,Tooltip} from 'react-bootstrap';

import cancel from "../../../Images/icons/cancel.png";
import edit from "../../../Images/icons/edit.png";
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
        this.dummyHandler = this.dummyHandler.bind(this);
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

    dummyHandler(event){
        event.stopPropagation();
    }

    renderProjectTabs(){
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate= currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
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
                                <img className = "profilePicture" src={photo} onClick={this.dummyHandler} onClick={this.dummyHandler}/>                                     
                            </OverlayTrigger>
                        );
                    }
                }
                const customStyles = {
                    overlay:{
                        background: 'rgba(255, 255, 255, 0.378)',
                    },
                    content : {
                      top                   : '50%',
                      left                  : '50%',
                      right                 : 'auto',
                      bottom                : 'auto',
                      heigth                : '10%',
                      marginRight           : '-50%',
                      paddingTop            : '0.8rem',
                      borderRadius          : '5px',
                      transform             : 'translate(-50%, -50%)'
                    }
                };
                let cardStatus = project.duedate > currentDate ? "Due: "+project.duedate : project.duedate == currentDate ? "Due Today" : "OverDue";
                let buttonHidden = this.state.projects[project._id] == undefined ? true : this.state.projects[project._id];
                let cardID = project.duedate < currentDate && project.status == "InProgress" ? "OverDue" : project.status;
                return(
                        <div id = {cardID} className = {project._id} onMouseOver = {this.showEdit} onMouseLeave = {this.hideEdit} onClick = {this.onClick}>
                            <h3 id="projectTitle" title={project.title} className = {project._id}>{project.title}</h3>
                            <p id="projectDescription" title={project.description} className = {project._id}>
                                {project.description}
                            </p>
                            <h6 id="projectLead" className = {project._id}>
                                Project Lead: 
                                    {
                                        this.getProfilePictures(project.projectlead).map(user => {
                                            return (<OverlayTrigger placement="right" overlay={<Tooltip><div><strong>{user.firstname+" "+user.lastname}.</strong></div></Tooltip>}>
                                                        <img className = "profilePicture" src={user.photo} onClick={this.dummyHandler}/>
                                                    </OverlayTrigger>);
                                        })
                                    }
                            </h6>
                            <h6 id="contributors" className = {project._id}>
                                Contributors: 
                                    {contributorJSX}
                                    {contributorList.length > numberOfContributors && <span className="moreContri" onClick={this.openContributorListModal}> +{contributorList.length-numberOfContributors}</span>}                              
                            </h6>
                            <p id="projectStatus" className = {project._id}>
                                {project.status == "InProgress" && <span>{cardStatus}</span>}
                                {project.status == "InProgress" || <span>{project.status}</span>}
                            </p>
                            <img hidden = {buttonHidden} onClick = {this.props.showEditProject} id = {project._id} className = "openEditModal" src = {edit}/>
                            <Modal
                            isOpen={this.state.showContributors}
                            style = {customStyles}>
                                <button className = "contriCancel" onClick={this.openContributorListModal}><img src={cancel}/></button>
                                <div className = "contributorList">
                                    {
                                        contributorList.map(contributor => {
                                            return(
                                                <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{contributor.firstname+" "+contributor.lastname}</strong>.</Tooltip>}>
                                                    <img className = "profilePicture" src={contributor.photo} onClick={this.dummyHandler}/>                                     
                                                </OverlayTrigger>
                                            )
                                        })
                                    }
                                </div>
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
        projects[event.currentTarget.className] = true;
        this.setState({projects : {...projects}}); 
    }

    showEdit(event){
        let projects = this.state.projects;
        projects[event.currentTarget.className] = false;
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

        if(orderBy == "Recently Created"){
            return sortedArray.reverse();
        }

        return sortedArray;
    }

    render(){
        let container = this.renderProjectTabs();
        return(<div className = "projectDashboardLower">
                {container}
                <Button variant="success" className = "openAddModal" onClick={this.props.showEditProject} hidden = {this.props.action != ""}>+</Button>
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

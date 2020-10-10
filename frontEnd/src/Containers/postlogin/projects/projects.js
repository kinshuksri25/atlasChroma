//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import url from 'url';

import "../../../StyleSheets/projects.css";
import {Button} from "react-bootstrap";
import FilterForm from '../../../Forms/filterForm';
import AddProject from './addProject';
import filterFormConstants from '../../../Forms/filterFormConstants';
import ProjectContainer from './projectContainer';
import EditProject from './editProject';

class Projects extends Component {

        constructor(props){
                super(props);
                this.state = {
                    search:"",
                    orderBy:"Recently Created",
                    action : ""
                };
                this.searchProject = this.searchProject.bind(this);
                this.openModal = this.openModal.bind(this);
                this.closeModal = this.closeModal.bind(this);
                this.changeOrderBy = this.changeOrderBy.bind(this);
        }

        componentDidMount(){
            let storyID = url.parse(window.location.href,true).query.storyID;
            storyID == "" && window.history.replaceState({}, "","/projects");
        }

        openModal(event){
            let clssName = event.target.className.substring(0,event.target.className.indexOf(" "));
            switch(clssName){
                case "openAddModal" :
                    this.setState({action : "ADD"}); 
                    break;
                case "openEditModal" : 
                    event.stopPropagation();
                    let editProject = {};
                    this.props.user.projects.map(project => {
                        if(project._id == event.target.id){
                            editProject = {...project};
                        }
                    });
                    this.setState({action : "EDIT",editProject}); 
                    break;                                         
            }
        }

        closeModal(){
            this.setState({action : "",editProject : {}}); 
        }

        searchProject(projectName){
            console.log(projectName);
        }
        
        changeOrderBy(event){
            this.setState({orderBy:event.target.value});
        }

        render(){
            const customStyles = {
                content : {
                  top                   : '50%',
                  left                  : '50%',
                  right                 : 'auto',
                  bottom                : 'auto',
                  width                 : '25%',
                  marginRight           : '-50%',
                  paddingTop            : '0.8rem',
                  transform             : 'translate(-50%, -50%)'
                }
            };
            return (<div className = "projectsPageContainer">
                        <div className = "projectDashboardUpperBlock">
                            <FilterForm 
                            orderBy={this.state.orderBy} 
                            searchFunction={this.searchProject}
                            changeOrderBy={this.changeOrderBy}
                            options = {filterFormConstants.projectFilter}/> 
                        </div>
                        <ProjectContainer 
                        action={this.state.action}
                        showEditProject = {this.openModal} 
                        orderBy = {this.state.orderBy}/> 
                        <Modal
                        isOpen={this.state.action != ""}
                        contentLabel=""
                        style={customStyles}>
                            {this.state.action == "ADD" && <AddProject cancel = {this.closeModal}/>}
                            {this.state.action == "EDIT" && <EditProject projectDetails = {this.state.editProject} disableProjectForm = {this.closeModal}/>}
                        </Modal>                          
                    </div>);    
        }
        
}

const mapStateToProps = (state) => {
        return {
            user: state.userStateReducer
        }
};
 
export default connect(mapStateToProps)(Projects);
//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import url from 'url';

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
                this.changeOrderBy = this.changeOrderBy.bind(this);
        }

        componentDidMount(){
            let storyID = url.parse(window.location.href,true).query.storyID;
            storyID == "" && window.history.replaceState({}, "","/projects");
        }

        openModal(event){
            event.stopPropagation();
            switch(event.target.className){
                case "openAddModal" :
                    this.setState({action : "ADD"}); 
                    break;
                case "closeAddModal" :
                    this.setState({action : ""}); 
                    break;
                case "openEditModal" : 
                    let editProject = {};
                    this.props.user.projects.map(project => {
                        if(project._id == event.target.className){
                            editProject = {...project};
                        }
                    });
                    this.setState({action : "EDIT",editProject}); 
                    break;
                case "closeEditModal" :
                    this.setState({editProject : {}, action : ""}); 
                    break;                                            
            }
        }

        searchProject(projectName){
            console.log(projectName);
        }
        
        changeOrderBy(event){
            this.setState({orderBy:event.target.value});
        }

        render(){
                return (<div>
                            <FilterForm 
                            orderBy={this.state.orderBy} 
                            searchFunction={this.searchProject}
                            changeOrderBy={this.changeOrderBy}
                            options = {filterFormConstants.projectFilter}/> 
                            <button onClick={this.openModal} hidden = {this.state.action == ""}>Add Project</button>
                            <ProjectContainer showEditProject = {this.showEditProject} orderBy = {this.state.orderBy}/> 
                            <Modal
                            isOpen={this.state.action == "ADD"}
                            contentLabel="">
                                <AddProject cancel = {this.openModal}/>
                            </Modal> 
                            <Modal
                            isOpen={this.state.action == "EDIT"}
                            contentLabel="">
                                <EditProject projectDetails = {this.state.editProject} disableProjectForm = {this.openModal}/>
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
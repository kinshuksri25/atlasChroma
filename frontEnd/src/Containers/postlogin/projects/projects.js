//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

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
                    addProject:false,
                    editProject:'',
                    hideEdit:false
                };
                this.searchProject = this.searchProject.bind(this);
                this.addProject = this.addProject.bind(this);
                this.changeOrderBy = this.changeOrderBy.bind(this);
                this.showEditProject = this.showEditProject.bind(this);
                this.hideEditProject = this.hideEditProject.bind(this);
        }

        searchProject(projectName){
            console.log(projectName);
        }

        addProject(){
            let nextBoolVal = !this.state.addProject
            this.setState({addProject:nextBoolVal});
        }
        
        changeOrderBy(event){
            this.setState({orderBy:event.target.value});
        }

        showEditProject(event){
            event.stopPropagation();
            let editProject = {};
            this.props.user.projects.map(project => {
                if(project._id == event.target.className){
                    editProject = {...project};
                }
            });
            this.setState({editProject : editProject, hideEdit : true});     
        }

        hideEditProject(){
            this.setState({editProject : {}, hideEdit : false});     
        }

        render(){
                return (<div>
                            <FilterForm 
                            orderBy={this.state.orderBy} 
                            searchFunction={this.searchProject}
                            changeOrderBy={this.changeOrderBy}
                            options = {filterFormConstants.projectFilter}/> 
                            <button onClick={this.addProject} hidden = {this.state.addProject}>Add Project</button>
                            <ProjectContainer showEditProject = {this.showEditProject} orderBy = {this.state.orderBy}/> 
                            <Modal
                            isOpen={this.state.addProject}
                            contentLabel="">
                                <AddProject cancel = {this.addProject}/>
                            </Modal> 
                            <Modal
                            isOpen={this.state.hideEdit}
                            contentLabel="">
                                <EditProject projectDetails = {this.state.editProject} disableProjectForm = {this.hideEditProject}/>
                            </Modal>                            
                        </div>);    
        }
        
}

const mapStateToProps = (state) => {
        return {
            user: state.userStateReducer
        }
};
    
const mapDispatchToProps = dispatch => {
        return {
            setUserState: (userObject) => {
                dispatch(setUserAction(userObject));
            }
        };
};
    
export default connect(mapStateToProps,mapDispatchToProps)(Projects);
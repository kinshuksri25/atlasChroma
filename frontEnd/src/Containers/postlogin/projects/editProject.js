import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import httpsMiddleware from '../../../middleware/httpsMiddleware';
import cookieManager from '../../../Components/cookieManager';
import setMsgAction from '../../../store/actions/msgActions';
import setUserAction from '../../../store/actions/userActions';
import SearchFeild from '../../../Forms/searchFeildForm';
import searchFeildConstants from '../../../Forms/searchFeildConstants';

class EditProject extends Component{
    constructor(props){
        super(props);
        this.state={
            title : this.props.projectDetails.title,
            description : this.props.projectDetails.description,
            projectleader : this.props.projectDetails.projectlead,
            contributors : this.props.projectDetails.contributors,
            disableUpdate : true,
            deleteProject : false       
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.deleteContributor = this.deleteContributor.bind(this);
        this.suggestionAllocator = this.suggestionAllocator.bind(this);
        this.createUnfilteredList = this.createUnfilteredList.bind(this);
        this.deleteProjectAlert = this.deleteProjectAlert.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
    }

    deleteProject(){
        let globalThis = this;
        let errorObject = {};
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let projectQuery = "projectID="+globalThis.props.projectDetails._id+"&contributors="+JSON.stringify(globalThis.props.projectDetails.contributors);

        httpsMiddleware.httpsRequest("/project", "DELETE", headers,projectQuery,{},function(error,responseObject) {
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.ERRORMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }else{
                let userDetails = globalThis.props.user;
                let newProjectList = [];
                globalThis.props.user.projects.map(project => {
                    if(project._id != globalThis.props.projectDetails._id){
                        newProjectList.push(project);
                    }
                });
                userDetails.projects = [...newProjectList];
                globalThis.props.setUserState(userDetails);   
                globalThis.props.disableProjectForm(); 
            }   
        });
    }

    onSubmit(){
        let globalThis = this;
        let errorObject = {};
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let projectObject = {
            projectID : globalThis.props.projectDetails._id,
            title : this.state.title,
            description : this.state.description,
            projectleader : this.state.projectleader,
            contributors : this.state.contributors,
            oldContributors : this.props.projectDetails.contributors
        };
        
        let duplicateTitle = false;
        this.props.user.projects.map(project => {
            if(project.title == this.state.title && project._id != this.props.projectDetails._id)
                duplicateTitle = true;
        });

        if(!duplicateTitle){
            httpsMiddleware.httpsRequest("/project", "PUT", headers,{...projectObject},{},function(error,responseObject) {
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                    if(error){
                        errorObject.msg = error;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }else{
                        errorObject.msg = responseObject.ERRORMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }
                }else{
                    let userDetails = globalThis.props.user;
                    userDetails.projects.map(project => {
                        if(project._id == globalThis.props.projectDetails._id){
                            project.title = globalThis.state.title;
                            project.description = globalThis.state.description;
                            project.projectlead = globalThis.state.projectleader;
                            project.contributors = globalThis.state.contributors;
                        }
                    });
                    globalThis.props.setUserState(userDetails);   
                    globalThis.props.disableProjectForm(); 
                }   
            });
        }else{
            errorObject.msg = "Duplicate title found";
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }

    }

    deleteProjectAlert(event){
        event.target.className == "deleteAlert" && this.setState({deleteProject : true});
        event.target.className == "deleteAlert" || this.setState({deleteProject : false});
    }

    deleteContributor(event){
        let errorObject = {};
        if(this.state.contributors.length == 1){
            errorObject.msg = "Contributors for the project cannot be empty";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);
        }else{
            let contributors = [...this.state.contributors];
            let newContributors = [];
            contributors.map(contributor => {
                contributor != event.target.className && newContributors.push(contributor);
            });
            if(event.target.className == this.state.projectleader){
                this.setState({projectLeader : ""});
            }
            this.setState({contributors : [...newContributors]});
        }
    }

    onChangeHandler(event){
        switch(event.target.className){
            case "projectTitle":
                this.setState({title : event.target.value});
                break;
            case "projectDescription":
                this.setState({description : event.target.value});
                break;    
        }
    }

    createUnfilteredList(){
        let userList = [...this.props.userList];
        userList.map(user => {
            user.id = user.username;
            user.title = user.firstname + " " + user.lastname;
        });
        return userList;
    }

    suggestionAllocator(selectedValue,searchBoxID){
        switch(searchBoxID){
            case "projectLead":
                let leadExists = this.state.projectLeader == selectedValue ? true : false;
                if(!leadExists){
                    this.setState({projectLeader : selectedValue});
                    this.suggestionAllocator(selectedValue,"contributors");
                }
                break;
            case "contributors":
                let contributor = [...this.state.contributors];
                let contributorExists = contributor.find(el => el == selectedValue) != undefined ? true : false;
                if(!contributorExists){
                    contributor.push(selectedValue);
                }else{
                    let errorMsg = selectedValue == this.state.projectLeader ? "ProjectLeader is already a contributor" : "The contributor has already been added";
                    errorObject.msg = errorMsg;
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);
                }
                this.setState({contributors : contributor});
                break;    
        }
    }

    render(){
        let disableUpdate = this.state.title != this.props.projectDetails.title || 
                                this.state.description != this.props.projectDetails.description || 
                                    this.state.projectleader != this.props.projectDetails.projectlead ||
                                    JSON.stringify(this.state.contributors) != JSON.stringify(this.props.projectDetails.contributors) && 
                                        (this.state.title != "" && this.state.description != "" && this.state.projectleader != "")  ? false : true;
        let editProjectJSX = this.state.deleteProject ? <div>
                                                            <h3>Do you want to delete {this.props.projectDetails.title} ? </h3>
                                                            <button onClick = {this.deleteProject}>Yes</button>
                                                            <button className = "deleteNo" onClick = {this.deleteProjectAlert}>No</button>
                                                        </div> 
                                                        : <div className = "editProject">
                                                                <input type = "text" value = {this.state.title} className = "projectTitle" onChange = {this.onChangeHandler}/>
                                                                <input type = "text" value = {this.state.description} className = "projectDescription" onChange = {this.onChangeHandler}/>
                                                                <SearchFeild unfilteredList = {this.createUnfilteredList()} constants = {searchFeildConstants.addProject} onSuggestionClick = {this.suggestionAllocator}/>
                                                                <ul className = "contributorList">
                                                                    {
                                                                        this.state.contributors.map( contributor => {
                                                                            return(<li onClick={this.deleteContributor} className={contributor}>{contributor}</li>);
                                                                        })
                                                                    }
                                                                </ul>
                                                                <button disabled = {disableUpdate} onClick = {this.onSubmit}>Update</button>
                                                                <button onClick = {this.props.disableProjectForm}>Back</button>
                                                                <button className = "deleteAlert" onClick = {this.deleteProjectAlert}>Delete</button>
                                                            </div>                            
        return (<div>{editProjectJSX}</div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer,
        userList: state.userListStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(EditProject); 
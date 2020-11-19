import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DateHelper from "../../generalContainers/date";
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import cookieManager from '../../../Components/cookieManager';
import setMsgAction from '../../../store/actions/msgActions';
import SearchFeild from '../../../Forms/searchFeildForm';
import searchFeildConstants from '../../../Forms/searchFeildConstants';
import {EMSG,SMSG,urls} from '../../../../../lib/constants/contants';

class EditProject extends Component{
    constructor(props){
        super(props);
        this.state={
            statusList : ["OnHold","InProgress","Finished"],
            title : this.props.projectDetails.title,
            description : this.props.projectDetails.description,
            projectleader : this.props.projectDetails.projectlead,
            contributors : this.props.projectDetails.contributors,
            duedate : this.props.projectDetails.duedate,
            status : this.props.projectDetails.status,
            disableUpdate : true,
            isOpen : false       
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
        let projectQuery = "projectID="+globalThis.props.projectDetails._id;
        globalThis.props.disableProjectForm(); 
        httpsMiddleware.httpsRequest("/project", "DELETE", headers,projectQuery,function(error,responseObject) {
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    errorObject.msg = EMSG.CLI_QURY_BCKDWN;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                    window.history.pushState({},"",urls.LOGOUT);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            } 
        });
    }

    onSubmit(){
        let globalThis = this;
        let errorObject = {};
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let projectObject = {
            projectID : globalThis.props.projectDetails._id,
            oldContributors : this.props.projectDetails.contributors,
            oldTitle : this.props.projectDetails.title,
            projectLeadEmails : []
            
        };

        if(this.state.title != this.props.projectDetails.title){
            projectObject.title = this.state.title;
        }if(this.state.description != this.props.projectDetails.description){
            projectObject.description = this.state.description;
        }if(this.state.projectleader != this.props.projectDetails.projectlead){
            this.props.userList.map(user => {
                if(user.username == this.state.projectleader || user.username == this.props.projectDetails.projectlead){
                    console.log(user.email);
                    projectObject.projectLeadEmails.push(user.email);
                }
            });
            projectObject.projectleader = this.state.projectleader;

        }if(JSON.stringify(this.state.contributors) != JSON.stringify(this.props.projectDetails.contributors)){
            projectObject.contributors = this.state.contributors;
        }if(this.state.status != this.props.projectDetails.status){
            projectObject.status = this.state.status;
        }if(this.state.duedate != this.props.projectDetails.duedate){  
            projectObject.duedate = this.state.duedate;
        }
        
        let duplicateTitle = false;
        this.props.user.projects.map(project => {
            if(project.title == this.state.title && project._id != this.props.projectDetails._id)
                duplicateTitle = true;
        });
        globalThis.props.disableProjectForm(); 
        if(!duplicateTitle){
            httpsMiddleware.httpsRequest("/project", "PUT", headers,{...projectObject},function(error,responseObject) {
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                    if(error){
                        errorObject.msg = EMSG.CLI_QURY_BCKDWN;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                        window.history.pushState({},"",urls.LOGOUT);
                    }else{
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }
                } 
            });
        }else{
            errorObject.msg = EMSG.CLI_PRJ_UPDERR;
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }

    }

    deleteProjectAlert(event){
        event.target.className == "deleteAlert" && this.setState({isOpen : true});
        event.target.className == "deleteAlert" || this.setState({isOpen : false});
    }

    deleteContributor(event){
        let errorObject = {};
        if(this.state.contributors.length == 1){
            errorObject.msg = "Contributors for the project cannot be empty";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);
        }else{
           if(event.target.className != this.state.projectleader){
            let contributors = [...this.state.contributors];
            let newContributors = [];
            contributors.map(contributor => {
                contributor != event.target.className && newContributors.push(contributor);
            });
            this.setState({contributors : [...newContributors]});
           }else{
            errorObject.msg = "Connot delete projectleader directly from the contributor list.";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject); 
           }
        }
    }

    onChangeHandler(event){
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentMonth = parseInt(currentDateObject.month)+1;
        let currentDate= currentDateObject.year+"-"+currentMonth+"-"+currentDateObject.date;
        let errorObject = {};
        switch(event.target.className){
            case "projectTitle":
                this.setState({title : event.target.value});
                break;
            case "projectDescription":
                this.setState({description : event.target.value});
                break;   
            case "duedate":
                let isdueDateChangeAllowed = true;
                this.props.projectDetails.storydetails.map(story => {
                    isdueDateChangeAllowed = story.duedate >= event.target.value ? false : isdueDateChangeAllowed;
                });
                if(isdueDateChangeAllowed){
                    if(event.target.value > currentDate){
                        this.setState({duedate : event.target.value});
                    }else{
                        errorObject.msg = "Invalid date selected";
                        errorObject.status = "ERROR";
                        this.props.setMsgState(errorObject);
                    }
                }else{
                    errorObject.msg = "unable to change the duedate, as some of the stories have a duedate more than the actual project deadline";
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);
                }
                break;
            case "status":
                let statusChangeValid = true;
                this.props.projectDetails.storydetails.map(story => {
                    statusChangeValid = story.status != "Finished" ? false : statusChangeValid;
                });
                if(statusChangeValid){
                    this.setState({status : event.target.value});
                }else{
                    errorObject.msg = "unable to mark the project as finished, as some of the stories are currently open";
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);
                }
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
                let leadExists = this.state.projectleader == selectedValue ? true : false;
                if(!leadExists){
                    this.setState({projectleader : selectedValue});
                    this.suggestionAllocator(selectedValue,"contributors");
                }
                break;
            case "contributors":
                let contributor = [...this.state.contributors];
                let contributorExists = contributor.find(el => el == selectedValue) != undefined ? true : false;
                if(!contributorExists){
                    contributor.push(selectedValue);
                }else{
                    let EMSG = selectedValue == this.state.projectleader ? EMSG.CLI_PRJ_UPPRJLDR : EMSG.CLI_PRJ_UPCNERR;
                    errorObject.msg = EMSG;
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
                                        this.state.duedate != this.props.projectDetails.duedate ||
                                            this.state.status != this.props.projectDetails.status || 
                                                JSON.stringify(this.state.contributors) != JSON.stringify(this.props.projectDetails.contributors) && 
                                                (this.state.title != "" && this.state.description != "" && this.state.projectleader != "")  ? false : true;
        let disableSearch = this.props.user.username == this.props.projectDetails.projectlead ? false : true;                                        

        return (<div>     
                    <div className = "editProject">
                        <input disabled={this.props.user.username != this.props.projectDetails.projectlead} type = "text" value = {this.state.title} className = "projectTitle" onChange = {this.onChangeHandler}/>
                        <input disabled={this.props.user.username != this.props.projectDetails.projectlead} type = "text" value = {this.state.description} className = "projectDescription" onChange = {this.onChangeHandler}/>
                        <SearchFeild disableInputs={disableSearch} unfilteredList = {this.createUnfilteredList()} constants = {searchFeildConstants.addProject} onSuggestionClick = {this.suggestionAllocator}/>
                        <ul className = "contributorList">
                            {
                                this.state.contributors.map( contributor => {
                                    return(<li onClick={this.props.user.username != this.props.projectDetails.projectlead || this.deleteContributor} className={contributor}>{contributor}</li>);
                                })
                            }
                        </ul>
                        <input disabled={this.props.user.username != this.props.projectDetails.projectlead} type ="date" value = {this.state.duedate} className = "duedate" onChange = {this.onChangeHandler}/>
                        <select disabled={this.props.user.username != this.props.projectDetails.projectlead} className = "status" onChange = {this.onChangeHandler}>
                            {
                                this.state.statusList.map(status => {
                                    if(this.state.status == status)
                                        return (<option value = { status } selected>{status}</option>);
                                    else
                                        return (<option value = { status }>{status}</option>);
                                })
                            }
                         </select>
                        <button hidden = {this.props.user.username != this.props.projectDetails.projectlead} disabled = {disableUpdate} onClick = {this.onSubmit}>Update</button>
                        <button className = "closeEditModal" onClick = {this.props.disableProjectForm}>Back</button>
                        <button hidden = {this.props.user.username != this.props.projectDetails.projectlead} className = "deleteAlert" onClick = {this.deleteProjectAlert}>Delete</button>
                    </div> 
                    <Modal
                    isOpen={this.state.isOpen}
                    contentLabel="">   
                        <h3>Do you want to delete {this.props.projectDetails.title} ? </h3>
                        <button onClick = {this.deleteProject}>Yes</button>
                        <button className = "deleteNo" onClick = {this.deleteProjectAlert}>No</button>
                    </Modal>                                                
                </div>);
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
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(EditProject); 
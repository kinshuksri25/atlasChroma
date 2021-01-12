import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import Modal from 'react-modal';
import cancel from "../../../Images/icons/cancel.png";
import {Form,Button} from "react-bootstrap";

import "../../../StyleSheets/editProject.css";
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
            isOpen : false,
            projectLeadDetails:{},
            contributorDetails:[]      
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.updateFeilds = this.updateFeilds.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.deleteContributor = this.deleteContributor.bind(this);
        this.suggestionAllocator = this.suggestionAllocator.bind(this);
        this.createUnfilteredList = this.createUnfilteredList.bind(this);
        this.deleteProjectAlert = this.deleteProjectAlert.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.checkStatus = this.checkStatus.bind(this);
    }

    componentDidMount(){
        this.updateFeilds();
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
                    window.history.pushState({},"",urls.LOGOUT);
                }
            } 
        });
    }

    checkStatus(){
        let storyStatus = true;
        this.props.projectDetails.storydetails.map(story => {
            storyStatus = story.status != "Finished" ? false : storyStatus;
        });

        return storyStatus;
    }

    onSubmit(){
        let validStatus = true;
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
            projectObject.oldlead = this.props.projectDetails.projectlead;
            this.props.userList.map(user => {
                if(user.username == this.state.projectleader || user.username == this.props.projectDetails.projectlead){
                    projectObject.projectLeadEmails.push(user.email);
                }
            });
            projectObject.projectleader = this.state.projectleader;

        }if(JSON.stringify(this.state.contributors) != JSON.stringify(this.props.projectDetails.contributors)){
            projectObject.contributors = this.state.contributors;
        }if(this.state.status != this.props.projectDetails.status){
            console.log(this.state.status);
            validStatus = this.state.status == "Finished" ? this.checkStatus() : true;
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
        if(!duplicateTitle && validStatus){
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
                        window.history.pushState({},"",urls.LOGOUT);
                    }
                } 
            });
        }else{
            if(duplicateTitle){
                errorObject.msg = EMSG.CLI_PRJ_UPDERR;
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }
            if(!validStatus){
                errorObject.msg = "Cannot update the story status to Finished as some stories are still incomplete";
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }
        }

    }

    deleteProjectAlert(event){
        event.target.id == "deleteAlert" && this.setState({isOpen : true});
        event.target.id == "deleteAlert" || this.setState({isOpen : false});
    }

    deleteContributor(username){
        let errorObject = {};
        if(this.state.contributors.length == 1){
            errorObject.msg = "Contributors for the project cannot be empty";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);
        }else{
           if(username!= this.state.projectleader){
            let contributors = [...this.state.contributors];
            let newContributors = [];
            contributors.map(contributor => {
                contributor != username && newContributors.push(contributor);
            });
            this.setState({contributors : [...newContributors]},()=>{
                this.updateFeilds();
            });
           }else{
            errorObject.msg = "Connot delete projectleader directly from the contributor list.";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject); 
           }
        }
    }

    onChangeHandler(event){
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate= currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        let errorObject = {};
        switch(event.currentTarget.id){
            case "projectTitle":
                this.setState({title : event.target.value});
                break;
            case "projectDesc":
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
                this.setState({status : event.target.value});
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
        let errorObject = {};
        switch(searchBoxID){
            case "projectLead":
                let leadExists = this.state.projectleader == selectedValue ? true : false;
                if(!leadExists){
                    this.setState({projectleader : selectedValue},()=>{
                        this.updateFeilds();
                    });
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
                this.setState({contributors : contributor},()=>{
                    this.updateFeilds();
                });
                break;    
        }
    }

    updateFeilds(){
        let prepContributors = [];
        let prepProjectLeader = {};
        this.props.userList.map(user => {
            if(user.username == this.state.projectleader){
                let tempUser = {...user};
                tempUser.id = tempUser.username;
                tempUser.tooltip = tempUser.firstname+" "+tempUser.lastname;
                tempUser.title = tempUser.tooltip;
                prepProjectLeader = {...tempUser};
            }
            if(this.state.contributors.indexOf(user.username) >=0){
                let tempUser = {...user};
                tempUser.id = tempUser.username;
                tempUser.tooltip = tempUser.firstname+" "+tempUser.lastname;
                tempUser.title = tempUser.tooltip;
                prepContributors.push({...tempUser});
            }
        });
        this.setState({"contributorDetails" : [...prepContributors],"projectLeadDetails" : {...prepProjectLeader}});
    }

    render(){
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              paddingTop            : '1.8rem',
              borderRadius          : '8px',
              transform             : 'translate(-50%, -50%)'
            }
        };
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
                        <button className = "addCancel" onClick = {this.props.disableProjectForm}><img src={cancel}/></button>
                        <Form.Group>
                            <Form.Control disabled={this.props.user.username != this.props.projectDetails.projectlead} type = "text" value = {this.state.title} id="projectTitle" onChange = {this.onChangeHandler}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control disabled={this.props.user.username != this.props.projectDetails.projectlead} rows="4" as = "textarea" value = {this.state.description} id="projectDesc" onChange = {this.onChangeHandler}/>
                        </Form.Group>
                        
                        { this.state.contributorDetails.length !=0 &&  <SearchFeild feilds={{"projectLeadName":{...this.state.projectLeadDetails},"contributorList":[...this.state.contributorDetails]}} 
                                                                        disableInputs={disableSearch}
                                                                        onRemoveClick = {this.deleteContributor} 
                                                                        unfilteredList = {this.createUnfilteredList()} 
                                                                        constants = {searchFeildConstants.addProject} 
                                                                        onSuggestionClick = {this.suggestionAllocator}/>}
                        <Form.Group>
                            <Form.Control disabled={this.props.user.username != this.props.projectDetails.projectlead} type ="date" value = {this.state.duedate} id="duedate"onChange = {this.onChangeHandler}/>
                        </Form.Group>                                                                          
                        <Form.Group>
                            <Form.Control as="select" disabled={this.props.user.username != this.props.projectDetails.projectlead} id = "status" onChange = {this.onChangeHandler}>
                                {
                                    this.state.statusList.map(status => {
                                        if(this.state.status == status)
                                            return (<option value = { status } selected>{status}</option>);
                                        else
                                            return (<option value = { status }>{status}</option>);
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                        <Button variant="warning" hidden = {this.props.user.username != this.props.projectDetails.projectlead} id="updateProjectButton" disabled = {disableUpdate} onClick = {this.onSubmit}>Update</Button>
                        <Button variant="danger" hidden = {this.props.user.username != this.props.projectDetails.projectlead} id = "deleteAlert" onClick = {this.deleteProjectAlert}>Delete</Button>
                    </div> 
                    <Modal
                    isOpen={this.state.isOpen}
                    contentLabel=""
                    style={customStyles}>   
                        <button id="deleteNo" className = "addCancel" onClick = {this.deleteProjectAlert}><img src={cancel}/></button>
                        <h3 className="projectDeleteConfirm">Do you want to delete<br/> {this.props.projectDetails.title}? </h3>
                        <Button variant="danger" className="projectDel" onClick = {this.deleteProject}>Delete</Button>
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
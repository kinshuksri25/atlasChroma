import React,{ Component } from "react";
import { connect } from 'react-redux';

import cancel from "../../../Images/icons/cancel.png";
import DateHelper from "../../generalContainers/date";
import "../../../StyleSheets/addProject.css"
import cookieManager from '../../../Components/cookieManager';
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import formConstants from '../../../Forms/formConstants';
import searchFeildConstants from '../../../Forms/searchFeildConstants';
import {EMSG,urls} from '../../../../../lib/constants/contants';
import setMsgAction from '../../../store/actions/msgActions';
import {msgObject} from '../../../../../lib/constants/storeConstants';
import SimpleForm from '../../../Forms/simpleform';
import SearchFeild from '../../../Forms/searchFeildForm';

class AddProject extends Component{

    constructor(props){
        super(props);
        this.state = {
            contributors:[],
            projectLeader:"",
            projectExists:true,
            prepContributors:[],
            prepProjectLeader:{}
        };
        this.titleChecker = this.titleChecker.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.suggestionAllocator = this.suggestionAllocator.bind(this);
        this.createUnfilteredList = this.createUnfilteredList.bind(this);
        this.prepList = this.prepList.bind(this);
    }

    createUnfilteredList(){
        let userList = [...this.props.userList];
        userList.map(user => {
            user.id = user.username;
            user.title = user.firstname + " " + user.lastname;
        });
        return userList;
    }

    onRemoveClick(username){
        let errorObject = {};
        if(this.state.contributors.length == 1){
            errorObject.msg = "Contributors for the project cannot be empty";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);
        }else{
           if(username!= this.state.projectLeader){
            let contributors = [...this.state.contributors];
            let newContributors = [];
            contributors.map(contributor => {
                contributor != username && newContributors.push(contributor);
            });
            this.setState({contributors : [...newContributors]},()=>{
                this.prepList();
            });
           }else{
            errorObject.msg = "Connot delete projectleader directly from the contributor list.";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject); 
           }
        }
    }

    suggestionAllocator(selectedValue,searchBoxID){
        let errorObject = {};
        switch(searchBoxID){
            case "projectLead":
                let leadExists = this.state.projectLeader == selectedValue ? true : false;
                if(!leadExists){
                    this.setState({projectLeader : selectedValue},()=>{
                        this.prepList();
                    });
                    this.suggestionAllocator(selectedValue,"contributors");
                }
                break;
            case "contributors":
                let contributor = this.state.contributors;
                let contributorExists = contributor.find(el => el == selectedValue) != undefined ? true : false;
                if(!contributorExists){
                    contributor.push(selectedValue);
                }else{
                    let EMSG = selectedValue == this.state.projectLeader ? "ProjectLeader is already a contributor" : "The contributor has already been added";
                    errorObject.msg = EMSG;
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);
                }
                this.setState({contributors : contributor},()=>{
                    this.prepList();
                });
                break;    
        }
    }

    titleChecker(projectName){
        let found = false;
        this.props.user.projects.map(project => {
            if(project.title == projectName){
                found = true;
            }
        });
        found && this.setState({projectExists : true});
        found || this.setState({projectExists : false});
    }
    
    onSubmitHandler(formObject){
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate= currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let globalThis = this;
        let errorObject = {...msgObject};
        let formData = formObject.formData;
        console.log(formData.DueDate);
        console.log(currentDate);
        if(this.state.contributors.length != 0 && this.state.projectLeader != "" && !this.state.projectExists && formData.DueDate > currentDate){
            formData.title = formData.Title;
            formData.description = formData.Description;
            formData.contributors = this.state.contributors;
            formData.projectleader = this.state.projectLeader;
            formData.duedate = formData.DueDate;
            delete formData.Description;
            delete formData.Title;
            delete formData.DueDate;
            globalThis.props.cancel();
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers,formData,function(error,responseObject){
                if(error || (responseObject.STATUS != 200 && responseObject.STATUS !=201)){
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
            errorObject.msg = EMSG.CLI_MID_INVMET;
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
    }

    prepList(){
        let prepContributors = [];
        let prepProjectLeader = {};
        this.props.userList.map(user => {
            if(user.username == this.state.projectLeader){
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
        this.setState({"prepContributors" : [...prepContributors],"prepProjectLeader" : {...prepProjectLeader}});
    }

    render(){
        return(<div className = "addprojectContainer">
                <button className = "addCancel" onClick={this.props.cancel}><img src={cancel}/></button>
                <SearchFeild feilds={{"projectLeadName":{...this.state.prepProjectLeader},"contributorList":[...this.state.prepContributors]}} 
                onRemoveClick = {this.onRemoveClick}
                unfilteredList = {this.createUnfilteredList()} 
                constants = {searchFeildConstants.addProject} 
                onSuggestionClick = {this.suggestionAllocator}/>
                <SimpleForm formAttributes = { formConstants.addProject }
                    changeHandler = { this.titleChecker }
                    submitHandler = { this.onSubmitHandler }
                    changeFieldNames = {["Title"]}/>
               </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer,
        userList: state.userListStateReducer
    }
};

const mapDispatchToProps = (dispatch) => {
    return{      
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(AddProject);

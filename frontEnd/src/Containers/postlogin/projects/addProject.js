import React,{ Component } from "react";
import { connect } from 'react-redux';

import "../../../StyleSheets/addProject.css"
import cookieManager from '../../../Components/cookieManager';
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import formConstants from '../../../Forms/formConstants';
import searchFeildConstants from '../../../Forms/searchFeildConstants';
import {EMSG} from '../../../../../lib/constants/contants';
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
            projectExists:true
        };
        this.titleChecker = this.titleChecker.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.suggestionAllocator = this.suggestionAllocator.bind(this);
        this.createUnfilteredList = this.createUnfilteredList.bind(this);
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
        let index = 0;
        let valueArray = [...this.state.contributors];
        valueArray.map(value =>{
            if(username == value){
                valueArray.splice(index,1);
            }else{index++;}
        });
        this.setState({contributors : [...valueArray]});
    }

    suggestionAllocator(selectedValue,searchBoxID){
        let errorObject = {};
        switch(searchBoxID){
            case "projectLead":
                let leadExists = this.state.projectLeader == selectedValue ? true : false;
                if(!leadExists){
                    this.setState({projectLeader : selectedValue});
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
                this.setState({contributors : contributor});
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
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let globalThis = this;
        let errorObject = {...msgObject};
        let formData = formObject.formData;
        if(this.state.contributors.length != 0 && this.state.projectLeader != "" && this.state.projectExists){
            formData.title = formData.Title;
            formData.description = formData.Description;
            formData.contributors = this.state.contributors;
            formData.projectleader = this.state.projectLeader;
            delete formData.Description;
            delete formData.Title;
            globalThis.props.cancel();
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers,formData,function(error,responseObject){
                if(error || (responseObject.STATUS != 200 && responseObject.STATUS !=201)){
                    if(error){
                        errorObject.msg = error;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }else{
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }
                }
            });
        }else{
            errorObject.msg = EMSG.CLI_MID_INVMET;
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
    }

    render(){
        return(<div className = "addprojectContainer">
                <button className = "closeAddModal" onClick={this.props.cancel}>X</button>
                <SearchFeild 
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

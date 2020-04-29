import React,{ Component } from "react";
import { connect } from 'react-redux';

import setUserAction from '../../../store/actions/userActions';
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
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.suggestionAllocator = this.suggestionAllocator.bind(this);
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
                let contributor = this.state.contributors;
                let contributorExists = contributor.find(el => el == selectedValue) != undefined ? true : false;
                if(!contributorExists){
                    contributor.push(selectedValue);
                }
                this.setState({contributors : contributor});
                break;    
        }
    }

    onChangeHandler(projectName){
        let found = false;
        this.props.user.projects.map(project => {
            if(project.name == projectName){
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
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers,formData,function(error,responseObject){
                if(error || (responseObject.STATUS != 200 && responseObject.STATUS !=201)){
                    if(error){
                        errorObject.msg = error;
                        errorObject.status = "ERROR";
                        setMsgState(errorObject);
                    }else{
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        setMsgState(errorObject);
                    }
                }else{
                     let userStateObject = {...globalThis.props.user};
                     userStateObject.projects.push({...responseObject.PAYLOAD});
                     globalThis.props.setUserState(userStateObject);
                }
            });
        }else{
            errorObject.msg = EMSG.CLI_MID_INVMET;
            errorObject.status = "ERROR";
            setMsgState(errorObject);
        }
    }

    render(){
        return(<div>
                <SearchFeild unfilteredList = {this.createUnfilteredList()} constants = {searchFeildConstants.addProject} onSuggestionClick = {this.suggestionAllocator}/>
                <SimpleForm formAttributes = { formConstants.addProject }
                    changeHandler = { this.onChangeHandler }
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
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },       
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(AddProject);

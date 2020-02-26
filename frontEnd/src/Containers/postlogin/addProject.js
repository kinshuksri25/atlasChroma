import React,{ Component } from "react";
import { connect } from 'react-redux';

import setUserAction from '../../store/actions/userActions';
import localSession from '../../Components/sessionComponent';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import formConstants from '../../Forms/formConstants';
import searchFeildConstants from '../../Forms/searchFeildConstants';
import SimpleForm from '../../Forms/simpleform';
import SearchFeild from '../../Forms/searchFeildForm';

class AddProject extends Component{

    constructor(props){
        super(props);
        this.state = {
            contributors:[],
            projectLeader:""
        };
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.projectLeadAllocator = this.projectLeadAllocator.bind(this);
        this.contributorAllocator = this.contributorAllocator.bind(this);
    }

    projectLeadAllocator(userName){
        let leadExists = this.state.projectLeader == userName ? true : false;
        if(!leadExists){
            this.setState({projectLeader : userName});
            this.contributorAllocator(userName);
        }
    }

    contributorAllocator(userName){
        let contributor = this.state.contributors;
        let contributorExists = contributor.find(el => el == userName) != undefined ? true : false;
        if(!contributorExists){
            contributor.push(userName);
        }
        this.setState({contributors : contributor});
    }

    onChangeHandler(event){
        console.log(event);
    }

    onSubmitHandler(formObject){
        let headers = {};
        let globalThis = this;
        let formData = formObject.formData;
        if(this.state.contributors.length != 0 && this.state.projectLeader != "" && formData.ProjectType != ""){
            formData.contributors = this.state.contributors;
            formData.projectLeader = this.state.projectLeader;
            formData.sessionID = localSession.getSessionObject().sessionID;
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers,formData,function(error,responseObject){
                if(error || responseObject.Status == "ERROR"){
                    if(error){
                        console.log(error);
                        //TODO --> errormsg div(ERR_CONN_SERVER)
                    }else{
                        //TODO --> errormsg div(errorMsg)
                    }
                 }else{
                     let userStateObject = {...globalThis.props.user};
                     userStateObject.Projects = responseObject.payload;
                     globalThis.props.setUserState(userStateObject);
                 }
            });
        }else{
            //TODO --> empty feilds in the add project form
            console.log("Empty feilds in the add project form");
        }
    }

    render(){
        return(<div>
                <SearchFeild list= {this.props.userList} constants= {searchFeildConstants.ProjectLead} onSuggestionClick = {this.projectLeadAllocator}/>
                <SearchFeild list= {this.props.userList} constants= {searchFeildConstants.Contributors} onSuggestionClick = {this.contributorAllocator}/>
                <SimpleForm formAttributes = { formConstants.addProject }
                    changeHandler = { this.onChangeHandler }
                    submitHandler = { this.onSubmitHandler }
                    changeFieldNames = {["Title"]}
                    options = {["Project Type","Simple","Agile"]} />
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
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(AddProject);
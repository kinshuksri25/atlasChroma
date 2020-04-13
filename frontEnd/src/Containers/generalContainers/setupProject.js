//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import SimpleForm from '../../Forms/simpleform';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import formConstants from '../../Forms/formConstants';
import EditableForm from '../../Forms/editableForms';
import setUserAction from '../../store/actions/userActions';
import cookieManager from '../../Components/cookieManager';
import editableConstants from '../../Forms/editableFormConstants';

class SetupProject extends Component {

    constructor(props){
        super(props);
        this.state = {
            boarddetails : {},
            nextPage : false,
            loadedTemplate : [],
            currentTemplate: "" 
        };
        this.formBuilder = this.formBuilder.bind(this);
        this.changePage = this.changePage.bind(this);
        this.setLoadedTemplate = this.setLoadedTemplate.bind(this);
        this.onTemplateSubmit = this.onTemplateSubmit.bind(this);
        this.randValueGenerator = this.randValueGenerator.bind(this);
        
    }
    
    componentDidMount(){ 
        this.setState({boarddetails:this.props.projectObject.boarddetails});
    }

    formBuilder(){
        if(!this.state.nextPage){
           return(<SimpleForm formAttributes = { formConstants.boardTemplateSelector }
                    submitHandler = { this.changePage }
                    options = {[["Template Type","SIMPLE","SDLC","MANUFACTURING","CUSTOM"]]}
                    changeFieldNames = {[]} />);     
        }else{
            let constants = [];
            switch(this.state.currentTemplate){
                case "SIMPLE" : 
                    constants = editableConstants.SIMPLE;
                    break;
                case "SDLC" : 
                    constants = editableConstants.SDLC;
                    break;
                case "MANUFACTURING" : 
                    constants = editableConstants.MANUFACTURING;
                    break;
                case "CUSTOM" : 
                    constants = editableConstants.CUSTOM;
                    break;    
            }
            constants.map(constant => {
                constant.WIP = constant.WIP ? this.props.projectObject.contributors.length + 2 : false;
                constant._id = this.randValueGenerator();
                   
            });
            return(<div>
                      <EditableForm template={constants} setLoadedTemplate = {this.setLoadedTemplate} randValueGenerator ={this.randValueGenerator()} mouseover = {editableConstants.MOUSEOVEREVENTS}/>
                      <button onClick={this.changePage}>Back</button>
                    </div>);
        }
    }

    setLoadedTemplate(template){
        this.setState({loadedTemplate : template});
    }

    onTemplateSubmit(event){
        let globalThis = this;
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        httpsMiddleware.httpsRequest("/project", "PUT", headers,{boarddetails : [...globalThis.state.loadedTemplate],projectID : globalThis.props.projectObject._id}, function(error,responseObject) {
            if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                if(error){
                    console.log(error);
                    //TODO --> errormsg div(ERR_CONN_SERVER)
                }else{
                    //TODO --> errormsg div(errorMsg)
                }
            }else{
                let userDetails = globalThis.props.user;
                userDetails.projects.map(project => {
                    if(project._id == globalThis.props.projectObject._id){
                        project.boarddetails.boardTemplate = globalThis.state.loadedTemplate;
                    }
                });
                globalThis.props.setUserState(userDetails);
                let projectObject =  {...globalThis.props.projectObject};
                projectObject.boarddetails.templatedetails =  globalThis.state.loadedTemplate;
                globalThis.props.updateCurrentProject(projectObject);       
            }   
        });
    }

    changePage(formObject){
        if(formObject.hasOwnProperty("formData")){
            if(formObject.formData.TemplateType != ""){
                let templateType = formObject.formData.TemplateType;
                this.setState({nextPage : true, currentTemplate: templateType});   
            }else{
                //TODO --> this needs to be added to error constants
                console.log("template type cannot be left empty");
            }
        }
        else
            this.setState({nextPage : false, currentTemplate: ""});   
    }

    randValueGenerator(valueLength = 10){
        let randomValue = "";
        let saltString = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
        let i = 0;
        while(i<=valueLength){
          randomValue += saltString[Math.floor((Math.random() * saltString.length))];
          i++;
        }
        return randomValue;
    }

    render(){
        let setupContainer = this.formBuilder();
        return(<div>
                {setupContainer}
                <button onClick={this.onTemplateSubmit} disabled={this.state.currentTemplate == "" ? true : this.state.loadedTemplate.length ==0 ? true : false}>Go</button>
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

export default connect(mapStateToProps,mapDispatchToProps)(SetupProject);

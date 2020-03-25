//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";

import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';
import EditableForm from '../../Forms/editableForms';
import editableConstants from '../../Forms/editableFormConstants';

export default class SetupProject extends Component {

    constructor(props){
        super(props);
        this.state = {
            boarddetails : {},
            nextPage : false,
            currentTemplate: "" 
        };
        this.formBuilder = this.formBuilder.bind(this);
        this.changePage = this.changePage.bind(this);
    }
    
    componentDidMount(){
        if(this.props.projectObject.boarddetails != undefined) 
        this.setState({boarddetails:this.props.projectObject.boarddetails});
    }

    formBuilder(){
        if(!this.state.nextPage){
           return(<SimpleForm formAttributes = { formConstants.boardTemplateSelector }
                    submitHandler = { this.changePage }
                    options = {["Template Type","SIMPLE","SDLC","MANUFACTURING","CUSTOM"]}
                    changeFieldNames = {[]} />);     
        }else{
            let constants = [];
            switch(this.state.currentTemplate){
                case "SIMPLE" : 
                    constants = editableConstants.SIMPLE;
                    constants.map(constant => {
                        constant.WIP = constant.WIP ? this.props.projectObject.contributors.length + 2 : false;   
                    });
                    break;
                default :
                    break;            
            }
            return(<div>
                      <EditableForm template={constants} openFormPanel={this.openFormPanel}/>
                      <button onClick={this.changePage}>Back</button>
                    </div>);
        }
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

    render(){
        let setupContainer = this.formBuilder();
        return(<div>
                {setupContainer}
               </div>);
    }
}
 

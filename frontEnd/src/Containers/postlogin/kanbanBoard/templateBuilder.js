import React,{ Component } from "react";
import { connect } from 'react-redux';

import Modal from 'react-modal';
import "../../../StyleSheets/templateBuilder.css";
import {EMSG} from "../../../../../lib/constants/contants"; 
import setMsgAction from '../../../store/actions/msgActions';

class TemplateBuilder extends Component {
    
    constructor(props){
        super(props);
        this.state ={
            loadedTemplate : [...this.props.template],
            formData : {NAME : "",
                        WIP : false,
                        PHASE:"Phase",
                        EXTENDS:""},
            currentAction : "",
            isFeildDisabled : true,
            editForm : true,
            isSubPhase : true,
            disableWIP : false
        };
        this.getStyle = this.getStyle.bind(this);
        this.addPhase = this.addPhase.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.submitPhase = this.submitPhase.bind(this);
        this.formBuilder = this.formBuilder.bind(this);
        this.hideChildren = this.hideChildren.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.mouseOverClick = this.mouseOverClick.bind(this);
        this.toggleChildren = this.toggleChildren.bind(this);
        this.groupTemplates = this.groupTemplates.bind(this);
        this.getSinglePhase = this.getSinglePhase.bind(this);
        this.mouseOverButton = this.mouseOverButton.bind(this);
        this.mouseLeaveButton = this.mouseLeaveButton.bind(this);
        this.onPhaseOptionChange = this.onPhaseOptionChange.bind(this);
    }

    componentDidMount(){
        this.props.setLoadedTemplate(this.state.loadedTemplate);
    }

    getStyle(el,styleProp)
{
	var x = document.getElementById(el);
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}

    formBuilder(){
        let groupedTemplate = this.groupTemplates();
        let template = "";
        template = groupedTemplate.map(group => {
            let groupTemp = group.map(element => {
                                if(element.EXTENDS != "" && JSON.stringify(element.CHILDREN) == JSON.stringify([])){
                                    let childMargin = parseInt(this.getStyle(element.EXTENDS,"margin-left").substring(0,this.getStyle(element.EXTENDS,"margin-left").length-2)) + 14;
                                    childMargin += "px";
                                    return (<div className="columnName">
                                                <span style={{marginLeft:childMargin}} id = {element.NAME} className={element.EXTENDS} hidden={true} onMouseLeave={this.mouseLeaveButton} onMouseEnter={this.mouseOverButton}>{element.NAME}</span>
                                            </div>);
                                }else if(JSON.stringify(element.CHILDREN) != JSON.stringify([]) && element.EXTENDS != ""){
                                    let childMargin = parseInt(this.getStyle(element.EXTENDS,"margin-left").substring(0,this.getStyle(element.EXTENDS,"margin-left").length-2)) + 14;
                                    childMargin += "px";
                                    return (<div className="columnName">
                                                <span style={{marginLeft:childMargin}} id = {element.NAME} className={element.EXTENDS} onClick={this.toggleChildren} hidden={true} onMouseLeave={this.mouseLeaveButton} onMouseEnter={this.mouseOverButton}>{element.NAME}</span>
                                            </div>);
                                }else{
                                    return (<div className="columnName">
                                                <span id = {element.NAME} onClick={this.toggleChildren} onMouseLeave={this.mouseLeaveButton} onMouseEnter={this.mouseOverButton}>{element.NAME}</span>
                                            </div>);
                                }
                            });
            return groupTemp;
        });     
        return (<div>{template}</div>);
    }

    hideChildren(){
        this.state.loadedTemplate.map(element => {
            if(element.EXTENDS != ""){
                let childComponent = document.getElementById(element.NAME);
                childComponent.hidden = true;
            }
        });
    }

    getSinglePhase(templateName){
        let selectedPhase = {};
        this.state.loadedTemplate.map(template => {
            if(template.NAME == templateName)
            selectedPhase = template;
        });
        return selectedPhase;
    }

    toggleChildren(event){
      if(this.state.currentAction == ""){
        let parentPhaseName = event.target.id;
        let childElements = document.getElementsByClassName(parentPhaseName);
        let groupedTemplate = this.groupTemplates(); 
        for (let childElement of childElements) {
            if(childElement.nodeName != "BUTTON"){
                if(childElement.hidden){
                    childElement.hidden = false;
                }else{
                    let childName = childElement.id;
                    document.getElementById(childName).hidden = true;
                    let subArray = [];
                    subArray.push(childName);
                    for(let i=0;i<groupedTemplate.length;i++){
                        for(let j=0;j<groupedTemplate[i].length;j++){
                            if(childName == groupedTemplate[i][j].EXTENDS){
                                document.getElementById(groupedTemplate[i][j].NAME).hidden = true;
                                subArray.push(groupedTemplate[i][j].NAME);
                                childName = groupedTemplate[i][j].NAME;
                            }
                        }
                    }
                }
            }
        }   
      }
    }
    
    groupTemplates(){
        let template = [...this.state.loadedTemplate];
        let groupedTemplate = [];
        template.map(element => {
            let insertPosition;
            let selectedPosition;
            let parentI;
            let parentJ;
            if(element.EXTENDS != ""){
                for(let i=0;i< groupedTemplate.length;i++){
                    for(let j=0;j<groupedTemplate[i].length;j++){
                        if(groupedTemplate[i][j].EXTENDS == element.EXTENDS){
                            selectedPosition = i;
                            insertPosition = j;
                        }
                        if(groupedTemplate[i][j].NAME == element.EXTENDS){
                            parentI = i;
                            parentJ = j;
                        }
                    }
                }
                if(insertPosition == undefined || selectedPosition == undefined){ 
                    groupedTemplate[parentI].splice(parentJ+1,0,element);
                }else{
                    parentJ = insertPosition+1;
                    while(parentJ <= groupedTemplate[selectedPosition].length){
                       if(parentJ == groupedTemplate[selectedPosition].length){
                            break;
                       }else{
                            if(groupedTemplate[selectedPosition][parentJ-1].CHILDREN.includes(groupedTemplate[selectedPosition][parentJ].NAME)
                             || groupedTemplate[selectedPosition][parentJ-1].EXTENDS == groupedTemplate[selectedPosition][parentJ].EXTENDS){
                                    parentJ++;
                            }else{
                              break;
                            }    
                       }
                    }
                    groupedTemplate[selectedPosition].splice(parentJ,0,element);
                }
                
            }else{
                let parentArr = [];
                parentArr.push(element);
                groupedTemplate.push(parentArr);
            }  
        }); 
        return groupedTemplate;
    }

    changeHandler(event){
        let formData = {...this.state.formData};
        if(event.target.id == "NAME"){
            formData.NAME = event.target.value;
        }else{
            formData.WIP = event.target.value;
        }
        this.setState({formData : {...formData}});
    }

    submitPhase(){
        let formData = {...this.state.formData};
        let template = [...this.state.loadedTemplate];
        let errorObject = {};
        let condition = formData.NAME == "" ? false : formData.PHASE == "Phase" ? true : formData.EXTENDS == "" ? false : true;
        if(condition){
            if(this.state.currentAction == "EDIT"){
                template.map(element => {
                    if(element.NAME == formData.OLDNAME){
                        element.NAME = formData.NAME;
                        element.WIP = formData.WIP;
                    } 
                    if(formData.OLDNAME == element.EXTENDS){
                        element.EXTENDS = formData.NAME;
                    }
                    element.CHILDREN.includes(formData.OLDNAME) && element.CHILDREN.splice(element.CHILDREN.indexOf(formData.OLDNAME),1,formData.NAME);
                });
            }else{
                formData.WIP = formData.WIP == "" ? false : formData.WIP;
                formData._id = this.props.randValueGenerator(); 
                let newTemplate = {
                    _id : formData._id,
                    NAME : formData.NAME,
                    WIP : formData.WIP,
                    EXTENDS : formData.EXTENDS,
                    CHILDREN : []              
                };
                let phaseExists = false;
                template.map( element => {
                    if(formData.EXTENDS == "" && element.EXTENDS == "" && formData.NAME == element.NAME){
                        phaseExists = true;
                    }else if(formData.EXTENDS != "" && element.NAME == formData.EXTENDS && element.CHILDREN.includes(formData.NAME)){
                        phaseExists = true;
                    }
                });
                if(!phaseExists){
                    template.push(newTemplate);
                    template.map(element => {
                        newTemplate.EXTENDS == element.NAME && element.CHILDREN.push(newTemplate.NAME);
                        if(element.WIP > 0 && newTemplate.EXTENDS == element.NAME){
                            element.WIP = 0;
                            errorObject.msg = EMSG.CLI_TMPBLD_PHSWIP;
                            errorObject.status = "ERROR";
                            this.props.setMsgState(errorObject);                                    
                        }
                    });
                }else{
                    errorObject.msg = EMSG.CLI_TMPBLD_PHSEXT;
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);    
                }
            }
            this.setState({loadedTemplate : template},()=> {
                let groupedTemplate = this.groupTemplates();
                let finalTemplate = [];
                groupedTemplate.map(phaseTemplate => {
                    phaseTemplate.map(template => {
                        finalTemplate.push(template);
                    });
                });
                this.props.setLoadedTemplate(finalTemplate);
                this.hideChildren();
            });
            this.clearForm();
        }else{
            let errorMsg = formData.NAME == "" ?
                             "Please Enter a Name for the "+formData.PHASE : template.length == 0 ? 
                                "Please add a Phase before adding a subPhase" : "Please select a parent phase for "+formData.NAME; 
            errorObject.msg = errorMsg;
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);   
        }
    }

    clearForm(){
        this.setState({editForm : true,currentAction:"",formData : {NAME : "",WIP : false,PHASE:"Phase",EXTENDS:""},disableWIP : false});
    }
    
    onPhaseOptionChange(event){
        let formData = {...this.state.formData};
        if(event.target.id == "phaseSelector"){
            formData.PHASE = event.target.value;
        }else{
            formData.EXTENDS = event.target.value;
        }
        this.setState({formData : {...formData}});
    }

    mouseOverClick(event){
        let selectedTemplate;
        let formData = {...this.state.formData};
        switch(event.target.id){
            case "EDIT":
                selectedTemplate = this.getSinglePhase(event.target.className);
                formData.NAME = selectedTemplate.NAME;
                formData.WIP = selectedTemplate.WIP;
                formData.OLDNAME = selectedTemplate.NAME;
                let disableWIP = selectedTemplate.CHILDREN.length > 0 ? true : false;
                this.setState({editForm:false,formData:formData,isFeildDisabled:false,currentAction:"EDIT",disableWIP : disableWIP});
                break;
            case "INFO":
                selectedTemplate = this.getSinglePhase(event.target.className);
                formData.NAME = selectedTemplate.NAME;
                formData.WIP = selectedTemplate.WIP;
                delete formData.OLDNAME;
                this.setState({editForm:false,formData:formData,isFeildDisabled:true,currentAction:"INFO",disableWIP : true});
                break;
            case "REMOVE":
                let childrenArray = this.getSinglePhase(event.target.className).CHILDREN;
                let refreshedTemplate = [];
                let template = [... this.state.loadedTemplate];
                if(childrenArray == undefined){
                    template.map(element => {
                        if(element.NAME != event.target.className){
                            refreshedTemplate.push(element);
                        }
                    });
                }else{
                    template.map(element => {
                        if(element.CHILDREN != undefined && element.CHILDREN.includes(event.target.className)){
                            element.CHILDREN.splice(element.CHILDREN.indexOf(event.target.className),1);
                        }
                        if(!childrenArray.includes(element.NAME) && element.NAME != event.target.className){
                            refreshedTemplate.push(element);
                        }
                    });
                }
                this.setState({loadedTemplate : refreshedTemplate,formData : {NAME : "",WIP : false,PHASE:"Phase",EXTENDS:""},editForm : true,disableWIP : false});
                this.props.setLoadedTemplate(refreshedTemplate);
                break;        
        }
    }

    addPhase(){
        this.setState({editForm:false,formData : {NAME : "",WIP : false,PHASE:"Phase",EXTENDS:""},isFeildDisabled:false,currentAction:"ADD",disableWIP : false});
    }

    mouseLeaveButton(event){
        var child = event.target.lastElementChild;  
        while (child) { 
            event.target.removeChild(child); 
            child = event.target.lastElementChild; 
        } 
    }

    mouseOverButton(event){ 
        if(this.state.currentAction == ""){
            let mouseoverArray = [
                    {
                        NAME : "EDIT",
                        IMAGEURL : ""
                    },
                    {
                        NAME : "INFO",
                        IMAGEURL : ""
                    },
                    {
                        NAME : "REMOVE",
                        IMAGEURL : ""
                    }
                ];
            mouseoverArray.map(mouseovr => {
                let button = document.createElement("Button");
                button.innerHTML = mouseovr.IMAGEURL;
                button.id = mouseovr.NAME;
                button.className = event.target.id; 
                button.onclick = this.mouseOverClick;
                event.target.appendChild(button);   
            });  
        }
    }
    
    render(){
        let formContainer = this.formBuilder();
        let showPhaseSelector = this.state.currentAction == "ADD" ? false : true;    
        return(<div className = "templateBuilderContainer">
                    {formContainer}
                    <button className="templateAddButton" onClick={this.addPhase}>+</button>
                    <Modal
                    isOpen={this.state.currentAction != ""}
                    contentLabel="">
                        <select id="phaseSelector" value = {this.state.formData.PHASE} hidden = {showPhaseSelector} onChange={this.onPhaseOptionChange}>
                            <option selected="selected" value="Phase">Phase</option>
                            <option value="SubPhase">SubPhase</option>   
                        </select>
                        <select id="subPhaseSelector" onChange={this.onPhaseOptionChange} hidden = {this.state.formData.PHASE == "SubPhase" ? false : true}>
                        <option>Parent Phase</option>  
                        {
                            !showPhaseSelector && this.groupTemplates().map(template => {
                                                        return(template.map(opt => {
                                                        return(<option value = {opt.NAME}>{opt.NAME}</option>)}));
                                                    })
                        }
                        </select>
                        <div hidden = {this.state.editForm}>
                        <input type="text" id = "NAME" value={this.state.formData.NAME} onChange = {this.changeHandler} placeholder="Name" disabled = {this.state.isFeildDisabled}/>
                        <input type="number" id = "WIP" value={this.state.formData.WIP} onChange = {this.changeHandler} placeholder="WIP" disabled = {this.state.isFeildDisabled || this.state.disableWIP}/>
                        <button onClick={this.clearForm}>X</button>
                        <button onClick={this.submitPhase} hidden = {this.state.isFeildDisabled}>&gt;</button>
                        </div>    
                    </Modal>
               </div>);
    }
}

const mapDispatchToProps = dispatch => {
    return {      
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(null,mapDispatchToProps)(TemplateBuilder); 
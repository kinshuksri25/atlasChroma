import React,{ Component } from "react";


export default class EditableForm extends Component {

    constructor(props){
        super(props);
        this.state={
            loadedTemplate : [],
            changeForm : ""
        };
        this.phaseBuilder = this.phaseBuilder.bind(this);
        this.mouseOverButton = this.mouseOverButton.bind(this);
        this.mouseLeaveButton = this.mouseLeaveButton.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.editPhase = this.editPhase.bind(this);
        this.addPhase = this.addPhase.bind(this);
        this.formBuilder = this.formBuilder.bind(this);
        this.removeForm = this.removeForm.bind(this);
    }

    componentDidMount(){
        this.setState({loadedTemplate:[...this.props.template]});
    }

    formBuilder(selectedTemplate,action){
        let isDisabled = true;
        let submitHidden = true;
        let subPhaseHidden = true;
        let placeHolderName = "";
        let placeHolderWIP = false;
        let subPhasesContainer = "";
        switch(action){
            case "ADD":
                isDisabled = false;
                submitHidden = false;
                break;
            case "EDIT":
                isDisabled = false;
                submitHidden = false;
                placeHolderName = selectedTemplate.Name;
                placeHolderWIP = selectedTemplate.WIP;
                subPhasesContainer = this.phaseBuilder(selectedTemplate.subphases);
                break;    
            default:
                placeHolderName = selectedTemplate.Name;
                placeHolderWIP = selectedTemplate.WIP;
                break;    
        }
        this.setState({changeForm : <div>
                                        <input type = "text" value={placeHolderName} disabled = {isDisabled}/>
                                        <input type = "number" value={placeHolderWIP} disabled = {isDisabled}/>
                                        <button onClick={this.removeForm}>Exit</button>
                                        <button hidden={submitHidden}>Submit</button>
                                        {subPhasesContainer}
                                    </div>});   
    }

    removeForm(){
        this.setState({changeForm : ""});
    }

    addPhase(event){
        this.formBuilder("","ADD");    
    }

    phaseBuilder(suppliedTemplate){
        let template = suppliedTemplate == undefined ? [...this.state.loadedTemplate] : suppliedTemplate;
        let editableForm = ""; 
        editableForm = template.map(element => {
            return (<div id = {element.Name} onMouseLeave={this.mouseLeaveButton} onMouseEnter={this.mouseOverButton}>
                        {element.Name}
                    </div>);
        });
        let addPhase = editableForm == "" ? "" : <button onClick={this.addPhase}>+</button>;
        return (<div>
                    {editableForm}
                    {addPhase}
                </div>);
    }

    editPhase(event){
        let selectedTemplate = {};
        this.state.loadedTemplate.map(template => {
            if(template.Name == event.target.className)
                selectedTemplate = template;
       });
       this.formBuilder(selectedTemplate,"EDIT");
    }

    getInfo(event){
        let selectedTemplate = {};
        this.state.loadedTemplate.map(template => {
            if(template.Name == event.target.className)
                selectedTemplate = template;
       });
       this.formBuilder(selectedTemplate,"INFO");
    }

    mouseLeaveButton(event){
        var child = event.target.lastElementChild;  
        while (child) { 
            event.target.removeChild(child); 
            child = event.target.lastElementChild; 
        } 
    }

    mouseOverButton(event){    
        let phaseContainer = event.target;
        let editButton = document.createElement("Button");
        editButton.innerHTML = "Edit";
        editButton.className = phaseContainer.id;
        editButton.onclick = this.editPhase;
        let infoButton = document.createElement("Button");
        infoButton.innerHTML = "Info";
        infoButton.className = phaseContainer.id;
        infoButton.onclick = this.getInfo;
        phaseContainer.appendChild(infoButton);
        phaseContainer.appendChild(editButton);

    }

    render(){
        let editableFormContainer = this.phaseBuilder();
        return(<div>
                {editableFormContainer}
                {this.state.changeForm}
                </div>);
    }
}
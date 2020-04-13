import React,{ Component } from "react";

//REFACTOR OF THIS CLASS IS VERY IMPORTANT DURING THE NEXT MILESTONE
export default class EditableForm extends Component {
    
    constructor(props){
        super(props);
        this.state ={
            loadedTemplate : [],
            selectedTemplate : {},
            formData : {NAME : "",
                        WIP : false,
                        PHASE:"Phase",
                        EXTENDS:""},
            currentAction : "",
            isFeildDisabled : true,
            editForm : true,
            isSubPhase : true
        };
        this.hideChildren = this.hideChildren.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.mouseLeaveButton = this.mouseLeaveButton.bind(this);
        this.mouseOverButton = this.mouseOverButton.bind(this);
        this.getTemplate = this.getTemplate.bind(this);
        this.editPhase = this.editPhase.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.onPhaseOptionChange = this.onPhaseOptionChange.bind(this);
        this.submitPhase = this.submitPhase.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.addPhase = this.addPhase.bind(this);
        this.removePhase = this.removePhase.bind(this);
        this.formBuilder = this.formBuilder.bind(this);
        this.toggleChildren = this.toggleChildren.bind(this);
        this.groupTemplates = this.groupTemplates.bind(this);
    }

    componentDidMount(){
        this.setState({loadedTemplate:[...this.props.template]},() => {
            this.props.setLoadedTemplate(this.state.loadedTemplate);
        });
    }

    getTemplate(templateName){
        let selectedTemplate = {};
        this.state.loadedTemplate.map(template => {
            if(template.NAME == templateName)
                selectedTemplate = template;
        });
        this.setState({selectedTemplate : selectedTemplate});
        return selectedTemplate;
    }

    hideChildren(){
        this.state.loadedTemplate.map(element => {
            if(element.EXTENDS != ""){
                let childComponent = document.getElementById(element.NAME);
                childComponent.hidden = true;
            }
        });
    }

    formBuilder(){
        let groupedTemplate = this.groupTemplates();
        let template = "";
        template = groupedTemplate.map(group => {
            let groupTemp = group.map(element => {
                                if(element.EXTENDS != "" && JSON.stringify(element.CHILDREN) == JSON.stringify([])){
                                    return (<div id = {element.NAME} className={element.EXTENDS} hidden={true} onMouseLeave={this.mouseLeaveButton} onMouseEnter={this.mouseOverButton}>
                                                {element.NAME}
                                            </div>);
                                }else if(JSON.stringify(element.CHILDREN) != JSON.stringify([]) && element.EXTENDS != ""){
                                    return (<div id = {element.NAME} className={element.EXTENDS} onClick={this.toggleChildren} hidden={true} onMouseLeave={this.mouseLeaveButton} onMouseEnter={this.mouseOverButton}>
                                                {element.NAME}
                                            </div>);
                                }else{
                                    return (<div id = {element.NAME} onClick={this.toggleChildren} onMouseLeave={this.mouseLeaveButton} onMouseEnter={this.mouseOverButton}>
                                                {element.NAME}
                                            </div>);
                                }
                            });
            return groupTemp;
        });
        let addButton = <button onClick={this.addPhase}>+</button>    
        return (<div>{template}{addButton}</div>);
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
                        parentI = selectedPosition;
                        parentJ = insertPosition+1;
                        let found = false;
                    while(parentJ <= groupedTemplate[parentI].length){
                       if(parentJ == groupedTemplate[parentI].length){
                            break;
                       }else{
                            let count = parentJ-1;
                            while(count >= insertPosition){
                                if(groupedTemplate[selectedPosition][count].CHILDREN.includes(groupedTemplate[selectedPosition][parentJ]))
                                {
                                    count--;
                                }else{
                                    found = true;
                                    break;
                                }
                            }
                           if(found){
                               break;
                           }else{
                               parentJ++;
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
        if(formData.NAME != ""){
            if(this.state.currentAction == "EDIT"){
                template.map(element => {
                   if(element.NAME == formData.OLDNAME){
                        element.NAME = formData.NAME;
                        element.WIP = formData.WIP;
                   } 
                   if(formData.OLDNAME == element.EXTENDS){
                        element.EXTENDS = formData.NAME;
                   }
                   if(element.CHILDREN.includes(formData.OLDNAME)){
                        element.CHILDREN.splice(element.CHILDREN.indexOf(formData.OLDNAME),1);
                        element.CHILDREN.push(formData.NAME);
                   }
                });
            }else{
                formData.WIP = formData.WIP == "" ? false : formData.WIP;
                formData._id = this.props.randValueGenerator();
                formData.EXTENDS = formData.PHASE == "Phase" ? formData.EXTENDS : formData.EXTENDS == "" ? template[0].NAME : formData.EXTENDS; 
                let newTemplate = {
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
                    });
                }else{
                    console.log("this name already exists");        
                }
            }
            this.setState({loadedTemplate : template},()=> {
                this.props.setLoadedTemplate(this.state.loadedTemplate);
                this.hideChildren();
            });
            this.clearForm();
        }else{
            console.log("please enter required feilds : name");
        }
    }

    clearForm(){
        this.setState({editForm : true,currentAction:"",formData : {NAME : "",WIP : false,PHASE:"Phase",EXTENDS:""}});
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

    removePhase(event){
        let childrenArray = this.getTemplate(event.target.className).CHILDREN;
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
        event.target.className == this.state.formData.NAME && this.setState({loadedTemplate : refreshedTemplate,formData : {NAME : "",WIP : false,PHASE:"Phase",EXTENDS:""},editForm : true});
        event.target.className == this.state.formData.NAME || this.setState({loadedTemplate : refreshedTemplate});
        this.props.setLoadedTemplate(refreshedTemplate);
    }

    editPhase(event){
        let selectedTemplate = this.getTemplate(event.target.className);
        let formData = {...this.state.formData};
        formData.NAME = selectedTemplate.NAME;
        formData.WIP = selectedTemplate.WIP;
        formData.OLDNAME = selectedTemplate.NAME;
        this.setState({editForm:false,formData:formData,isFeildDisabled:false,currentAction:"EDIT"});
    }

    getInfo(event){
        let selectedTemplate = this.getTemplate(event.target.className);
        let formData = {...this.state.formData};
        formData.NAME = selectedTemplate.NAME;
        formData.WIP = selectedTemplate.WIP;
        delete formData.OLDNAME;
        this.setState({editForm:false,formData:formData,isFeildDisabled:true,currentAction:"INFO"});
    }

    addPhase(){
        this.setState({editForm:false,formData : {NAME : "",WIP : false,PHASE:"Phase",EXTENDS:""},isFeildDisabled:false,currentAction:"ADD"});
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
            this.props.mouseover[0].CALLABLEFUNCTION = this.editPhase;
            this.props.mouseover[1].CALLABLEFUNCTION = this.getInfo;
            this.props.mouseover[2].CALLABLEFUNCTION = this.removePhase; 
            this.props.mouseover.map(mouseovr => {
                let button = document.createElement("Button");
                button.innerHTML = mouseovr.IMAGEURL;
                button.className = event.target.id; 
                button.onclick = mouseovr.CALLABLEFUNCTION;
                event.target.appendChild(button);   
            });  
        }
    }
    
    render(){
        let formContainer = this.formBuilder();
        let showPhaseSelector = this.state.currentAction == "ADD" ? false : true;      

        return(<div>
                    {formContainer}
                    <select id="phaseSelector" value = {this.state.formData.PHASE} hidden = {showPhaseSelector} onChange={this.onPhaseOptionChange}>
                        <option selected="selected" value="Phase">Phase</option>
                        <option value="SubPhase">SubPhase</option>   
                    </select>
                    <select id="subPhaseSelector" onChange={this.onPhaseOptionChange} hidden = {this.state.formData.PHASE == "SubPhase" ? false : true}>
                        {
                            !showPhaseSelector && this.groupTemplates().map(template => {
                                                        return(template.map(opt => {
                                                        return(<option value = {opt.NAME}>{opt.NAME}</option>)}));
                                                    })
                        }
                    </select>
                    <div hidden = {this.state.editForm}>
                        <input type="text" id = "NAME" value={this.state.formData.NAME} onChange = {this.changeHandler} placeholder="Name" disabled = {this.state.isFeildDisabled}/>
                        <input type="number" id = "WIP" value={this.state.formData.WIP} onChange = {this.changeHandler} placeholder="WIP" disabled = {this.state.isFeildDisabled}/>
                        <button onClick={this.clearForm}>Back</button>
                        <button onClick={this.submitPhase}>Submit</button>
                    </div> 
               </div>);
    }
}
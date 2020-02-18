import React,{ Component } from "react";

import formConstants from '../../Forms/formConstants';
import SimpleForm from '../../Forms/simpleform';

export default class AddProject extends Component{

    constructor(props){
        super(props);
        this.state = {
            contributor:"",
            projectLeader:""
        };
        this.onchangeHandler = this.onchangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onSubmitHandler(event){
        console.log(event.target.value);
    }

    onchangeHandler(value){
        console.log(value);
    }

    render(){
        return(<div>
                <SimpleForm formAttributes = { formConstants.addProject }
                    submitHandler = { this.onSubmitHandler }
                    changeHandler = { this.onchangeHandler }
                    changeFieldNames = {["Title"]}
                    options = {["Project Type","Simple","Agile"]} />
          
               </div>);
    }

}
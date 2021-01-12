import React,{ Component } from "react";

import "../StyleSheets/FilterForm.css";
import {Form} from "react-bootstrap";

export default class FilterForm extends Component{

    constructor(props){
        super(props);
        this.state ={
            suggestions : [],
            searchTerm: ""
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.offFocus = this.offFocus.bind(this);
    }

    offFocus(event){
       setTimeout(()=>{
        this.setState({searchTerm:"",suggestions:[]});
       },230);
    }

    onChange(event){
        let searchTerm = event.target.value;
        let suggestions = [];
        if(event.target.value != ""){
            this.props.projects.map(project => {
                if(project.title.indexOf(searchTerm) >= 0){
                    let projectObject = {};
                    projectObject._id = project._id;
                    projectObject.title = project.title;
                    this.props.userlist.map(user => {
                        if(user.username == project.projectlead)
                            projectObject.leadPhoto = user.photo;
                            projectObject.name = user.firstname+" "+user.lastname;
                    })
                    projectObject.updatedtitle = projectObject.title.length > 20 ? projectObject.title.substring(0,18)+"..." : projectObject.title; 
                    suggestions.push({...projectObject});
                } 
            });
            this.setState({suggestions : [...suggestions],searchTerm:searchTerm});
        }else{
            this.setState({suggestions : [],searchTerm:searchTerm});
        }
    }

    onSubmit(event){
        let url = "/projects/"+event.currentTarget.id; 
        window.history.pushState({}, "",url);
    }

    render(){
        return(
            <div className = "filterContainer">
                <div className = "filterInnerContainer">
                    <Form.Control as="select" className = "orderBy" id = "orderBy" onChange={this.props.changeOrderBy} value={this.props.orderBy}>
                        {
                            this.props.options.map(option => {
                                return (<option value = {option}>{option}</option>);
                            })
                        }
                    </Form.Control>
                    <div  onBlur={this.offFocus}>
                        <Form.Control as="input" autoComplete="off" className = "projectSearch" type = "text" value={this.state.searchTerm} placeHolder = "Project Search" id = "inputSearch" onChange={this.onChange}/>
                        <ul className="suggestions">
                            {
                                this.state.suggestions.map(suggestion => {
                                   return( <li title={suggestion.title} id={suggestion._id} onClick={this.onSubmit}>
                                                <span className="suggestionTitle">{suggestion.updatedtitle}</span>  <span>ProjectLead:<img title={suggestion.name} className = "profilePicture" src={suggestion.leadPhoto}/></span>  
                                            </li>)
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
          );
    }
}
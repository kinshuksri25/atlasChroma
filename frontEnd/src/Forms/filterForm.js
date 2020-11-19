import React,{ Component } from "react";

import "../StyleSheets/FilterForm.css";

export default class FilterForm extends Component{

    constructor(props){
        super(props);
        this.state ={
            suggestions : []
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
                    })
                    suggestions.push({...projectObject});
                } 
            });
            this.setState({suggestions : [...suggestions]});
        }else{
            this.setState({suggestions : []});
        }
    }

    onSubmit(event){
        let url = "/projects/"+event.target.id; 
        window.history.replaceState({}, "",url);
    }

    render(){
        return(
            <div className = "filterContainer">
                <div className = "filterInnerContainer">
                    <select className = "orderBy" id = "orderBy" onChange={this.props.changeOrderBy} value={this.props.orderBy}>
                        {
                            this.props.options.map(option => {
                                return (<option value = {option}>{option}</option>);
                            })
                        }
                    </select>
                    <div>
                        <input className = "projectSearch" type = "text" placeHolder = "Project Search" id = "inputSearch" onChange={this.onChange}/>
                        <ul className="suggestions">
                            {
                                this.state.suggestions.map(suggestion => {
                                   return( <li id={suggestion._id} onClick={this.onSubmit}>
                                                {suggestion.title}  ProjectLead:  <img className = "profilePicture" src={suggestion.leadPhoto}/>  
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
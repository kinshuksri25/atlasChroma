import React,{ Component } from "react";


//This is a specialized form created only for project filtering and adding 
//TODO --> need to create a generic class for this purpose
export default class ProfileFilterForm extends Component{

    constructor(props){
        super(props);
        this.state={
            search:""
        };
        this.onChange = this.onChange.bind(this);
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    }

    onKeyDownHandler(event) {
        if (event.key == "Tab" || event.key == "Enter") {
            let searchTerm = this.state.search;
            this.props.searchProject(searchTerm);
        }
    }

    onChange(event){
        this.setState({search:event.target.value});
    }

    render(){
        return(
            <div className = "profileFilterContainer">
                <label >Order By
                    <select id = "projectOrder" onChange={this.props.changeOrderBy} value={this.props.orderBy}> 
                        <option value = "Recently Created">Recently Created</option>
                        <option value = "Recently Modified">Recently Modified</option>
                        <option value = "Alphabetically">Alphabetically</option>
                    </select>
                </label>
                <input type = "text" value={this.state.search} id = "projectSearch" onChange={this.onChange} onKeyDown = { this.onKeyDownHandler }/>
                <button onClick={this.props.addProject}>Add Project</button>
            </div>
          );
    }
}
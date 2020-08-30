import React,{ Component } from "react";
import {Form} from "react-bootstrap";

export default class FilterForm extends Component{

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
            this.props.searchFunction(searchTerm);
        }
    }

    onChange(event){
        this.setState({search:event.target.value});
    }

    render(){
        return(
            <div className = "filterContainer">
                <Form.Control className = "orderBy" as="select" id = "orderBy" onChange={this.props.changeOrderBy} value={this.props.orderBy}>
                    {
                        this.props.options.map(option => {
                            return (<option value = {option}>{option}</option>);
                        })
                    }
                </Form.Control>
                <Form.Control className = "projectSearch" type = "text" value={this.state.search} placeHolder = "Project Search" id = "inputSearch" onChange={this.onChange} onKeyDown = { this.onKeyDownHandler }/>
            </div>
          );
    }
}
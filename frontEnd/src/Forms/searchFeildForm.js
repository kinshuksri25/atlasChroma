//Dependencies
import React,{Component} from 'react';

export default class SearchFeild extends Component{

    constructor(props){
        super(props);
        this.state ={
            autoComplete: "",
            suggestions:""
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onChange(event){
        this.setState({suggestions : ""});
        let globalThis = this
        this.setState({autoComplete:event.target.value},() => {
            if(this.state.autoComplete != ""){
                //IMP!!! --> using eval for evaluating conditions is a security risk 
                let comparingQuery = "";
                for(let i =0;i<this.props.constants.searchCriteria.length;i++){
                    if(i == this.props.constants.searchCriteria.length -1){
                        comparingQuery += "el."+ globalThis.props.constants.searchCriteria[i] +".substring(0,globalThis.state.autoComplete.length) == globalThis.state.autoComplete";
                    }
                    else{
                        comparingQuery += "el."+ globalThis.props.constants.searchCriteria[i] +".substring(0,globalThis.state.autoComplete.length) == globalThis.state.autoComplete || ";
                    }
                }
                let resultSet = [];
                this.props.list.map(el => {
                    if(eval(comparingQuery)){
                      resultSet.push(el);  
                    }
                });
                let suggestionContainer = <ul>
                                            {
                                                resultSet.map( el => {
                                                    return( <li id = {el.UserName} onClick = {this.onClick}>{el.UserName}</li> );
                                                })
                                            }
                                          </ul>
                this.setState({suggestions : suggestionContainer});                          
            }
        });
    }

    onClick(event){
        this.setState({  autoComplete: "",suggestions:""});
        this.props.onSuggestionClick(event.target.id);
    }
    

    render(){
        return(<div>
                <input type="text" 
                name = {this.props.constants.name}
                id = {this.props.constants.id}
                placeholder = {this.props.constants.placeholder} 
                value = {this.state.autoComplete} 
                className = {this.props.constants.className}
                onChange = {this.onChange}/>
                {this.state.suggestions}
            </div>);
    }
}
//Dependencies
import React,{Component} from 'react';

export default class SuggestionComponent extends Component{

    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
        this.generateSuggestionList = this.generateSuggestionList.bind(this);
        this.buildJSX = this.buildJSX.bind(this);
    }

    buildJSX(){
        let suggestionlist = this.generateSuggestionList();
        if(suggestionlist.length == 0){
            return "";
        }else{
            return (<ul className = "suggestionBox">
                        {suggestionlist.map(suggestion => {
                            return(<li id = {suggestion.id} onClick = {this.onClick}>{suggestion.title}</li>);
                        })}
                    </ul>);
        }
    }

    generateSuggestionList(){
        let filteredList = [];
        let globalThis = this;
        if(this.props.searchQuery != ""){
            //IMP!!! --> using eval for evaluating conditions is a security risk 
            let comparingQuery = "";
            for(let i =0;i<this.props.searchCriteria.length;i++){
                if(i == this.props.searchCriteria.length -1){
                    comparingQuery += "el."+ globalThis.props.searchCriteria[i] +".substring(0,globalThis.props.searchQuery.length) == globalThis.props.searchQuery";
                }
                else{
                    comparingQuery += "el."+ globalThis.props.searchCriteria[i] +".substring(0,globalThis.props.searchQuery.length) == globalThis.props.searchQuery || ";
                }
            }
            this.props.unfilteredList.map(el => {
                if(eval(comparingQuery)){
                    filteredList.push(el);  
                }
            });                       
        }
        return filteredList;
    }

    onClick(event){
        this.setState({suggestionlist:[]});
        this.props.onSuggestionClick(event.target.id,this.props.id);
    }
    

    render(){
        return(<div>{this.buildJSX()}</div>);
    }
}
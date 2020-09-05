//Dependencies
import React,{Component} from 'react';

export default class SuggestionComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            showSuggestion : true
        }
        this.onClick = this.onClick.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.generateSuggestionList = this.generateSuggestionList.bind(this);
        this.buildJSX = this.buildJSX.bind(this);
    }

    componentDidMount(){
        this.addEventListeners();
    }

    buildJSX(){
        let suggestionlist = this.generateSuggestionList();
        if(suggestionlist.length == 0){
            return "";
        }else{
            return (<ul>
                        {suggestionlist.map(suggestion => {
                            return(<li className="suggestion" id = {suggestion.id} onClick = {this.onClick}>{suggestion.title}</li>);
                        })}
                    </ul>);
        }
    }

    addEventListeners(){
        let globalThis = this;
        let searchBox = document.getElementsByClassName("searchBox");
        for (let i = 0; i < searchBox.length; i++) { 
            searchBox[i].addEventListener("blur", function () {
                setTimeout(() => { 
                    globalThis.props.id == searchBox[i].id && globalThis.setState({showSuggestion : false});
                },1000);
            }); 
            searchBox[i].addEventListener("focus", function () {
                setTimeout(() => { 
                    globalThis.props.id == searchBox[i].id && globalThis.setState({showSuggestion : true});
                },1000);
            });     
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
        this.props.onSuggestionClick(event.target.id,this.props.id,this.props.searchBoxValue);
    }
    

    render(){
        return(<div>{this.state.showSuggestion && <div className = "suggestionBox">{this.buildJSX()}</div>}</div>);
    }
}
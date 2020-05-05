//Dependencies
import React,{Component} from 'react';
import SuggestionComponent from './suggestion';

export default class SearchFeild extends Component{

    constructor(props){
        super(props);
        this.state ={};
        this.buildJSX = this.buildJSX.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionClick = this.onSuggestionClick.bind(this);
    }

    static getDerivedStateFromProps(props, state){
       if(JSON.stringify(state) == JSON.stringify({})){
            let searchState = {};
            props.constants.map(constant => {
                searchState[constant.id] = "";
            });
            return {...searchState};
       }else{
            return null;
       }
    }

    onChange(event){
        let searchState = {...this.state};
        searchState[event.target.id] = event.target.value;
        this.setState({...searchState});
    }

    buildJSX(){
        let searchJSX = this.props.constants.map(constant => {
                return(<div className = 'searchBox'>
                <input type="text" 
                name = {constant.name}
                id = {constant.id}
                placeholder = {constant.placeholder} 
                value = {this.state[constant.id]} 
                className = {constant.className}
                onChange = {this.onChange}/>
                <SuggestionComponent searchCriteria = {constant.searchCriteria} 
                                     searchQuery = {this.state[constant.id]} 
                                     unfilteredList = {this.props.unfilteredList}
                                     id = {constant.id}
                                     onSuggestionClick = {this.onSuggestionClick}/>
            </div>);
        });
        return (<div>{searchJSX}</div>);
    }

    onSuggestionClick(selectedValue,searchBoxID){   
        let updatedState = this.state; 
        updatedState[searchBoxID] = "";
        this.setState({...updatedState});
        this.props.onSuggestionClick(selectedValue,searchBoxID);
    }

    render(){
        let searchFeildJSX = this.buildJSX();
        return(<div>{searchFeildJSX}</div>);
    }
}
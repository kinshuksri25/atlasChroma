//Dependencies
import React,{Component} from 'react';
import SuggestionComponent from './suggestions';

export default class SearchFeild extends Component{

    constructor(props){
        super(props);
        this.state ={};
        this.buildJSX = this.buildJSX.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionClick = this.onSuggestionClick.bind(this);
    }

    componentDidMount(){
        let searchState = {};
        this.props.constants.map(constant => {
            searchState["constant.id"] = "";
        });
        this.setState({...searchState});
    }

    onChange(event){
        let searchState = {...this.state};
        searchState["event.target.id"] = event.target.value;
        this.setState({...searchState});
    }

    buildJSX(){
        let searchJSX = this.props.constants.map(constant => {
            return(<div className = 'searchBox'>
                    <input type="text" 
                    name = {this.props.constant.name}
                    id = {this.props.constant.id}
                    placeholder = {this.props.constant.placeholder} 
                    value = {this.state["this.props.constant.id"]} 
                    className = {this.props.constant.className}
                    onChange = {this.onChange}/>
                    <SuggestionComponent searchCriteria = {this.props.constant.searchCriteria} 
                                         searchQuery = {this.state["this.props.constant.id"]} 
                                         unfilteredList = {this.props.unfilteredList["this.props.constant.id"]}
                                         id = {this.props.constant.id}
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
        return(<div>{this.buildJSX()}</div>);
    }
}
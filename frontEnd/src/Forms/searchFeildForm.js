//Dependencies
import React,{Component} from 'react';
import { connect } from 'react-redux';

import cancel from "../Images/icons/cancel.png";
import SuggestionComponent from './suggestion';
import {EMSG} from '../../../lib/constants/contants';
import setMsgAction from '../store/actions/msgActions';
import {Form,Tooltip,OverlayTrigger} from "react-bootstrap";
import Modal from 'react-modal';

import "../StyleSheets/searchFeildForm.css";

class SearchFeild extends Component{

    constructor(props){
        super(props);
        this.state ={};
        this.toggleModal = this.toggleModal.bind(this);
        this.search = this.search.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.buildJSX = this.buildJSX.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionClick = this.onSuggestionClick.bind(this);
    }

    static getDerivedStateFromProps(props, state){
       if(JSON.stringify(state) == JSON.stringify({})){
            let searchState = {};
            props.constants.map(constant => {
                searchState[constant.id] = "";
                if(constant.type == 0){
                    searchState[constant.stateValueName] = props.feilds == undefined ? {} : {...props.feilds[constant.stateValueName]};
                }else{
                    searchState[constant.stateValueName] = props.feilds == undefined ? [] : [...props.feilds[constant.stateValueName]];
                }
            });
            return {...searchState,openModal : false};
       }else{
            let searchState = {...state};
            props.constants.map(constant => {
                if(JSON.stringify(state[constant.stateValueName]) != JSON.stringify(props.feilds[constant.stateValueName])){                    
                    searchState[constant.stateValueName] = props.feilds[constant.stateValueName];    
                }
            })
            return {...searchState};
       }
    }

    onChange(event){
        let searchState = {...this.state};
        searchState[event.target.id] = event.target.value;
        this.setState({...searchState});
    }

    removeUser(event){
        this.props.onRemoveClick(event.target.id); 
    }

    buildJSX(){
        let searchJSX = this.props.constants.map(constant => {
            let selectedJSX = this.search(constant);
            return(<div className = "searchForm">
                        <Form.Control type="text" 
                        disabled={this.props.disableInputs}
                        name = {constant.name}
                        id = {constant.id}
                        placeholder = {constant.placeholder} 
                        value = {this.state[constant.id]} 
                        className = 'searchBox'
                        autoComplete="off"
                        onChange = {this.onChange}/>
                        <SuggestionComponent 
                        searchBoxValue = {constant.stateValueName}
                        searchCriteria = {constant.searchCriteria} 
                        searchQuery = {this.state[constant.id]} 
                        unfilteredList = {this.props.unfilteredList}
                        id = {constant.id}
                        onSuggestionClick = {this.onSuggestionClick}/>
                        {selectedJSX}
                    </div>);
        });
        return (<div>{searchJSX}</div>);
    }

    search(constant){
        let selectedJSX = "";
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              heigth                : '10%',
              marginRight           : '-50%',
              paddingTop            : '0.8rem',
              borderRadius          : '5px',
              transform             : 'translate(-50%, -50%)'
            }
        };
        if(this.state[constant.stateValueName].length == undefined && JSON.stringify(this.state[constant.stateValueName]) != JSON.stringify({})){
            let listJSX = <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{this.state[constant.stateValueName].tooltip}</strong>.</Tooltip>}>
                            <img className = "suggestionProfilePic" id = {this.state[constant.stateValueName].id} src={this.state[constant.stateValueName].photo}/>    
                        </OverlayTrigger>
            selectedJSX =   <div className = "selectedProfileContainer">
                                <h6>Current {constant.name}:</h6>
                                {listJSX}
                            </div>
        }else if(this.state[constant.stateValueName].length > 0){
            let listJSX = this.state[constant.stateValueName].map(user => {
                    return( <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{user.tooltip}</strong>.</Tooltip>}>
                                <img className = "suggestionProfilePic" id = {user.id} src={user.photo} onClick={this.removeUser}/>    
                            </OverlayTrigger>);
            });
            selectedJSX =   <div className = "selectedProfileContainer">
                                <h6>Current {constant.name}:</h6>
                                {listJSX.slice(0,4)}
                                {this.state[constant.stateValueName].length > 4 && <span className = "moreContri" onClick = {this.toggleModal}>+ {this.state[constant.stateValueName].length-4} more</span>}
                                <Modal
                                isOpen={this.state.openModal}
                                style = {customStyles}>
                                    <button className = "contriCancel" onClick={this.toggleModal}><img src={cancel}/></button>
                                    <div className = "contributorList">{listJSX}</div>
                                </Modal>
                            </div>
        }
        return selectedJSX;

    }

    toggleModal(){
        this.setState({openModal : !this.state.openModal});
    }


    onSuggestionClick(selectedValue,searchBoxID,searchBoxValue){   
        this.props.onSuggestionClick(selectedValue,searchBoxID);
    }

    render(){
        let searchFeildJSX = this.buildJSX();
        return(<div>
                    {searchFeildJSX}

                </div>);
    }
}

const mapDispatchToProps = (dispatch) => {
    return{      
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    }
};

export default connect(null,mapDispatchToProps)(SearchFeild);
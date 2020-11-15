//Dependencies
import React,{Component} from 'react';
import { connect } from 'react-redux';

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
    
    componentDidMount(){
        console.log(this.props.disableInputs);
    }

    static getDerivedStateFromProps(props, state){
       if(JSON.stringify(state) == JSON.stringify({})){
            let searchState = {};
            props.constants.map(constant => {
                searchState[constant.id] = "";
                if(constant.type == 0){
                    searchState[constant.stateValueName] = {};
                }else{
                    searchState[constant.stateValueName] = [];
                }
            });
            return {...searchState,openModal : false};
       }else{
            return null;
       }
    }

    onChange(event){
        let searchState = {...this.state};
        searchState[event.target.id] = event.target.value;
        this.setState({...searchState});
    }

    removeUser(event){
        let isValid = true;
        let index = 0;
        let errorObject = {};
        this.props.constants.map(constant => {
            if(constant.type == 0 && this.state[constant.stateValueName].id == event.target.id){
                errorObject.msg = EMSG.CLI_PRJ_LEADDEL;
                errorObject.status = "ERROR";
                this.props.setMsgState(errorObject);
                isValid = false;
            }else if(constant.type == 1 && isValid){
                let valueArray = [...this.state[constant.stateValueName]];
                valueArray.map(value =>{
                    if(event.target.id == value.id){
                        valueArray.splice(index,1);
                        let changedList = {};
                        changedList[constant.stateValueName] = valueArray;
                        this.setState({...changedList});
                    }else{index++;}
                });

                this.props.onRemoveClick(event.target.id);
            }  
            index = 0; 
        }); 
        this.setState({openModal : false});
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
              width                 : '30%',
              heigth                : '10%',
              marginRight           : '-50%',
              paddingTop            : '0.8rem',
              transform             : 'translate(-50%, -50%)'
            }
        };
        if(this.state[constant.stateValueName].length == undefined && JSON.stringify(this.state[constant.stateValueName]) != JSON.stringify({})){
            let listJSX = <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{this.state[constant.stateValueName].tooltip}</strong>.</Tooltip>}>
                            <img className = "profilePicture" id = {this.state[constant.stateValueName].id} src={this.state[constant.stateValueName].photo} width = "30" height = "30"/>    
                        </OverlayTrigger>
            selectedJSX =   <div className = "profileContainer">
                                <h6>Current {constant.name}:</h6>
                                {listJSX}
                            </div>
        }else if(this.state[constant.stateValueName].length > 0){
            let listJSX = this.state[constant.stateValueName].map(user => {
                    return( <OverlayTrigger placement="bottom" overlay={<Tooltip> <strong>{user.tooltip}</strong>.</Tooltip>}>
                                <img className = "profilePicture" id = {user.id} src={user.photo} width = "30" height = "30" onClick={this.removeUser}/>    
                            </OverlayTrigger>);
            });
            selectedJSX =   <div className = "profileContainer">
                                <h6>Current {constant.name}:</h6>
                                {listJSX.slice(0,3)}
                                {this.state[constant.stateValueName].length > 3 && <span className = "moreContri" onClick = {this.toggleModal}>+ {this.state[constant.stateValueName].length-3} more</span>}
                                <Modal
                                isOpen={this.state.openModal}
                                style = {customStyles}>
                                    <button className = "closeAddModal" onClick={this.toggleModal}>X</button>
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
        let updatedState = this.state;
        let selectedUser = {};
        let valueFound = false;
        updatedState[searchBoxID] = "";
        this.props.unfilteredList.map(user => {
            if(user.id == selectedValue){
                selectedUser.tooltip = user.title;
                selectedUser.photo = user.photo;
                selectedUser.id = user.id;
            }
        });
        if(updatedState[searchBoxValue].length == undefined){
            updatedState[searchBoxValue] = {...selectedUser};
        }
        this.props.constants.map(constant => {
            if(constant.type == 1)
            {
                updatedState[constant.stateValueName].map(value =>{
                    if(value.id == selectedValue){
                        valueFound = true;
                    }
                });
                valueFound || updatedState[constant.stateValueName].push(selectedUser);
            }
        });
        this.setState({...updatedState});
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
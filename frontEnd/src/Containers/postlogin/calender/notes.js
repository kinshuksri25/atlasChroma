//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import Modal from 'react-modal';
import SimpleForm from '../../../Forms/simpleform';
import cookieManager from '../../../Components/cookieManager';
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import formConstants from '../../../Forms/formConstants';
import setMsgAction from '../../../store/actions/msgActions';
import setUserAction from '../../../store/actions/userActions';


class Notes extends Component{
    constructor(props){
        super(props);
        this.state={
            modalStatus : "",
            selectedNotesTitle : "",
            editedNotesTitle : "",
            selectedNotesDescription : "",
            editedNotesDescription : "",
            notesID : ""
        };
        this.displayNotesForm = this.displayNotesForm.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.buildJSX = this.buildJSX.bind(this);
    }

    onChangeHandler(event){
        if(event.target.className == "title"){
            this.setState({editedNotesTitle: event.target.value});
        } else{
            this.setState({editedNotesDescription: event.target.value});
        }
    }

    onSubmitHandler(formObject){
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let errorObject = {};
        let globalThis = this;
        let notesObject = {};
        notesObject.title = formObject.formData.NotesTitle;
        notesObject.description = formObject.formData.Description;
        httpsMiddleware.httpsRequest("/notes","POST",headers,{...notesObject,emailID : globalThis.props.user.email},function(error,responseObject){
            if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }else{
                let userObject = {...globalThis.props.user};
                notesObject._id = responseObject.PAYLOAD.notesID;
                notesObject.creationdate = responseObject.PAYLOAD.creationdate;
                userObject.notes.push({...notesObject});
                globalThis.props.setUserState(userObject);
                globalThis.setState({modalStatus : ""}); 
            }
        });
    }

    deleteHandler(){
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let errorObject = {};
        let globalThis = this;
        let queryString = "notesID="+this.state.notesID;

        httpsMiddleware.httpsRequest("/notes","DELETE",headers,queryString,function(error,responseObject){
            if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }else{
                let userObject = {...globalThis.props.user};
                let count = 0;
                userObject.notes.map(note => {
                   if(note._id == globalThis.state.notesID){
                        userObject.notes.splice(count,1);
                   } else{
                       count++;
                   }
                });
                globalThis.props.setUserState(userObject);
                globalThis.setState({modalStatus : "",editedNotesTitle: "",editedNotesDescription: "",selectedNotesTitle:"",selectedNotesDescription:"",notesID:""}); 
            }
        });
    }

    updateHandler(){
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let errorObject = {};
        let globalThis = this;
        let notesObject = {};

        if(this.state.selectedNotesTitle != this.state.editedNotesTitle){
            notesObject.title = this.state.editedNotesTitle;
        } if(this.state.selectedNotesDescription != this.state.editedNotesDescription) {
            notesObject.description = this.state.editedNotesDescription;
        }
        notesObject._id = this.state.notesID;
        notesObject.emailID = this.props.user.email;

        httpsMiddleware.httpsRequest("/notes","PUT",headers,{...notesObject},function(error,responseObject){
            if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }else{
                let userObject = {...globalThis.props.user};
                userObject.notes.map(note => {
                    if(note._id == globalThis.state.notesID){
                        if(notesObject.hasOwnProperty("title")){
                            note.title = globalThis.state.editedNotesTitle;
                        } if(notesObject.hasOwnProperty("description")) {
                            note.description = globalThis.state.editedNotesDescription;
                        }
                    }
                });
                globalThis.props.setUserState(userObject);
                globalThis.setState({modalStatus : "",editedNotesTitle: "",editedNotesDescription: "",selectedNotesTitle:"",selectedNotesDescription:"",notesID:""}); 
            }
        });
    }

    buildJSX(){
        let notes = [...this.props.user.notes];
        let notesJSX = "";
        notesJSX = notes.map(note => {
                if(this.props.calenderDate == note.creationdate){
                    return(
                        <div id={note._id} onClick={this.displayNotesForm}>
                            <h2>{note.title}</h2>
                            <p>{note.description}</p>
                        </div>
                    );   
                }
        });
        return notesJSX;
    }

    displayNotesForm(event){
        if(event.target.className == "displayFormButton"){
            this.setState({modalStatus : "ADD"});
        }else if(event.target.className == "hideEditFormButton" || event.target.className == "hideFormButton"){
            this.setState({modalStatus : "",editedNotesTitle:"",editedNotesDescription:"",selectedNotesTitle:"",selectedNotesDescription:"",notesID : ""});
        }else {
            let selectedNote = {};
            this.props.user.notes.map(note => {
                selectedNote = note._id == event.target.id ? {...note} : selectedNote;
            });
            this.setState({modalStatus : "EDIT",selectedNotesTitle:selectedNote.title,editedNotesTitle: selectedNote.title,
                                selectedNotesDescription:selectedNote.description,editedNotesDescription: selectedNote.description,notesID : selectedNote._id});
        }
    }

    render(){
    let bodyJSX = this.buildJSX();
    let updateInvalid = this.state.editedNotesTitle != this.state.selectedNotesTitle  || this.state.editedNotesDescription != this.state.selectedNotesDescription && 
                            (this.state.editedNotesDescription != "" && this.state.editedNotesTitle != "") ? false : true;        
    return(<div> 
                <button disabled = {this.props.disableAdd} className = "displayFormButton" onClick={this.displayNotesForm}>+</button> 
                <Modal
                isOpen={this.state.modalStatus == "ADD"}
                contentLabel="">
                    <button className = "hideFormButton" onClick={this.displayNotesForm}>X</button> 
                    <SimpleForm formAttributes = { formConstants.addNotes }
                    submitHandler = { this.onSubmitHandler }
                    changeFieldNames = {[]}/>
                </Modal> 
                <Modal
                isOpen={this.state.modalStatus == "EDIT"}
                contentLabel="">
                    <button className = "hideEditFormButton" onClick={this.displayNotesForm}>X</button> 
                    <input type="text" value={this.state.editedNotesTitle} onChange={this.onChangeHandler} className="title"/>
                    <input type="text" value={this.state.editedNotesDescription} onChange={this.onChangeHandler} className="description"/>
                    <button className = "deleteNotes" disabled={updateInvalid} onClick={this.updateHandler}>update</button>
                    <button className = "deleteNotes" onClick={this.deleteHandler}>delete</button>
                </Modal>
                {bodyJSX}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Notes); 
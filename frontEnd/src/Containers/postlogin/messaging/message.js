import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import {Button} from "react-bootstrap";

import {chatObject} from '../../../../../lib/constants/storeConstants';
import {EMSG} from '../../../../../lib/constants/contants';

class Message extends Component{
    constructor(props){
        super(props);
        this.state = {
            message :"",
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.buildChatWindow = this.buildChatWindow.bind(this);
    }

    onChangeHandler(event){
        this.setState({message : event.target.value});
    }

    onSubmitHandler(){
        if(this.state.message!=""){
            let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
            let currentDay = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();
            let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+currentDay;
            let userOnline = false;
            this.props.userList.map(user => {
                if(user.username == this.props.recipientUserName){
                    userOnline = user.status;
                }    
            });

            let chat = {...chatObject};
            chat.sender = this.props.user.username;
            chat.recipient = this.props.recipientUserName;
            chat.message = this.state.message;
            chat.date = currentDate;
            chat.msgDelivered = userOnline;
            this.props.io.emit("sendMessage",{roomName : this.props.roomName,messageObject : {...chat}});
        }
    }

    buildChatWindow(){
        let chats = [];
        let reciverOffline = false;
        this.props.userList.map(user => {
            if(user.username == this.props.recipientUserName)
                reciverOffline = user.status;
        });
        for(let key in this.props.chatRooms){
            chats = this.props.chatRooms[this.props.roomName] != undefined ? [...this.props.chatRooms[this.props.roomName]] : chats;
        }

        let chatJSX = chats.map(chat => {
            let classname = chat.sender == this.props.user.username ? "Sender" : "Reciever";
            let msgContainer = classname+"Container";
            return(<div className={msgContainer}><li className = {classname}>{chat.message}</li></div>);
        });
        return (<div className = "chatWindow">
                    <h6><span>{this.props.recipientName}</span> {reciverOffline && <div className="userOnline"></div>} <span className="closeChat" onClick={this.props.toggleChatWindow}>x</span></h6>
                    <ul>
                        <li className="offlineHeader" hidden = {reciverOffline}>{this.props.recipientName} {EMSG.CLI_MSG_OFFLINE}</li>
                        {chatJSX}
                    </ul>
                </div>);
    }

    render(){
        let chatWindowJSX = this.buildChatWindow();
        return (<div className = "chatBox">
                   {chatWindowJSX}
                    <div className="inputContainer">
                        <input type = "text" value = {this.state.message} onChange = {this.onChangeHandler} className = "messageInput"/>
                        <Button variant="success" onClick = {this.onSubmitHandler}>&gt;</Button>
                    </div>
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer,
        userList : state.userListStateReducer,
        io : state.socketStateReducer.io,
        chatRooms : state.chatStateReducer
    }
};

export default connect(mapStateToProps,null)(Message); 
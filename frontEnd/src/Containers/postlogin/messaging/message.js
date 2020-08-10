import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import {chatObject} from '../../../../../lib/constants/storeConstants';
import {EMSG} from '../../../../../lib/constants/contants';
import {addMsgAction} from "../../../store/actions/chatActions";

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

    componentDidMount(){
        this.props.io.on("setMessage",(data) => {
            this.props.addMsgState({...data.messageObject},data.roomName);   
        });
    }

    onChangeHandler(event){
        this.setState({message : event.target.value});
    }

    onSubmitHandler(){
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
        let currentDay = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+currentDay;
        let userOnline = false;
        this.props.userList.map(user => {
            if(user.username != this.props.user.username){
                userOnline = user.status ? true : false;
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

    buildChatWindow(){
        let chats = [];
        let reciverOffline = false;
        this.props.userList.map(user => {
            if(user.username == this.props.recipientUserName)
                reciverOffline = true;
        });
        for(let key in this.props.chatRooms){
            chats = this.props.chatRooms[this.props.roomName] != undefined ? [...this.props.chatRooms[this.props.roomName]] : chats;
        }

        let chatJSX = chats.map(chat => {
            return(<li className = {chat.sender}>{chat.message}</li>);
        });
        return (<ul>
                    <li hidden = {reciverOffline}>{this.props.recipientName} {EMSG.CLI_MSG_OFFLINE}</li>
                    {chatJSX}
                </ul>);
    }

    render(){
        let chatWindowJSX = this.buildChatWindow();
        return (<div className = "chatBox">
                    <div className = "chatWindow">
                        {chatWindowJSX}
                    </div>
                    <div>
                        <input type = "text" value = {this.state.message} onChange = {this.onChangeHandler} className = "messageInput"/>
                        <button onClick = {this.onSubmitHandler}>Send</button>
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

const mapDispatchToProps = dispatch => {
    return {
        addMsgState: (msgObject,roomname) =>{
            dispatch(addMsgAction(msgObject,roomname));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Message); 
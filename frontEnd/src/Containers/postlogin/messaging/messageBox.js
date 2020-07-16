import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import Message from "./message";
import {addChatRoomAction,setMessageObjectAction,addMsgAction} from "../../../store/actions/chatActions";


class MessageBox extends Component{
    
    constructor(props){
        super(props);
        this.state={
            hideChatWindow : true,
            currentRecipientUserName : "",
            currentRecipientName : "",
            currentRoomName : ""
        };
        this.joinRoom = this.joinRoom.bind(this);
        this.listeners = this.listeners.bind(this);
        this.buildContact = this.buildContact.bind(this);
    }

    componentDidMount(){
        setTimeout(() =>{
            this.listeners();
            this.props.io.emit("getMessages",this.props.user.username);
        },1000);
    }   

    listeners(){
        //setChatState
        this.props.io.on("setMessages",(data)=>{
            this.props.setChatState({...data});
        });

        //to join a new room 
        this.props.io.on("setRoom",(data)=> {
            let currentRecipientName = this.state.currentRecipientName;
            let currentRecipientUserName = this.state.currentRecipientUserName;
            let currentRoomName = this.state.currentRoomName;
            let recipientObject = {};
            let senderObject = {};
            
            this.props.chatRooms.hasOwnProperty(data.roomName) || this.props.setRoomNameState(data.roomName);
            this.props.userList.map(user => {
                recipientObject = user.username == data.recipientUserName ? {...user} : recipientObject;
                senderObject = user.username == data.senderUserName ? {...user} : senderObject;
            });

            currentRecipientName = senderObject.username == this.props.user.username ? recipientObject.firstname : this.state.hideChatWindow ? senderObject.firstname : this.state.currentRecipientName;
            currentRecipientUserName = senderObject.username == this.props.user.username ? recipientObject.username : this.state.hideChatWindow ? senderObject.username : this.state.currentRecipientUserName;
            currentRoomName = senderObject.username == this.props.user.username|| this.state.hideChatWindow ? data.roomName : this.state.currentRoomName;

            this.setState({
                hideChatWindow : false,
                currentRecipientUserName : currentRecipientUserName,
                currentRecipientName : currentRecipientName,
                currentRoomName : data.roomName
            });

            let chatRooms = {...this.props.chatRooms};
            if(chatRooms.hasOwnProperty(data.roomName)){
               chatRooms[data.roomName].map(conversation => {
                   conversation.msgDelivered = true;
               });
               this.props.setChatState({...chatRooms});
            }
            this.props.user.username != data.senderUserName && this.props.io.emit("joinRoom",{...data});
        });
    }

    joinRoom(event){
        this.props.io.emit("generateRoomName",{senderUserName : this.props.user.username,recipientUserName : event.target.id});
        this.props.io.emit("deliverMsgs",{senderUserName : this.props.user.username,recipientUserName : event.target.id});
    }

    buildContact(){
        let contactList = this.props.userList.map(user => {
            if(user.username != this.props.user.username){
                let status = user.status ? "Online" : "Offline";
                return (<li id={user.username} onClick = {this.joinRoom}>{user.firstname} {user.lastname}    {status}</li>);
            }
        });
        return (<ul>{contactList}</ul>);
    }

    render(){
        let contactList = this.buildContact();
        let messaageBox = this.state.hideChatWindow && this.state.currentRoomName == "" ? "" : <Message roomName = {this.state.currentRoomName} 
                                                                                                recipientName = {this.state.currentRecipientName} 
                                                                                                recipientUserName = {this.state.currentRecipientUserName}/>;
        return (
            <div className = 'MessageBox'>
                {messaageBox}
                {contactList}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer,
        chatRooms : state.chatStateReducer,
        userList : state.userListStateReducer,
        io : state.socketStateReducer.io
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        setMsgState: (msgObject,roomName) => {
            dispatch(addMsgAction(msgObject,roomName));
        },
        setChatState : (chatObject) =>{
            dispatch(setMessageObjectAction(chatObject));
        },
        setRoomNameState : (roomName) => {
            dispatch(addChatRoomAction(roomName));
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(MessageBox); 
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import "../../../StyleSheets/messageBox.css";
import Message from "./message";
import {addChatRoomAction,setMessageObjectAction,addMsgAction} from "../../../store/actions/chatActions";


class MessageBox extends Component{
    
    constructor(props){
        super(props);
        this.state={
            hideMessageWindow : true,
            hideChatWindow : true,
            currentRecipientUserName : "",
            currentRecipientName : "",
            currentRoomName : "",
            unreadUserMsgs: []
        };
        this.toggleButton = this.toggleButton.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.listeners = this.listeners.bind(this);
        this.toggleChatWindow = this.toggleChatWindow.bind(this);
        this.buildContact = this.buildContact.bind(this);
    }

    componentDidMount(){
        setTimeout(() =>{
            this.listeners();
            this.props.io.emit("getMessages",this.props.user.username);
        },1000);

        this.props.io.on("setMessage",(data) => {
            this.props.addMsgState({...data.messageObject},data.roomName);  
            if(this.state.currentRecipientUserName != data.messageObject.sender){
                let unreadUserMsgs = [...this.state.unreadUserMsgs]; 
                if(unreadUserMsgs.length == 0){
                    unreadUserMsgs.push({username: data.messageObject.sender, count: 1});
                }else{
                    let duplicateValue = false;
                    unreadUserMsgs.map(msgObj =>{
                        if(msgObj.username == data.messageObject.sender){
                            duplicateValue = true;
                            msgObj.count += 1;
                        }
                    });

                    duplicateValue || unreadUserMsgs.push({username: data.messageObject.sender, count: 1});
                }
                this.setState({unreadUserMsgs: [...unreadUserMsgs]});
            }
            if(this.state.hideMessageWindow && data.messageObject.sender != this.props.user.username && data.messageObject.sender != this.state.currentRecipientUserName){
                let heading = document.getElementById("messagesHeading");
                heading.className = "unread";
            }
        });
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
            let senderName = "";
            let reciverName = "";
            let hideChatWindow = this.state.hideChatWindow;
            
            this.props.chatRooms.hasOwnProperty(data.roomName) || this.props.setRoomNameState(data.roomName);
            this.props.userList.map(user => {
                if(user.username == data.recipientUserName){
                    recipientObject =  {...user};
                    reciverName = recipientObject.firstname+" "+recipientObject.lastname;
                }else if(user.username == data.senderUserName){
                    senderObject = {...user};  
                    senderName = senderObject.firstname+" "+senderObject.lastname;
                }
            });
            currentRecipientName = senderObject.username == this.props.user.username ? reciverName : this.state.currentRecipientName;
            currentRecipientUserName = senderObject.username == this.props.user.username ? recipientObject.username : this.state.currentRecipientUserName;
            currentRoomName = senderObject.username == this.props.user.username ? data.roomName : this.state.currentRoomName;
            hideChatWindow = this.props.user.username == senderObject.username ? false : hideChatWindow;

            let userMsgs = [...this.state.unreadUserMsgs];
            let index = -1;
            for(let i=0;i< userMsgs.length ; i++){
                if(userMsgs[i].username == currentRecipientUserName){
                    index = i;
                }
            }

            index > -1 && userMsgs.splice(index,1);
            
            this.setState({
                hideChatWindow : hideChatWindow,
                currentRecipientUserName : currentRecipientUserName,
                currentRecipientName : currentRecipientName,
                currentRoomName : currentRoomName,
                unreadUserMsgs : [...userMsgs]
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
            let unreadMsg = {};
            this.state.unreadUserMsgs.map(msgObj => {
                unreadMsg = msgObj.username == user.username ? {...msgObj} : {...unreadMsg};
            });

            let msgCount = unreadMsg.count > 10 ? "10+" : unreadMsg.count;
            if(user.username != this.props.user.username){
                let status = user.status ? <div className="Online"></div> : "";
            return (<li id={user.username} onClick = {this.joinRoom}>{user.firstname} {user.lastname} {JSON.stringify(unreadMsg) != JSON.stringify({}) && <span className="unreadCount">{msgCount}</span>}   {status}</li>);
            }
        });
        return (<ul>{contactList}</ul>);
    }

    toggleChatWindow(){
        this.setState({hideChatWindow : !this.state.hideChatWindow, currentRecipientUserName : "",currentRecipientName : "",currentRoomName : ""});
    }

    toggleButton(){
        this.setState({hideMessageWindow : !this.state.hideMessageWindow});
        let heading = document.getElementById("messagesHeading");
        heading.className = "";
    }

    render(){
        let contactList = this.buildContact();
        return (
            <div className="messageContainer">
                {!this.state.hideChatWindow && this.state.currentRoomName != "" && <Message toggleChatWindow = {this.toggleChatWindow} roomName = {this.state.currentRoomName} recipientName = {this.state.currentRecipientName} recipientUserName = {this.state.currentRecipientUserName}/>}
                <div className = 'MessageBox'>
                        <h6 id="messagesHeading" onClick={this.toggleButton}>Messages</h6>
                        { !this.state.hideMessageWindow && contactList}
                </div>
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
        setMsgState: (msgObject,roomName) => {
            dispatch(addMsgAction(msgObject,roomName));
        },
        setChatState : (chatObject) =>{
            dispatch(setMessageObjectAction(chatObject));
        },
        setRoomNameState : (roomName) => {
            dispatch(addChatRoomAction(roomName));
        },
        addMsgState: (msgObject,roomname) =>{
            dispatch(addMsgAction(msgObject,roomname));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(MessageBox); 
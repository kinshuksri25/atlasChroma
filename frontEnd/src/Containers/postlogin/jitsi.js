//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import Jitsi from 'react-jitsi'

import setMsgAction from '../../store/actions/msgActions';

class JitsiContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            api : ""
        }
        this.buildJitsi = this.buildJitsi.bind(this);
        this.cleanMeeting = this.cleanMeeting.bind(this);
        this.onLoadApi = this.onLoadApi.bind(this);
    }

    onLoadApi(api){
        this.setState({api : api});
        api.executeCommand("toggleVideo");

        api.on("passwordRequired",() => {
            api.executeCommand("password", this.props.roomDetails.password);
        });

        api.on("readyToClose",()=> {
           if(this.state.api == ""){
                this.props.onClose();
           }else{
                this.cleanMeeting();
           }
        })

    }

    cleanMeeting(){
        this.props.onClose();
        this.state.api.dispose();
    }
    
    buildJitsi(){
        const interfaceConfig = {
            LANG_DETECTION: false,
            lang: "es",
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            MOBILE_APP_PROMO: false,
            SHOW_CHROME_EXTENSION_BANNER: false,
            TOOLBAR_BUTTONS: [
                "microphone",
                "camera",
                "fullscreen",
                "fodeviceselection",
                "hangup",
                "profile",
                "chat",
                "settings",
                "videoquality",
                "tileview",
                "download",
                "help",
                "mute-everyone"
            ]
            };
        
        const config = {
        defaultLanguage: "es",
        prejoinPageEnabled: false
        };
        
       return (<div>
                    <button onClick = {this.cleanMeeting}>X</button>
                    <Jitsi
                    roomName={this.props.roomDetails.roomname}
                    displayName={this.props.roomDetails.name}
                    containerStyle={{ width: '1200px', height: '800px' }}
                    password = {this.props.roomDetails.password}
                    interfaceConfig={interfaceConfig}
                    config={config}
                    domain = {"meet.jit.si"}
                    onAPILoad={JitsiMeetAPI =>  this.onLoadApi(JitsiMeetAPI)}
                    />
                </div>);
    }

    render(){
        let jitsi = this.buildJitsi();
        return(<div>{jitsi}</div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer,
        userList : state.userListStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(JitsiContainer); 


//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../StyleSheets/postLoginRouter.css';
import clock from '../generalContainers/clock';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import setLoadingAction from '../../store/actions/loadingActions';
import cookieManager from '../../Components/cookieManager';
import KanbanBoard from './kanbanBoard/kanbanBoard';
import Projects from './projects/projects';
import Highlight from './highlight';
import Scheduler from './calender/scheduler';
import Menu from '../../Menu/menu';
import Profile from './profile';
import clientSocket from 'socket.io-client';
import setMsgAction from '../../store/actions/msgActions';
import menuConstants from '../../Menu/menuConstants';
import {msgObject} from '../../../../lib/constants/storeConstants';
import LoadingComponent from '../generalContainers/loadingComponent';
import setUserAction from '../../store/actions/userActions';
import {urls} from "../../../../lib/constants/contants";
import listener from '../generalContainers/asyncListener';
import updateTime from '../../store/actions/clockActions';
import MessageBox from "../postlogin/messaging/messageBox";
import {userList,userObject} from "../../../../lib/constants/storeConstants";
import setSocketObject from "../../store/actions/socketActions";

class PostLoginRouter extends Component {

    constructor(props){
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.containerSelector = this.containerSelector.bind(this);
        this.props.changeLoadingState(true);
    }

    componentDidMount(){ 
        //setting up io instance in redux store
        let io = clientSocket('https://localhost:5000',{transports: ['websocket']});
        this.props.setSocketState(io); 
        listener.listenEvents(io);

        //connect to server socket
       io.on("connect",() => {
           console.log("socket connected to server");
           let userID = cookieManager.getUserSessionDetails();
           io.emit('login',userID);
            let queryString = "";
            if(userID){
                let cookieDetails = {"CookieID" : userID};
                this.getUserData(cookieDetails,queryString);
                queryString+="&userID="+userID;
                this.getUserData(cookieDetails,queryString);
            }else{
                window.history.pushState({}, "",urls.LANDING);
            }
        });
    }

    getUserData(headers,queryString){ 
        let globalThis = this;
        httpsMiddleware.httpsRequest(urls.USER,"GET", headers, queryString,function(error,responseObject) {
            if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                let errorObject = {...msgObject};
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
                cookieManager.clearUserSession(); 
                window.history.pushState({}, "",urls.LANDING);
            }else{
                queryString != "" && globalThis.props.setUserState({...responseObject.PAYLOAD});
                queryString != "" && clock.startClock();
                queryString == "" && globalThis.props.changeLoadingState(false); 
            }
        });
    }

    //Router
    containerSelector() {
        if(JSON.stringify(this.props.user) != JSON.stringify(userObject) || JSON.stringify(this.props.userList) != JSON.stringify(userList) ){
            let absolutePath = window.location.pathname.substring(1).toLowerCase();
            /\/$/.test(absolutePath) && window.history.replaceState({}, "", "/" + absolutePath.substring(0, absolutePath.length - 1));
            if(/\w\/[\w|\d]+$/.test(absolutePath)){
                let boardRegex = new RegExp(/projects\/[\w|\d]+$/);
                let schedulerRegex = new RegExp(/scheduler\/\d+$/);
                if(boardRegex.test(absolutePath)){
                    let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
                    return <KanbanBoard projectID = {projectID}/>;
                }else if(schedulerRegex.test(absolutePath)){
                    return <Scheduler/>;
                }else{
                    window.history.replaceState({}, "",urls.PROJECT);
                    return <DashBoard/>;
                }

            }else{
                switch (absolutePath) {
                    case "projects":
                        return <Projects/>;
                        break;
                    case "scheduler":
                        return <Scheduler/>;
                        break;
                    case "profile":
                        return <Profile/>;
                        break;                        
                    case "logout":
                        // clock.unsubscribe();
                        // listener.unsubscribe();
                        // this.props.updateTime("");
                        this.props.io.emit("terminate",{cookieID : cookieManager.getUserSessionDetails(), username : this.props.user.username});
                        cookieManager.clearUserSession();
                        window.history.replaceState({}, "",urls.LANDING);
                        break;        
                    default:
                        window.history.replaceState({}, "",urls.PROJECT);
                        return <Projects/>;
                        break;
                }
            }  
        }else{
            return <LoadingComponent/>;
        }    
    }
   
    render(){  
        let absolutePath =  /\/$/.test(window.location.pathname.substring(1).toLowerCase()) ? 
                                window.location.pathname.substring(1).toLowerCase().substring(0,window.location.pathname.substring(1).toLowerCase().length-1) : 
                                    window.location.pathname.substring(1).toLowerCase();
        let highlightHide = /projects\/[\w|\d]+$/.test(absolutePath) || /profile/.test(absolutePath) ? false : true;
        let shouldRender = this.props.io != "" && JSON.stringify(this.props.user) != JSON.stringify(userObject);
        let finalRootComponent = !highlightHide ? <div style={{gridTemplateColumns: '1fr'}}>
                                                    <Menu menuArray = {menuConstants}/> 
                                                    <div className = "mainContainer">{this.containerSelector()}</div>
                                                    {this.props.io != "" && JSON.stringify(this.props.user) != JSON.stringify(userObject) && <MessageBox/>}
                                                </div> :
                                                <div>
                                                    <Menu menuArray = {menuConstants}/> 
                                                    <div className = "mainContainer">{this.containerSelector()}</div>
                                                    <Highlight/>
                                                    {this.props.io != "" && JSON.stringify(this.props.user) != JSON.stringify(userObject) && <MessageBox/>}
                                                </div>
        let renderedComponent = shouldRender ?  finalRootComponent : "";
        return (<div className="postLoginContainer">{renderedComponent}</div>);
    }
}

const mapStateToProps = state => {
    return {
        currentUrl : state.urlStateReducer.currentUrl,
        user : state.userStateReducer,
        userList : state.userListStateReducer,
        io : state.socketStateReducer.io,
        previousTime: state.clockStateReducer.previousTime
    }
}

const mapDispatchToProps = dispatch => {
    return { 
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        },
        setSocketState: (io) => {
            dispatch(setSocketObject(io));
        },
        changeLoadingState: (isLoading) =>{
            dispatch(setLoadingAction(isLoading));
        },
        updateTime : (time) =>{
            dispatch(updateTime(time));
        }   
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(PostLoginRouter);

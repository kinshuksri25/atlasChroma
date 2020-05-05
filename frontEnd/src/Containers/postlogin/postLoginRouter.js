//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import cookieManager from '../../Components/cookieManager';
import DashBoard from './dashboard';
import KanbanBoard from './kanbanBoard/kanbanBoard';
import Projects from './projects/projects';
import IssueTracker from './issueTracker';
import Highlight from './highlight';
import Scheduler from './scheduler';
import Menu from '../../Menu/menu';
import setMsgAction from '../../store/actions/msgActions';
import menuConstants from '../../Menu/menuConstants';
import {msgObject} from '../../../../lib/constants/storeConstants';
import LoadingComponent from '../generalContainers/loadingComponent';
import setUserAction from '../../store/actions/userActions';
import setUserListStateAction from '../../store/actions/userListActions';
import {urls} from "../../../../lib/constants/contants";
import {userList,userObject} from "../../../../lib/constants/storeConstants";

class PostLoginRouter extends Component {

    constructor(props){
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.containerSelector = this.containerSelector.bind(this);
    }

    componentDidMount(){
        let userID = cookieManager.getUserSessionDetails(); 
        let queryString = "";
        if(userID){
            let cookieDetails = {"CookieID" : userID};
            this.getUserData(cookieDetails,queryString,this.props.setUserListState);
            queryString+="&userID="+userID;
            this.getUserData(cookieDetails,queryString,this.props.setUserState);
        }else{
            window.history.pushState({}, "",urls.LANDING);
        }
    }

    getUserData(headers,queryString,action){ 
        let globalThis = this;
        httpsMiddleware.httpsRequest(urls.USER,"GET", headers, queryString, function(error,responseObject) {
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
                responseObject.PAYLOAD.userList == undefined && action({...responseObject.PAYLOAD.user});
                responseObject.PAYLOAD.user == undefined && action({...responseObject.PAYLOAD.userList});
            }
        });
    }

    //Router
    containerSelector() {
      if(JSON.stringify(this.props.user) != JSON.stringify(userObject) || JSON.stringify(this.props.userList) != JSON.stringify(userList) ){
        let boardRegex = new RegExp(/boards\/[a-z|0-9]*/);
        let issueRegex = new RegExp(/issuetracker\/[a-z|0-9]*/);
        let path = window.location.pathname.substring(1).toLowerCase();

        if(!/[a-z]+\/[a-z|0-9]+/g.test(path))
            if (/[a-z]+\//g.test(path)) {
                window.location.pathname = "/" + path.substring(0, path.length - 1);
            } else {
                switch (path) {
                    case "dashboard":
                        return <DashBoard/>;
                        break;
                    case "projects":
                        return <Projects/>;
                        break;    
                    case "issuetracker":
                        return <IssueTracker/>;
                        break;
                    case "scheduler":
                        return <Scheduler/>;
                        break;
                    case "logout":
                        cookieManager.clearUserSession(); 
                        window.history.replaceState({}, "",urls.LANDING);
                        break;        
                    default:
                        window.history.replaceState({}, "",urls.DASHBOARD);
                        return <DashBoard/>;
                        break;
                }
            }  
        else{
            if(boardRegex.test(path)){
                return <KanbanBoard/>
            }else if(issueRegex.test(path)){
                console.path(path);
            }else{
                window.history.replaceState({}, "",urls.DASHBOARD);
                return <DashBoard/>;
            }
        }  
      }else{
          return <LoadingComponent/>;
      }    
    }
   

    render(){
        return ( <div>
            <Menu menuArray = {menuConstants}/> 
            { this.containerSelector() }
            <Highlight/> 
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        currentUrl : state.urlStateReducer.currentUrl,
        user : state.userStateReducer,
        userList : state.userListStateReducer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        setUserListState : (userList) => {
            dispatch(setUserListStateAction(userList));    
        }, 
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(PostLoginRouter);

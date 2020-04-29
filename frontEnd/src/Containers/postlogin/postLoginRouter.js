//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import cookieManager from '../../Components/cookieManager';
import DashBoard from './dashboard';
import KanbanBoard from './kanbanBoard/kanbanBoard';
import Projects from './kanbanBoard/projects';
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
        httpsMiddleware.httpsRequest(urls.USER,"GET", headers, queryString, function(error,responseObject) {
            if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                let errorObject = {...msgObject};
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    setMsgState(errorObject);
                }
                cookieManager.clearUserSession(); 
                window.history.pushState({}, "",urls.LANDING);
            }else{
                action({...responseObject.PAYLOAD.users});
            }
        });
    }

    //Router
    containerSelector() {
      if(JSON.stringify(this.props.user) != JSON.stringify({})){
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
        user : state.userStateReducer
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

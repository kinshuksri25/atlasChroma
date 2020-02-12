//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import httpsMiddleware from '../../middleware/httpsMiddleware';
import localSession from '../../Components/sessionComponent';
import DashBoard from './dashboard';
import Projects from './projects';
import IssueTracker from './issueTracker';
import Highlight from './highlight';
import Scheduler from './scheduler';
import Menu from '../../Menu/menu';
import menuConstants from '../../Menu/menuConstants';
import setUserAction from '../../store/actions/userActions';
import {urls} from "../../../../lib/constants/dataConstants";

class PostLoginRouter extends Component {

    constructor(props){
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.containerSelector = this.containerSelector.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    getUserData(){
        
        let headers={}
        let globalThis = this;
        let route = urls.USER+"?userID="+localSession.getSessionObject().sessionID;
        httpsMiddleware.httpsRequest(route,"GET", headers, {}, function(error,responseObject) {
            if(error || responseObject.Status == "ERROR"){
                if(error){
                    console.log(error);
                    //TODO --> add errormsg div(ERR_CONN_SERVER)
                }else{
                    //TODO --> delete the session and send to login page
                    //TODO --> add error msg div(errormsg)
                }
            }else{
                console.log({...responseObject.Payload.userObject});
                globalThis.props.setUserState({...responseObject.Payload.userObject});
            }
        });
    }

    //Router
    containerSelector() {
        var path = window.location.pathname.substring(1).toLowerCase();
        if (/[a-z]+\//g.test(path) && !/[a-z]+\/[a-z]+/g.test(path)) {
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
                    localSession.clearSession();
                    this.props.checkSession();
                    break;        
                default:
                    //TODO --> change the pushState 'state' and 'title'
                    window.history.pushState({}, "",urls.DASHBOARD);
                    return <DashBoard/>;
                    break;
            }
        }
    }
    render(){
        this.props.checkSession();
        return ( <div>
            <Menu menuArray = {menuConstants}/> 
            { this.containerSelector() }
            <Highlight/> 
        </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        url: state.urlStateReducer.currentUrl
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        }
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(PostLoginRouter);
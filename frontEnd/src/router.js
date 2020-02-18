//Central Router File

//Dependencies
import React, { Component } from 'react';
import localSession from './Components/sessionComponent';
import PreLoginRouter from './Components/prelogin/preLoginRouter';
import PostLoginRouter from './Containers/postlogin/postLoginRouter';

export default class Router extends Component {

    constructor(props){
        super(props);
        this.checkSession = this.checkSession.bind(this);
        this.checkSessionTime = this.checkSessionTime.bind(this);
        this.rerenderRoot = this.rerenderRoot.bind(this);
    }

   checkSession() {
        let sessionObject = localSession.getSessionObject();

        let sessionExists = sessionObject != undefined && sessionObject.sessionID != undefined && sessionObject.creationTime != undefined ? true : false;
        if (sessionExists) {
            sessionExists = this.checkSessionTime(sessionObject);
        }
        return sessionExists;
    }

    rerenderRoot() {
        this.forceUpdate();
    }

    checkSessionTime(sessionObject) {
        let sessionBool = false;
        sessionBool = Date.now() - sessionObject.creationTime < 1800000 ? true : false;
        if (!sessionBool){
            localSession.clearSession();
        }
        return sessionBool;
    }

    render(){
        let router = this.checkSession() ? <PostLoginRouter checkSession = {this.checkSession} rerenderRouter = {this.rerenderRoot}/> 
                                            : 
                                           < PreLoginRouter rerenderRouter = {this.rerenderRoot}/> ;
        return ( <div> { router } </div>);
    }
}

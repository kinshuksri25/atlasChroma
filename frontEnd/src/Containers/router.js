//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import localSession from '../Components/sessionComponent';
import PostLoginRouter from './postLoginRouter';
import PreLoginRouter from './preLoginRouter';

//middleware has to be added to dependencies

class Router extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: ""
        };
        this.checkSession = this.checkSession.bind(this);
    }

    checkSession() {
        var session = localSession;
        var sessionObject = session.getSessionObject();
        //change the logic here after session manager is created!! 
        var sessionExists = sessionObject != undefined && sessionObject.sessionID != undefined && sessionObject.creationTime != undefined ? true : false;
        //change the logic here after session manager is created!! 	
        return sessionExists;

    }

    render() {
        var router = this.checkSession() ? < PostLoginRouter / > : < PreLoginRouter / > ;
        return ( <
            div > { router } <
            /div>
        );
    }
}


export default hot(module)(Router);
//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import localSession from '../Components/sessionComponent';
import Login from './login';
import LandingPage from './landingpage';
import SignUp from './signup';
import PostAuth from './postAuth';

class PreLoginRouter extends Component {

    constructor(props) {
        super(props);
    }

    //Router
    containerSelector() {
        var path = window.location.pathname.substring(1).toLowerCase();
        if (/[a-z]+\//g.test(path) && !/[a-z]+\/[a-z]+/g.test(path)) {
            window.location.pathname = "/" + path.substring(0, path.length - 1);
        } else {
            switch (path) {
                case "login":
                    return <Login / > ;
                    break;
                case "signup":
                    return <SignUp / > ;
                    break;
                case "landing":
                    return <LandingPage / > ;
                    break;
                case "postauth":
                    return <PostAuth / > ;
                    break;
                default:
                    window.location.pathname = "/landing";
                    break;
            }
        }

    }
    render() {
        var container = this.containerSelector();
        return ( <
            div > { container } < /div>
        );
    }
}

export default hot(module)(PreLoginRouter);
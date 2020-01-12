//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import localSession from '../../Components/sessionComponent';
import PostSignUp from './postSignUp';
import DashBoard from './dashboard';

//middleware has to be added to dependencies

class PostLoginRouter extends Component {
    constructor(props) {
        super(props);
    }

    //Router
    containerSelector() {
        var path = window.location.pathname.substring(1).toLowerCase();
        console.log(path);
        if (/[a-z]+\//g.test(path) && !/[a-z]+\/[a-z]+/g.test(path)) {
            window.location.pathname = "/" + path.substring(0, path.length - 1);
        } else {
            switch (path) {
                case "postsignup":
                    return <PostSignUp / > ;
                    break;
                case "dashboard":
                    return <DashBoard / > ;
                    break;
                default:
                    window.location.pathname = "/dashboard";
                    break;
            }
        }
    }

    render() {
        var container = this.containerSelector();
        return ( <div> { container } </div>
        );
    }
}


export default hot(module)(PostLoginRouter);
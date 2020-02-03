//PreLogin Router File

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import Login from '../../Containers/prelogin/login';
import SignUp from '../../Containers/prelogin/signup';
import PostAuth from '../../Containers/prelogin/postAuth';
import LandingPage from "../../Components/prelogin/landingpage";
import PostSignUpForm from '../../Containers/prelogin/postSignUpForm';
import {urls} from "../../../../lib/constants/dataConstants";

function PreLoginRouter (props) {

   function reRenderRoot (){
       props.rerenderRouter();
   }

   function containerSelector() {
        var path = window.location.pathname.substring(1).toLowerCase();
        if (/[a-z]+\//g.test(path) && !/[a-z]+\/[a-z]+/g.test(path)) {
            window.location.pathname = "/" + path.substring(0, path.length - 1);
        } else {
            switch (path) {
                case "login":
                    return <Login reRenderRoot = {reRenderRoot}/>;
                    break;
                case "signup":
                    return <SignUp reRenderRoot = {reRenderRoot}/>;
                    break;
                case "postauth":
                    return <PostAuth reRenderRoot = {reRenderRoot}/>;
                    break;
                case "landing":
                    return <LandingPage/>;
                    break;
                case "postsignupform":
                    return <PostSignUpForm reRenderRoot = {reRenderRoot}/>;
                    break;    
                default:
                  if(path != "postsignupform"){
                    //TODO --> change the pushState 'state' and 'title'
                    window.history.pushState({}, "",urls.LANDING);
                    return <LandingPage/>;
                    break;
                  }
            }
        }

    }

    let container = containerSelector();
    return ( <div> { container } </div>);
}

const mapStateToProps = (state) => {
    return {
        url: state.urlStateReducer.currentUrl
    }
};

export default connect(mapStateToProps, null)(PreLoginRouter);
//PreLogin Router File

//Dependencies
import React from 'react';

import PostAuth from '../../Containers/prelogin/postAuth';
import LandingPage from "./landingpage";
import PostSignUpForm from '../../Containers/prelogin/postSignUpForm';
import {urls} from "../../../../lib/constants/contants";

export default function PreLoginRouter (props) {
   
   function containerSelector() {
        var path = window.location.pathname.substring(1).toLowerCase();
        if (/[a-z]+\//g.test(path) && !/[a-z]+\/[a-z]+/g.test(path)) {
            window.location.pathname = "/" + path.substring(0, path.length - 1);
        } else {
            switch (path) {
                case "postauth":
                    return <PostAuth />;
                    break;
                case "postsignupform":
                    return <PostSignUpForm />;
                    break; 
                default:
                    //TODO --> change the pushState 'state' and 'title'
                    window.history.replaceState({}, "",urls.LANDING);
                    return <LandingPage/>;
                    break;
            }
        }

    }
    let container = containerSelector();
    return ( <div className="preRouterContainer"> { container } </div>);
}

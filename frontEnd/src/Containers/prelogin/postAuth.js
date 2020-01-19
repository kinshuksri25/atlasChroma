//Dependencies
import React, { Component } from 'react';
import url from 'url';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import DashBoard from "../postlogin/dashboard"
import httpsMiddleware from '../../middleware/httpsMiddleware';
import localSession from '../../Components/sessionComponent';
import {urls} from "../../../../lib/constants/dataConstants";
import {ERRORS} from "../../../../lib/constants/dataConstants";
import setUrlAction from "../../store/actions/urlActions";

class postAuth extends Component{

        constructor(props){
                super(props);
                this.postAuthReq = this.postAuthReq.bind(this);
        }

        componentDidMount(){
            let authObject = url.parse(window.location.href,true);   
            this.postAuthReq(authObject.query);    
        };

        postAuthReq(queryObject){
                let headers = {};

                window.history.pushState({}, "","/postAuth");
              
                httpsMiddleware.httpsRequest("/postAuth", "POST", headers, queryObject, function(error,responseObject) {
                         if(error || responseObject.Status == "ERROR"){
                             //TODO --> add error msg div
                             //TODO --> use set timeout to display errormsg
                             //return the user to login page
                        }else{
                             //set the session 
                             localSession.setSessionObject(responseObject.sessionObject);
                             //TODO --> add the routes 
                             let route  = responseObject.newUser ? "/postAuthForm" : "/dashboard";
                             window.history.pushState({},"",route);
                             props.setUrlState(route);  
                        }
                });  
        }

        render(){
                return (<div> "postAuth" </div>);
        }             
}

const mapDispatchToProps = dispatch => {
        return {
            setUrlState: (url) => {
                dispatch(setUrlAction(url));
            }
        };
};
    
export default connect(null, mapDispatchToProps)(postAuth);

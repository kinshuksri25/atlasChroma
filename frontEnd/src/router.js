//Central Router File

//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import setUrlAction from "./store/actions/urlActions"; 
import cookieManager from './Components/cookieManager';
import PreLoginRouter from './Components/prelogin/preLoginRouter';
import PostLoginRouter from './Containers/postlogin/postLoginRouter';

class Router extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        setInterval(() => {
            if(this.props.currentUrl == "" || this.props.currentUrl != window.location.pathname){
                this.props.setUrlState(window.location.pathname);
            } 
        },1000);
    }

    render(){
        let router = cookieManager.getUserSessionDetails() ? <PostLoginRouter/> : < PreLoginRouter/>;
        return ( <div> {router} </div>);
    }
}

const mapStateToProps = state => {
    return {
        currentUrl: state.urlStateReducer.currentUrl
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUrlState: (url) => {
            dispatch(setUrlAction(url));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Router);
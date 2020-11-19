//Central Router File

//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import setUrlAction from "./store/actions/urlActions"; 
import MsgContainer from './Containers/generalContainers/msgContainer';
import cookieManager from './Components/cookieManager';
import LoadingComponent from './Containers/generalContainers/loadingComponent';
import PreLoginRouter from './Components/prelogin/preLoginRouter';
import PostLoginRouter from './Containers/postlogin/postLoginRouter';
import Modal from 'react-modal';

class Router extends Component {

    constructor(props){
        super(props); 
        this.state={
            online:true
        }
    }

    componentDidMount(){
        setInterval(() => {
            if(this.props.currentUrl == "" || this.props.currentUrl != window.location.pathname){
                this.props.setUrlState(window.location.pathname);
            } 
            this.setState({online:navigator.onLine});
        },500);
    }

    render(){
        let router = cookieManager.getUserSessionDetails() ? <PostLoginRouter/> : < PreLoginRouter/>;
        return (<div className="routerContainer"> 
                    <MsgContainer/>
                    <LoadingComponent/>
                    <Modal
                    isOpen={!this.state.online}>
                        Uh-Oh!, You Just got disconnected.
                    </Modal>
                    {router} 
                </div>);
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
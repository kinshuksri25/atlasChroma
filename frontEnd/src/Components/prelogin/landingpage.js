//Landing Page

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {urls} from "../../../../lib/constants/dataConstants";
import setUrlAction from "../../store/actions/urlActions";

function Landing (props) {

	function onClickHandler(event){
		switch(event.target.id){
			case "SignUp":
				//TODO --> change the pushState 'state' and 'title'
				window.history.pushState({}, "",urls.SIGNUP);
				props.setUrlState(urls.SIGNUP);
				break; 
			case "Login":
				//TODO --> change the pushState 'state' and 'title'
				window.history.pushState({}, "",urls.LOGIN);
				props.setUrlState(urls.LOGIN);
				break;
		}
	}

	return (<div> "Landing Page" 
				<button id = "SignUp" onClick = {onClickHandler}>SignUp</button>
				<button id = "Login" onClick = {onClickHandler}>Login</button>
			</div>);
}

const mapDispatchToProps = dispatch => {
    return {
        setUrlState: (url) => {
            dispatch(setUrlAction(url));
        }
    };
};

export default connect(null, mapDispatchToProps)(Landing);
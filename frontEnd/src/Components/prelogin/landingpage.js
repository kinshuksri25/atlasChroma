//Landing Page

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";

import {urls} from "../../../../lib/constants/contants";

export default function Landing (props) {

	function onClickHandler(event){
		switch(event.target.id){
			case "SignUp":
				//TODO --> change the pushState 'state' and 'title'
				window.history.pushState({}, "",urls.SIGNUP);
				break; 
			case "Login":
				//TODO --> change the pushState 'state' and 'title'
				window.history.pushState({}, "",urls.LOGIN);
				break;
		}
	}

	return (<div> "Landing Page" 
				<button id = "SignUp" onClick = {onClickHandler}>SignUp</button>
				<button id = "Login" onClick = {onClickHandler}>Login</button>
			</div>);
}

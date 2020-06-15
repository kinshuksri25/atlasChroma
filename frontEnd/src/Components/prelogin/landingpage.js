//Landing Page

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";

import '../../StyleSheets/landingPage.css';
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

	return (<div className="backgroundDiv">
				<div className="landingPageContainer">
					<div className = "titleContainer">
						<h1 className = "landingTitle">Welcome to Atlas Chroma</h1>	 
						<h2 className = "landingSubtitle">A complete, customizable solution to all you project management needs</h2>
					</div>				
					<div className="buttonContainer">
						<button className = "signUpButton" id = "SignUp" onClick = {onClickHandler}>SignUp</button>
						<button className = "loginButton" id = "Login" onClick = {onClickHandler}>Login</button>
					</div>
				</div>
			</div>);
}

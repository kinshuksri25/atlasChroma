//Landing Page

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { render } from 'react-dom';

import '../../StyleSheets/landingPage.css';
import Login from './login';
import Signup from './signup';
import Modal from 'react-modal';

class Landing extends Component {

	constructor(props){
		super(props);
		this.state = {
			selectedTemplate : "",
			isOpen : false
		};	
		this.onClickHandler = this.onClickHandler.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	onClickHandler(event){
		switch(event.target.id){
			case "SignUp":
				this.setState({selectedTemplate : <Signup closeModal = {this.closeModal}/>, isOpen : true});
				break; 
			case "Login":
				this.setState({selectedTemplate : <Login chosenTemplate = "Login" closeModal = {this.closeModal}/>, isOpen : true});
				break;
			case "GoogleLogin":
				this.setState({selectedTemplate : <Login chosenTemplate = "GoogleLogin" closeModal = {this.closeModal}/>, isOpen : true});
				break;			
		}
	}

	closeModal(){
		this.setState({selectedTemplate : "",isOpen : false});
	}

	render(){
		return (
			<div className="backgroundDiv">
				<div className="landingPageContainer">
					<div className = "titleContainer">
						<h1 className = "landingTitle">Welcome to Atlas Chroma</h1>	 
						<h2 className = "landingSubtitle">A complete, customizable solution to all you project management needs</h2>
					</div>				
					<div className="buttonContainer">
						<button className = "signUpButton" id = "SignUp" onClick = {this.onClickHandler}>SignUp</button>
						<button className = "loginButton" id = "Login" onClick = {this.onClickHandler}>Login</button>
						<button className = "googleLoginButton" id = "GoogleLogin" onClick = {this.onClickHandler}>Login with Google</button>
					</div>
				</div>
				<Modal
				isOpen={this.state.isOpen}
				onRequestClose={this.closeModal}
				contentLabel="">
					{this.state.selectedTemplate}
				</Modal>
			</div>);
	}
}

export default Landing;
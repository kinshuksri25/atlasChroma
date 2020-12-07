//Landing Page

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { render } from 'react-dom';

import titleImage from "../../Images/icons/logo.png";
import landingPageImage from "../../Images/background/landingBackground.svg";
import "../../StyleSheets/preLogin.css";
import PreLoginForms from '../../Containers/prelogin/preLoginForms';

class Landing extends Component {
	render(){
		return (
			<div fluid className="preloginRootContainer">
				<img src={landingPageImage} alt="landingBackgroundImage" className="landingBackgroundImage"/>
				<div className = "upperTitleContainer">
					<div className = "lowerTitleContainer">
						<h1 className = "landingTitle"><span><img src={titleImage} alt="TitleImage" className="titleImage"/></span>Sokratic</h1>	 
						<h2 className = "landingSubtitle">Lets Get Productive!</h2>
					</div>
				</div>				
				<div className="formContainer">
					<PreLoginForms/>
				</div>
			</div>);
	}
}

export default Landing;
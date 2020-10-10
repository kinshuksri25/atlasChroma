//Landing Page

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { render } from 'react-dom';

import "../../StyleSheets/preLogin.css";
import PreLoginForms from '../../Containers/prelogin/preLoginForms';

class Landing extends Component {
	render(){
		return (
			<div fluid className="preloginRootContainer">
				<div className = "upperTitleContainer">
					<div className = "lowerTitleContainer">
						<h1 className = "landingTitle">Welcome to Atlas Chroma</h1>	 
						<h2 className = "landingSubtitle">A complete, customizable solution to all you project management needs</h2>
					</div>
				</div>				
				<div className="formContainer">
					<PreLoginForms/>
				</div>
			</div>);
	}
}

export default Landing;
//Landing Page

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { render } from 'react-dom';

import "../../StyleSheets/preLogin.css";
import {Container,Row,Col} from 'react-bootstrap';
import PreLoginForms from '../../Containers/prelogin/preLoginForms';

class Landing extends Component {
	render(){
		return (
			<Container fluid className="backgroundDiv">
				<Row className="landingPageContainer">
					<Col xs={9} className = "titleContainer">
						<h1 className = "landingTitle">Welcome to Atlas Chroma</h1>	 
						<h2 className = "landingSubtitle">A complete, customizable solution to all you project management needs</h2>
					</Col>				
					<Col className="buttonContainer">
						<PreLoginForms/>
					</Col>
				</Row>
			</Container>);
	}
}

export default Landing;
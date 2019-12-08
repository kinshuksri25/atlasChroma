//Dependencies
import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import localSession from '../Components/sessionComponent';

//middleware has to be added to dependencies

class LandingPage extends Component
{
	
	constructor(props)
	{
		super(props);
		this.state = {
			
		};
	}
	
	componentDidMount()
	{		
	}	
	
	render()
	{
		return(
			
			<div>"LandingPage"</div>
			
		);
	}
}


export default hot(module)(LandingPage);
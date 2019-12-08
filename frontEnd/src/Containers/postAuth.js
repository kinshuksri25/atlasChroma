//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import localSession from '../Components/sessionComponent';

//middleware has to be added to dependencies

class PostAuth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "authCode": ""
        };
    }

    componentDidMount() {
        console.log(window.location.search);
    }


    render() {
        return (

            <
            div > "DashBoard" < /div>

        );
    }
}


export default hot(module)(PostAuth);
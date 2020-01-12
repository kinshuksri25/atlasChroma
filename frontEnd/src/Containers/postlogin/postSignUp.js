//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import localSession from '../../Components/sessionComponent';

//middleware has to be added to dependencies

class PostSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: ""
        };
    }

    componentDidMount() {}


    render() {
        return (

            <div > "PostSignUp" </div>

        );
    }
}


export default hot(module)(PostSignUp);
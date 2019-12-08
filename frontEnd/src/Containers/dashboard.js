//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import localSession from '../Components/sessionComponent';

//middleware has to be added to dependencies

class DashBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: ""
        };
    }

    componentDidMount() {}


    render() {
        return (

            <
            div > "DashBoard" < /div>

        );
    }
}


export default hot(module)(DashBoard);
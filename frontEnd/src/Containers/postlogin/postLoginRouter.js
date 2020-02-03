//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";

import DashBoard from './dashboard';
import {urls} from "../../../../lib/constants/dataConstants";

class PostLoginRouter extends Component {

    constructor(props) {
        super(props);
        this.reRenderRoot = this.reRenderRoot.bind(this);
    }

    reRenderRoot (){
        this.props.rerenderRouter();
    }

    //Router
    containerSelector() {
        var path = window.location.pathname.substring(1).toLowerCase();
        if (/[a-z]+\//g.test(path) && !/[a-z]+\/[a-z]+/g.test(path)) {
            window.location.pathname = "/" + path.substring(0, path.length - 1);
        } else {
            switch (path) {
                case "dashboard":
                    return <DashBoard reRenderRoot = {this.reRenderRoot}/>;
                    break;
                default:
                    console.log(path);
                    //TODO --> change the pushState 'state' and 'title'
                    window.history.pushState({}, "",urls.DASHBOARD);
                    return <DashBoard/>;
                    break;
            }
        }
    }

    render() {
        var container = this.containerSelector();
        return ( <div> { container } </div>);
    }
}


export default hot(module)(PostLoginRouter);
//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import {urls} from '../../../../lib/constants/contants';
import SimpleForm from '../../Forms/simpleform';
import formConstants from '../../Forms/formConstants';

class StoryForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            storyForm : "",
            priorityList : ["Urgent","High","Medium","Low","OnHold"],
            contributorList : [...this.props.user.projects.contributors],
            currentStatusList : []
        };
    }

    componentDidMount(){
    }

    render(){
        return (<div> {this.state.storyForm} </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(StoryForm); 
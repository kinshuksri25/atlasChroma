//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

function IssueTracker (props) {
        return (<div> "IssueTracker" </div>);
}

const mapStateToProps = (state) => {
    return {
            users: state.userStateReducer
        }
};

export default connect(mapStateToProps,null)(IssueTracker);
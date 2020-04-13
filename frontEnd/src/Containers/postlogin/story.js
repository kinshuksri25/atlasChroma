//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

class Story extends Component{
    constructor(props){
        super(props);
        this.state = {
                        storyTitle : "",
                        storyDescription : "",
                        currentStatus : "",
                        id : "",
                        contributor : "",
                        priority : "",
                        startDate : "",
                        dueDate : "",
                        comments : "",
                     };
        this.buildStoryTile = this.buildStoryTile.bind(this);                     
    }

    componentDidMount(){
        this.setState({storyTitle:this.props.storytitle,
                       storyDescription:this.props.description,
                       currentStatus:this.props.currentstatus,
                       id:this.props._id,
                       contributor:this.props.contributor,
                       priority:this.props.priority,
                       startDate:this.props.startdate,
                       dueDate : this.props.duedate,
                       comments:this.props.comments});
    }

    buildStoryTile(){
        
    }

    render(){
        let story = this.buildStoryTile();
        return({story});
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(Story); 

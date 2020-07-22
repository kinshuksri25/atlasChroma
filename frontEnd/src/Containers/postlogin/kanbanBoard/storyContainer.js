//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import Story from './story';

class StoryContainer extends Component{
    constructor(props){
        super(props);
        this.getStories = this.getStories.bind(this);  
        this.sortStories = this.sortStories.bind(this);
        this.buildStoryContainer = this.buildStoryContainer.bind(this);  
    }

    getStories(){
        let stories = [];
        let projectID = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
        this.props.user.projects.map(project => {
            project._id == projectID &&  project.storydetails.map(story => {
                story.currentstatus == this.props.columnID && stories.push(story);
            });    
        });
        return stories;
    }

    sortStories(stories){
        let priorityList = {
            "Urgent" : 5,
            "High" : 4,
            "Medium" : 3,
            "Low"  : 2,
            "OnHold" : 1
        };
        let sel={},tempVal={},counter=0,selIndex=0;
        let arrLen = stories.length;
        for(let i = 0; i < arrLen; i++){
            counter = i;
            sel = stories[i];
            while(counter < arrLen){
                if(priorityList[stories[counter]["priority"]] >= priorityList[sel["priority"]])
                {
                  if(priorityList[stories[counter]["priority"]] == priorityList[sel["priority"]]){
                    if(stories[counter]["duedate"] <= sel["duedate"]){
                        sel = stories[counter];
                        selIndex = counter;
                    }
                  }else{
                    sel = stories[counter];
                    selIndex = counter;
                  }
                } 
                counter++;
            }
            tempVal = stories[i];
            stories[i] = sel;
            stories[selIndex] = tempVal;
        }
        return stories;
    }
    
    buildStoryContainer(){
        let stories = this.getStories();
        stories = this.sortStories(stories);
        let storyContainer = stories.map(story => {
            return <Story storyDetails = {story}/>
        });
        return(<div>{storyContainer}</div>);
    }

    render(){
        let storyContainerJSX = this.buildStoryContainer();
        return(<div className = "storyContainer">
                    {storyContainerJSX}
               </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(StoryContainer); 

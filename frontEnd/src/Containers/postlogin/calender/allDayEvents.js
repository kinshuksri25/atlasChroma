//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

class AllDayEvent extends Component{
    constructor(props){
        super(props);
        this.allDayJSX = this.allDayJSX.bind(this);
        this.onStoryClick = this.onStoryClick.bind(this);
        this.sortStories = this.sortStories.bind(this);
    }

    onStoryClick(event){
        let projectID = "";
        this.props.allDayStories.map(story => {  //this has to come from props
            if(story._id == event.target.id){
                projectID = story.projectID;
            }
        });
        let url = "/projects/"+projectID+"?storyID="+event.target.id; 
        window.history.replaceState({}, "",url);
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
                    sel = stories[counter];
                    selIndex = counter;
                } 
                counter++;
            }
            tempVal = stories[i];
            stories[i] = sel;
            stories[selIndex] = tempVal;
        }
        return stories;
    }

    allDayJSX(){
        let sortedStories = this.sortStories(this.props.allDayStories); //this has to come from props
        let allDayJSX = [];
        sortedStories.map(story => {
            allDayJSX.push(<div className = {story.priority} id = {story._id} onClick={this.onStoryClick}>  
                                <h3>{story.storytitle}</h3>
                                <h4>{story.description}</h4>
                                <h4>Priority : {story.priority}</h4>
                            </div>);
        });
        this.props.allDayEvents.map(event => {      //this has to come from props
            allDayJSX.push(<div className = "eventTab" id = {event._id} onClick={this.props.onClick}>  
                <h3>{event.EventTitle}</h3>
                <h4>{event.Description}</h4>
            </div>);
        });
        return (<div>{allDayJSX}</div>);
    }

    render(){
        return(<div>{this.allDayJSX()}</div>);
    }
}

export default connect(null,null)(AllDayEvent); 
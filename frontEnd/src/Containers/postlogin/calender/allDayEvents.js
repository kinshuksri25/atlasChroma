//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hot } from "react-hot-loader";
import {Card, CardGroup} from 'react-bootstrap';

import "../../../StyleSheets/allDayEvents.css";
import DateHelper from "../../generalContainers/date";

class AllDayEvent extends Component{
    constructor(props){
        super(props);
        this.allDayJSX = this.allDayJSX.bind(this);
        this.onStoryClick = this.onStoryClick.bind(this);
        this.onProjectClick = this.onProjectClick.bind(this);
        this.sortStories = this.sortStories.bind(this);
    }

    onStoryClick(event){
        let projectID = "";
        this.props.allDayStories.map(story => {  
            if(story._id == event.currentTarget.id){
                projectID = story.projectID;
            }
        });
        let url = "/projects/"+projectID+"?storyID="+event.currentTarget.id; 
        window.history.replaceState({}, "",url);
    }

    onProjectClick(event){
        let url = "/projects/"+event.currentTarget.id; 
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
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentMonth = parseInt(currentDateObject.month)+1;
        let currentDate= currentDateObject.year+"-"+currentMonth+"-"+currentDateObject.date;
        let currentDay = this.props.currentYear+"-"+(parseInt(this.props.currentMonth)+1)+"-"+this.props.currentDate;
        if(this.props.allDayEvents.length == 0 && this.props.allDayStories.length == 0 && this.props.user.projects.length == 0){
            return <div className = "emptyHeadingContainer"><h3 className = "emptyHeading">Nothing planned for today..</h3></div>;
        }else{
            let sortedStories = this.sortStories(this.props.allDayStories); 
            let allDayJSX = [];
            
            this.props.user.projects.map( project => {
                 if(project.duedate == currentDay && project.contributors.indexOf(this.props.user.username) >= 0){
                    allDayJSX.push(
                        <div className = {project.status} id = {project._id} onClick={this.onProjectClick}>  
                                    <p className = "cardTitle">{project.title}</p>
                                    <p className = "cardDescription">{project.description}</p>
                                    {project.duedate < currentDate && project.status == "InProgress" && <p className = "projStatus">OverDue</p>}
                                    {project.duedate >= currentDate && project.status == "InProgress" && <p className = "projStatus">InProgress</p>}
                                    {project.status == "InProgress" || <p className = "projStatus">Finished</p>}
                        </div>);
                 }
            });


            sortedStories.map(story => {
                allDayJSX.push(<div className = {story.priority} id = {story._id} onClick={this.onStoryClick}>  
                                    <p className = "cardTitle">{story.storytitle}</p>
                                    <p className = "cardDescription">{story.description}</p>
                                    <p className = "status">Priority : {story.priority}</p>
                                </div>);
            });
            this.props.allDayEvents.map(event => {  
                allDayJSX.push(<div className = "allDayCard" id = {event._id} onClick={this.props.onClick}>    
                                    <p className = "cardTitle">{event.EventTitle}</p>
                                    <p className = "cardDescription">{event.Description}</p>
                                </div>);
            });
            return (<div className = "CardGroup">{allDayJSX}</div>);
        }
    }

    render(){
        return(<div className = "innerEventContainer">{this.allDayJSX()}</div>);
    }
}

const mapStateToProps = state => {
    return {
        user : state.userStateReducer
    }
}

export default connect(mapStateToProps,null)(AllDayEvent); 
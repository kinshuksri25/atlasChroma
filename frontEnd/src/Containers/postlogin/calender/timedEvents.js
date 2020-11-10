//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import "../../../StyleSheets/timedEvents.css";

class TimedEvent extends Component{
    constructor(props){
        super(props);
        this.sortStories = this.sortStories.bind(this);
        this.timedJSX = this.timedJSX.bind(this);
    }

    sortStories(stories){
        let sel={},tempVal={},counter=0,selIndex=0;
        let arrLen = stories.length;
        for(let i = 0; i < arrLen; i++){
            counter = i;
            sel = stories[i];
            while(counter < arrLen){
                if(stories[counter]["StartTime"] <= sel["StartTime"]){
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

    timedJSX(){
        if(this.props.timedEvents.length == 0){
            return <div className = "emptyHeadingContainer"><h3 className = "emptyHeading">Nothing planned for today..</h3></div>;
        }else{
            let sortedEvent = this.sortStories(this.props.timedEvents); 
            let timedJSX = [];
            sortedEvent.map(event => {
                timedJSX.push(<div className = {event.status} id = {event._id} onClick={this.props.onClick}>  
                                <div className = "scheduledCardTitle">{event.EventTitle}</div>
                                <div className = "cardBody">
                                    <p className = "scheduledCardDescription">{event.Description}</p>
                                    {event.status == "YettoStart" && <div className = "timing"><span>Starts: {event.StartTime}</span>  <span>Ends: {event.EndTime}</span></div>}
                                    {event.status != "YettoStart" && <span className = "status">{event.status}</span>}
                                </div>
                            </div>);
            });
            return (<div className = "CardGroup">{timedJSX}</div>);
        }
    }

    render(){
        return(<div className = "innerEventContainer">{this.timedJSX()}</div>);
    }
}

export default connect(null,null)(TimedEvent); 
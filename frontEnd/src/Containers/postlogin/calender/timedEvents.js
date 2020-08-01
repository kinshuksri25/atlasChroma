//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import DateHelper from '../../generalContainers/date';

class TimedEvent extends Component{
    constructor(props){
        super(props);
        this.state = {  dateHelper : new DateHelper(),
                        currentTime : "",
                        eventDate : props.currentYear+"-"+props.currentMonth+"-"+props.currentDate}
        this.setCurrentTime = this.setCurrentTime.bind(this);
        this.sortStories = this.sortStories.bind(this);
        this.timedJSX = this.timedJSX.bind(this);
    }
    
    componentDidMount(){
        this.setCurrentTime();
        setInterval(() => {
            this.setCurrentTime();
        },1800000);
    }

    setCurrentTime(){
        let currentDateObject = this.state.dateHelper.currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        if(currentDate == this.state.eventDate)
            this.setState({currentTime : currentDateObject.time});
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
        let sortedEvent = this.sortStories(this.props.timedEvents); 
        let timedJSX = [];
        let currentDateObject = this.state.dateHelper.currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        sortedEvent.map(event => {
            let status = "";
            let startTime = event.StartTime.indexOf(":") == 2 ? event.StartTime.substring(0,2) : event.StartTime.substring(0,1);
            let currentTime = this.state.currentTime.indexOf(":") == 2 ? this.state.currentTime.substring(0,2) : this.state.currentTime.substring(0,1);
            if(this.state.currentTime == ""){
                status = currentDate < this.state.eventDate ? "Yet to Start" : "Finished"
            }else{
                status = startTime > currentTime ? "Yet to Start" : startTime <= currentTime ? "Finished" : "Current Active";
            }
            timedJSX.push(<div className = {status} id = {event._id} onClick={this.props.onClick}>  
                            <h3>{event.EventTitle}                         {status}</h3>
                            <h4>{event.Description}</h4>
                            <h5>Starts At: {event.StartTime}   Ends At: {event.EndTime}</h5>
                        </div>);
        });
        return (<div>{timedJSX}</div>);
    }

    render(){
        return(<div>{this.timedJSX()}</div>);
    }
}

export default connect(null,null)(TimedEvent); 
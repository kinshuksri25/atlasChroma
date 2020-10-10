//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DateHelper from '../../generalContainers/date';
import JitsiContainer from '../jitsi';

class MeetingEvent extends Component{
    constructor(props){
        super(props);
        this.state = {  dateHelper : new DateHelper(),
                        currentTime : "",
                        eventDate : props.currentYear+"-"+props.currentMonth+"-"+props.currentDate,
                        isOpen : false};
        this.meetingJSX = this.meetingJSX.bind(this);
        this.setCurrentTime = this.setCurrentTime.bind(this);
        this.sortStories = this.sortStories.bind(this);
        this.startMeeting = this.startMeeting.bind(this);
        this.closeMeeting = this.closeMeeting.bind(this);
    }

    componentDidMount(){
        this.setCurrentTime();
        setInterval(() => {
            this.setCurrentTime();
        },1800000);
    }

    setCurrentTime(){
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
        let currentDay = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+currentDay;
        let eventDate = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;
        if(currentDate == eventDate)
            this.setState({currentTime : new Date().getHours().toString()+":00"});
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

    meetingJSX(){
        if(this.props.meetings.length == 0){
            return <div className = "emptyHeadingContainer"><h3 className = "emptyHeading">Nothing planned for today..</h3></div>;
        }else{
            let sortedEvent = this.sortStories(this.props.meetings);
            let meetings = [];
            let currentDateObject = this.state.dateHelper.currentDateGenerator();
            let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
            sortedEvent.map(event => {
                let status = "";
                let startTime = parseInt(event.StartTime.substring(0,2));
                let endTime = parseInt(event.EndTime.substring(0,2));
                let currentTime = parseInt(this.state.currentTime.substring(0,2));
                if(this.state.currentTime == ""){
                    status = currentDate < this.state.eventDate ? "YettoStart" : "Finished"
                }else{
                    status = startTime > currentTime ? "YettoStart" : startTime <= currentTime && endTime <= currentTime ? "Finished" : "CurrentlyActive";
                }
                meetings.push(<div className = {status} id = {event._id} onClick={event.creator == this.props.user.username && this.props.onClick}>  
                                <div className="scheduledCardTitle" onClick={event.creator == this.props.user.username && this.props.onClick}>RoomName: {event.EventTitle}</div>
                                <h5 className="creator" onClick={event.creator == this.props.user.username && this.props.onClick}>MeetingCreator: {event.creator}</h5>
                                <h5 className="code">MeetingCode: {event.password}</h5>
                                <button className = "startMeeting" onClick = {this.startMeeting} disabled = {false}>Start Meeting</button>
                                {status == "YettoStart" && <div className = "timing"><span>Starts: {event.StartTime}</span>  <span>Ends: {event.EndTime}</span></div>}
                                {status != "YettoStart" && <span className = "status">{status}</span>}
                            </div>);
            });
            return (<div className = "CardGroup">{meetings}</div>);
        }
    }

    startMeeting (event){
        let selectedEvent = {};
        this.props.meetings.map(meeting => {
            if(event.target.className == meeting._id)
                selectedEvent =  meeting;
        });
        let roomDetails = {
            roomname : selectedEvent.EventTitle,
            name : this.props.user.firstname +" "+ this.props.user.lastname,
            password : selectedEvent.password
        }

        this.setState({isOpen : true, roomDetails : {...roomDetails}});
    }

    closeMeeting(){
        this.setState({isOpen : false, roomDetails : {}});
    }

    render(){
        return(<div className = "innerEventContainer">
                    {this.meetingJSX()}
                    <Modal
                    isOpen={this.state.isOpen}
                    contentLabel="">
                        <JitsiContainer roomDetails = {this.state.roomDetails} onClose = {this.closeMeeting}/>
                    </Modal>
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(MeetingEvent); 

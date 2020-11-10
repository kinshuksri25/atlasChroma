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
        this.state = {isOpen : false};
        this.meetingJSX = this.meetingJSX.bind(this);
        this.sortStories = this.sortStories.bind(this);
        this.startMeeting = this.startMeeting.bind(this);
        this.closeMeeting = this.closeMeeting.bind(this);
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
            sortedEvent.map(event => {
                meetings.push(<div className = {event.status} id = {event._id} onClick={event.creator == this.props.user.username && this.props.onClick}>  
                                <div className="scheduledCardTitle" onClick={event.creator == this.props.user.username && this.props.onClick}>{event.EventTitle}</div>
                                <span className="creator" onClick={event.creator == this.props.user.username && this.props.onClick}>Creator:{event.creator}</span>
                                <div className="meetingDescription">{event.Description}</div>  
                                <button className = "startMeeting" onClick = {this.startMeeting} hidden = {event.status != "CurrentlyActive"}>&gt;</button>
                                {event.status == "YettoStart" && <div className = "timing"><span>Starts: {event.StartTime}</span>  <span>Ends: {event.EndTime}</span></div>}
                                {event.status == "Finished" && <span className = "status">{event.status}</span>}
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

//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import Modal from 'react-modal';

import "../../../StyleSheets/events.css";
import formConstants from '../../../Forms/formConstants';
import cookieManager from '../../../Components/cookieManager';
import SearchFeild from '../../../Forms/searchFeildForm';
import url from 'url';
import AllDayEvent from './allDayEvents';
import TimedEvent from './timedEvents';
import MeetingEvent from './meetingEvents';
import searchFeildConstants from '../../../Forms/searchFeildConstants';
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import SimpleForm from '../../../Forms/simpleform';
import setMsgAction from '../../../store/actions/msgActions';
import setUserAction from '../../../store/actions/userActions';

class Events extends Component{
    constructor(props){
        super(props);
        this.state ={
            options : ["All Day","Timed","Meeting"],
            allDayStories : [],
            allDayEvents : [],
            timedEvents : [],
            meetings : [],
            selectedEvent : {},
            eventType : "",
            startTime : "",
            endTime : "",
            EventTitle : "",
            Description : "",
            currentTime : "",
            participants : [this.props.user.username],
            currentMode : ""
        };
        this.addEvent = this.addEvent.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.suggestionAllocator = this.suggestionAllocator.bind(this);
        this.createUnfilteredList = this.createUnfilteredList.bind(this);
        this.removeParticipant = this.removeParticipant.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.triggerModal = this.triggerModal.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.checkUpdate = this.checkUpdate.bind(this);
    }

    static getDerivedStateFromProps(props,state){
        let allDayEvents = [];
        let allDayStories = [];
        let timedEvents = [];
        let meetings = [];
        props.user.projects.map(project => {
            project.storydetails.map(story => {
                let allDayEvent = {...story};
                allDayEvent.projectID = project._id;
                let currentAdjustedMonth = 1+parseInt(props.currentMonth);
                currentAdjustedMonth = currentAdjustedMonth < 10 ? "0"+currentAdjustedMonth : currentAdjustedMonth;
                allDayEvent.contributor == props.user.username && 
                allDayEvent.duedate == props.currentYear+"-"+currentAdjustedMonth+"-"+props.currentDate && allDayStories.push(allDayEvent);
            });
        });
        
        props.user.events.map(event => {
            if(props.currentYear+"-"+props.currentMonth+"-"+props.currentDate == event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate){
                switch(event.EventType){
                    case "All Day":
                        allDayEvents.push(event);
                        break;
                    case "Timed":
                        timedEvents.push(event);
                        break;
                    case "Meeting":
                        meetings.push(event);
                        break;                        
                }
            }                   
        });

        let newState = {...state};
        newState.allDayStories = [...allDayStories];
        newState.allDayEvents = [...allDayEvents];
        newState.timedEvents = [...timedEvents];
        newState.meetings = [...meetings];
        return {...newState};
    }

    componentDidMount(){
        let eventID = url.parse(window.location.href,true).query.eventID;
        let date = this.props.currentYear+this.props.currentMonth+this.props.currentDate;
        if(eventID != undefined){
            let selectedEvent = {};
            let combinedArray = [...this.state.allDayStories,...this.state.allDayEvents,...this.state.timedEvents];
            combinedArray.map(event => {

                selectedEvent = eventID == event._id ? event : selectedEvent;
            });
            JSON.stringify(selectedEvent) == JSON.stringify({}) && window.history.pushState({},"",date);
            JSON.stringify(selectedEvent) != JSON.stringify({}) && this.setState({
                currentMode : "EDIT",eventType : selectedEvent.EventType,startTime: selectedEvent.EventType != "All Day" ? selectedEvent.StartTime : "",
                endTime: selectedEvent.EventType != "All Day" ? selectedEvent.EndTime : "",
                EventTitle:selectedEvent.EventTitle,
                Description:selectedEvent.Description,
                selectedEvent : selectedEvent, 
                participants : selectedEvent.EventType == "Meeting" ? selectedEvent.participants : ""
            });
        }
    }

    
    removeParticipant(event){
        let participants = [...this.state.participants];
        let errorObject = {};
        if(event.target.id == this.props.user.username || participants.length == 2){
            errorObject.msg = event.target.id == this.props.user.username ? "You cannot remove the meeting creator" : "You need to have alteast 1 participant";
            errorObject.status = "ERROR";
            this.props.setMsgState(errorObject);
            return;
        }
        participants.indexOf(event.target.id) > 0 && participants.splice(participants.indexOf(event.target.id),1);
        this.setState({participants : participants});
    }
    
    triggerModal(event){
        console.log(event.target.className);
        let date = this.props.currentYear+this.props.currentMonth+this.props.currentDate;
        if(event.target.className == "ADD"){
            this.setState({currentMode : "ADD",eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",selectedEvent:{},participants:[this.props.user.username]});
        }else if(event.target.className == "CLOSE"){
            this.state.currentMode != "ADD" && window.history.pushState({}, "",date);
            this.setState({currentMode : "",eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",selectedEvent:{},participants:[this.props.user.username]});
        }else{
            let combinedArray = [...this.state.allDayEvents,...this.state.timedEvents,...this.state.meetings];
            let selectedEvent = {};
            combinedArray.map(combiEvent => {
                if(combiEvent._id == event.target.id)
                {
                    selectedEvent = {...combiEvent};
                }
            }); 
            let participants = selectedEvent.hasOwnProperty("participants") ? selectedEvent.participants : this.state.participants;
            this.setState({currentMode : "EDIT",eventType : selectedEvent.EventType,startTime: selectedEvent.StartTime,
                                        endTime: selectedEvent.EndTime,EventTitle:selectedEvent.EventTitle,Description:selectedEvent.Description,selectedEvent : selectedEvent, participants : [...participants]},() => {
                                            window.history.pushState({}, "",date+"?eventID="+selectedEvent._id);
                                        });
        }
    }
    
    updateEvent(){
        let date = this.props.currentYear+this.props.currentMonth+this.props.currentDate;
        let eventObject = {};
        let errorObject = {};
        let globalThis = this;
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};

        if(this.state.EventTitle != this.state.selectedEvent.EventTitle){
            eventObject.EventTitle = this.state.EventTitle;
        } if(this.state.Description != this.state.selectedEvent.Description){
            eventObject.Description = this.state.Description;
        } if(this.state.eventType == "Timed" || this.state.eventType == "Meeting"){
            if(this.state.endTime != this.state.selectedEvent.EndTime){
                eventObject.EndTime = this.state.endTime;
            }if(this.state.endTime != this.state.selectedEvent.StartTime){
                eventObject.StartTime = this.state.startTime;
            }if(this.state.eventType == "Meeting" && this.state.participants != this.state.selectedEvent.participants){
                eventObject.participants = this.state.participants;
                eventObject.originalParticipants = this.state.selectedEvent.participants; 
            }
        }
        eventObject._id = this.state.selectedEvent._id;
        eventObject.EventType = this.state.selectedEvent.EventType;
        eventObject.oldTitle = this.state.selectedEvent.EventTitle;
        httpsMiddleware.httpsRequest("/event","PUT",headers,{...eventObject},function(error,responseObject){
            if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }
            else{
                if(eventObject.EventType != "Meeting"){
                    let userObject = {...globalThis.props.user};
                    let count = 0;
                    userObject.events.map(event => {
                        if(event._id == globalThis.state.selectedEvent._id){
                            if(eventObject.hasOwnProperty("EventTitle")){
                                event.EventTitle = eventObject.EventTitle;
                            } if(eventObject.hasOwnProperty("Description")){
                                console.log(eventObject.Description);
                                event.Description = eventObject.Description;
                            } if(eventObject.EventType == "Timed"){
                                if(eventObject.hasOwnProperty("EndTime")){
                                    event.EndTime = eventObject.EndTime;
                                } if(eventObject.hasOwnProperty("StartTime")){
                                    event.StartTime = eventObject.StartTime;
                                } if(eventObject.hasOwnProperty("participants")){
                                    event.participants = eventObject.participants;
                                }
                            }
                        }else{
                            count++;
                        }
                    });
                    globalThis.props.setUserState(userObject);
                }
            }
        });
        globalThis.setState({currentMode : "",eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",participants:[globalThis.props.user.username]}); 
        window.history.pushState({}, "",date);
    }
    
    deleteEvent(){
        let date = this.props.currentYear+this.props.currentMonth+this.props.currentDate;
        let errorObject = {};
        let globalThis = this;
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let eventIDQuery = "eventID="+this.state.selectedEvent._id;
        httpsMiddleware.httpsRequest("/event","DELETE",headers,eventIDQuery,function(error,responseObject) {
            if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                if(error){
                    errorObject.msg = error;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }else{
                    errorObject.msg = responseObject.EMSG;
                    errorObject.status = "ERROR";
                    globalThis.props.setMsgState(errorObject);
                }
            }
            else{
                if(globalThis.state.selectedEvent.EventType != "Meeting"){
                    let userObject = {...globalThis.props.user};
                    let count = 0;
                    userObject.events.map(event => {
                        if(event._id == globalThis.state.selectedEvent._id){
                            userObject.events.splice(count,1);
                        }else{
                            count++;
                        }
                    });
                    globalThis.props.setUserState(userObject);
                }
            }
        });
        globalThis.setState({currentMode : "",eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",participants:[globalThis.props.user.username]}); 
        window.history.pushState({}, "",date);
    }
    
    addEvent(formObject){
        let errorObject = {};
        let globalThis = this;
        let invalidTime = false;
        if(this.state.eventType != ""){
            if(this.state.eventType == "Timed" || this.state.eventType == "Meeting"){
                if  (this.state.endTime == "" || 
                        this.state.startTime == "" ||
                            this.state.endTime <= this.state.startTime){
                                invalidTime = true;
                }else{
                    [...this.state.timedEvents,...this.state.meetings].map(event => {
                        if((this.state.startTime < event.EndTime && this.state.endTime > event.StartTime) ||
                                (this.state.endTime > event.StartTime && this.state.startTime < event.EndTime)){
                                    invalidTime = true;
                            }        
                    });
                } 
            }

            if(!invalidTime){
                let eventObject = {...formObject.formData};
                let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
                eventObject.EventType = globalThis.state.eventType;
                eventObject.CreationDate = globalThis.props.currentDate;
                eventObject.CreationMonth = globalThis.props.currentMonth;
                eventObject.CreationYear = globalThis.props.currentYear;
                if(globalThis.state.eventType == "Timed" || globalThis.state.eventType == "Meeting"){
                    eventObject.StartTime = globalThis.state.startTime;
                    eventObject.EndTime = globalThis.state.endTime;
                    if(globalThis.state.eventType == "Meeting" ){
                        if(globalThis.state.participants.length > 1){
                            eventObject.participants = [...globalThis.state.participants];
                            eventObject.creator = globalThis.props.user.username;   
                        }else{
                            errorObject.msg = "You need to have atleast 1 participant";
                            errorObject.status = "ERROR";
                            globalThis.props.setMsgState(errorObject);
                            return;
                        }
                    }
                }
                httpsMiddleware.httpsRequest(formObject.route,formObject.method, headers, {eventObject : {...eventObject}},function(error,responseObject) {
                    if(error || (responseObject.STATUS != 200 && responseObject.STATUS != 201)){
                        if(error){
                            errorObject.msg = error;
                            errorObject.status = "ERROR";
                            globalThis.props.setMsgState(errorObject);
                        }else{
                            errorObject.msg = responseObject.EMSG;
                            errorObject.status = "ERROR";
                            globalThis.props.setMsgState(errorObject);
                        }
                    }else{
                        if(eventObject.EventType != "Meeting"){
                            eventObject._id = responseObject.PAYLOAD.eventID;

                            if(globalThis.state.eventType == "Meeting"){
                               eventObject.password = responseObject.PAYLOAD.password;
                            } 
    
                            let userObject = {...globalThis.props.user};
                            userObject.events.push(eventObject);
                            globalThis.props.setUserState(userObject);
                        }
                    }
                });
                globalThis.setState({currentMode : "",eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",participants : [globalThis.props.user.username]});
            }else{
                errorObject.msg = "Start/End Time is invalid";
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }
        }else{
            errorObject.msg = "event type is empty";
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
    }
    
    onChangeHandler(event){

        switch(event.target.className){
            case "eventTypeDropDown":
                this.setState({eventType : event.target.value});
                break;
            case "stateTime" : 
                this.setState({startTime : event.target.value});
                break;
            case "endTime" : 
                this.setState({endTime : event.target.value});
                break;      
            case "title" :
                this.setState({EventTitle : event.target.value});
                break; 
            case "description" :
                this.setState({Description : event.target.value});
                break;                                                                      
        }
    }
    
    checkUpdate(){
        if(this.state.eventType != "" && this.state.EventTitle != "" && this.state.Description != ""){
            let enableUpdate = ((this.state.EventTitle != this.state.selectedEvent.EventTitle) || 
                                    (this.state.Description != this.state.selectedEvent.Description) ||
                                        (this.state.selectedEvent.hasOwnProperty("participants") && JSON.stringify(this.state.participants) != JSON.stringify(this.state.selectedEvent.participants))) ? false : true;
                                  
            if(this.state.eventType == "Timed" || this.state.eventType == "Meeting"){
                let invalidTime = false;
                if((this.state.startTime == this.state.selectedEvent.StartTime
                        && this.state.endTime == this.state.selectedEvent.EndTime)
                            ||this.state.endTime == "" || this.state.startTime == "" ||
                                this.state.endTime <= this.state.startTime){
                    invalidTime = true;                                            
                }
                if(this.state.timedEvents.length != 1 || this.state.meetings.length != 1 ){
                    [...this.state.timedEvents,...this.state.meetings].map(event => {
                        if(event._id != this.state.selectedEvent._id){
                            if((this.state.startTime < event.EndTime && this.state.endTime > event.StartTime) ||
                                    (this.state.endTime > event.StartTime && this.state.startTime < event.EndTime)){
                                        invalidTime = true;
                                }
                       }
                    });
                }
                enableUpdate = !invalidTime || !enableUpdate ? false : true;         
            }  
            return enableUpdate;
        }else{
            return true;
        }
    }
    
    suggestionAllocator(selectedValue,searchBoxID){
        let participants = [...this.state.participants];
        participants.indexOf(selectedValue) > 0 || participants.push(selectedValue);
        this.setState({participants : participants});
    }
    
    createUnfilteredList(){
        let userList = [...this.props.userList];
        userList.map(user => {
            user.id = user.username;
            user.title = user.firstname + " " + user.lastname;
        });
        return userList;
    }

    render(){
        let timeArray = ["00:00","01:00","02:00","03:00","04:00",
                        "05:00","06:00","07:00","08:00",
                        "09:00","10:00","11:00","12:00",
                        "13:00","14:00","15:00","16:00",
                        "17:00","18:00","19:00","20:00",
                        "21:00","22:00","23:00"];
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
        let currentDay = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+currentDay;
        let eventDate = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;                                                                                                                                            
        return(<div className = "calenderDateLowerEventContainer">
                    <button variant="success" disabled = {eventDate < currentDate} className = "ADD" onClick = {this.triggerModal}>+</button>
                    <Modal
                    isOpen={this.state.currentMode != ""}
                    contentLabel="">
                            <button onClick = {this.triggerModal} className = "CLOSE">X</button>
                            <select className="eventTypeDropDown" onChange={this.onChangeHandler} disabled = {this.state.currentMode == "EDIT"}>
                                <option value = "">EventType</option>
                                {
                                    this.state.options.map(option => {
                                        if(option == this.state.eventType)
                                            return <option value={option} selected>{option}</option>
                                        else 
                                            return <option value={option}>{option}</option>
                                    })
                                }
                            </select>
                            <select className="stateTime" onChange={this.onChangeHandler} hidden={this.state.eventType == "All Day" || this.state.eventType == ""}>
                                    <option value = "">Start Time</option>
                                {
                                    timeArray.map(time => {
                                        if(time == this.state.startTime)
                                            return <option value={time} selected>{time}</option>
                                        else 
                                            return <option value={time}>{time}</option>
                                    })
                                }
                            </select>
                            <select className="endTime" onChange={this.onChangeHandler} hidden={this.state.eventType == "All Day" || this.state.eventType == ""}>
                                    <option value = "">End Time</option>
                                {
                                    timeArray.map(time => {
                                        if(time == this.state.endTime)
                                            return <option value={time} selected>{time}</option>
                                        else 
                                            return <option value={time}>{time}</option>
                                    })
                                }
                            </select>
                            <div className = "participantsContainer" hidden = {this.state.eventType != "Meeting"}>
                                <SearchFeild 
                                onRemoveClick = {this.removeParticipant}
                                unfilteredList = {this.createUnfilteredList()} 
                                constants = {searchFeildConstants.addParticipants} 
                                onSuggestionClick = {this.suggestionAllocator}/>
                            </div>
                            {this.state.currentMode == "EDIT" && <div>
                                                                    <input type = "text" value = {this.state.EventTitle} className = "title" onChange={this.onChangeHandler}/>
                                                                    <input type = "text" value = {this.state.Description} className = "description" onChange={this.onChangeHandler}/>
                                                                    <button onClick = {this.updateEvent} disabled={this.checkUpdate()}>Update</button>
                                                                    <button onClick = {this.deleteEvent}>Delete</button>
                                                                </div>} 
                            {this.state.currentMode == "EDIT" || <div>
                                                                    <SimpleForm formAttributes = { formConstants.addEvent }
                                                                    submitHandler = { this.addEvent }
                                                                    changeFieldNames = {[]} />
                                                                </div>}                                                                    
                    </Modal>
                    <div className = "allDayContainer">
                        <h4 className = "eventHeading">All Day Events</h4>
                        <AllDayEvent allDayEvents={this.state.allDayEvents} allDayStories = {this.state.allDayStories} onClick = {this.triggerModal}/>
                    </div>               
                    <div className = "timedContainer">
                        <h4 className = "eventHeading">Scheduled Events</h4>
                        <TimedEvent timedEvents={this.state.timedEvents} onClick = {this.triggerModal} currentYear = {this.props.currentYear} currentMonth = {this.props.currentMonth} currentDate = {this.props.currentDate}/>
                    </div>                
                    <div className = "meetingContainer"> 
                        <h4 className = "eventHeading">Meetings</h4>
                        <MeetingEvent meetings={this.state.meetings} onClick = {this.triggerModal} currentYear = {this.props.currentYear} currentMonth = {this.props.currentMonth} currentDate = {this.props.currentDate}/>
                    </div>              
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer,
        userList: state.userListStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserState: (userObject) => {
            dispatch(setUserAction(userObject));
        },
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Events); 
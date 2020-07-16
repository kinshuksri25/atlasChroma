//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import formConstants from '../../../Forms/formConstants';
import cookieManager from '../../../Components/cookieManager';
import SearchFeild from '../../../Forms/searchFeildForm';
import searchFeildConstants from '../../../Forms/searchFeildConstants';
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import SimpleForm from '../../../Forms/simpleform';
import setMsgAction from '../../../store/actions/msgActions';
import setUserAction from '../../../store/actions/userActions';
import JitsiContainer from '../jitsi';

class Events extends Component{
    constructor(props){
        super(props);
        this.state ={
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
            showEditForm : false,
            meetingContainer : ""
        };
        this.allDayJSX = this.allDayJSX.bind(this);
        this.sortStories = this.sortStories.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.setCurrentTime = this.setCurrentTime.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.suggestionAllocator = this.suggestionAllocator.bind(this);
        this.createUnfilteredList = this.createUnfilteredList.bind(this);
        this.removeParticipant = this.removeParticipant.bind(this);
        this.closeMeeting = this.closeMeeting.bind(this);
        this.timedJSX = this.timedJSX.bind(this);
        this.meetingJSX = this.meetingJSX.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.onStoryClick = this.onStoryClick.bind(this);
        this.startMeeting = this.startMeeting.bind(this);
        this.addEventHandler = this.addEventHandler.bind(this);
        this.checkUpdate = this.checkUpdate.bind(this);
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

    static getDerivedStateFromProps(props,state){
        if(JSON.stringify(state.allDayEvents) == JSON.stringify([]) || JSON.stringify(state.allDayStories) == JSON.stringify([])){
            let allDayEvents = [];
            let allDayStories = [];
            let timedEvents = [];
            let meetings = [];
            props.user.projects.map(project => {
                project.storydetails.map(story => {
                    let allDayEvent = {...story};
                    allDayEvent.projectID = project._id;
                    let currentAdjustedMonth = 1+parseInt(props.currentMonth);
                    allDayEvent.contributor == props.user.username && 
                    allDayEvent.duedate == props.currentYear+"-"+"0"+currentAdjustedMonth+"-"+props.currentDate && allDayStories.push(allDayEvent);
                });
            });
            
            props.user.events.map(event => {
                if(event.EventType == "All Day" && 
                    props.currentYear+"-"+props.currentMonth+"-"+props.currentDate == event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate)
                    allDayEvents.push(event);
                if(event.EventType == "Timed" && 
                    props.currentYear+"-"+props.currentMonth+"-"+props.currentDate == event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate) 
                    timedEvents.push(event); 
                    
                if(event.EventType == "Meeting" && 
                    props.currentYear+"-"+props.currentMonth+"-"+props.currentDate == event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate) 
                    meetings.push(event);                    
            });

            let newState = {...state};
            newState.allDayStories = [...allDayStories];
            newState.allDayEvents = [...allDayEvents];
            newState.timedEvents = [...timedEvents];
            newState.meetings = [...meetings];
            return {...newState};
        }else{
            return null;
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

    onEventClick(event){
        if(event.target.className.includes('eventTab')){
            let combinedArray = [...this.state.allDayEvents,...this.state.timedEvents,...this.state.meetings];
            let selectedEvent = {};
            combinedArray.map(combiEvent => {
                if(combiEvent._id == event.target.id)
                {
                    selectedEvent = {...combiEvent};
                }
            }); 
            let participants = selectedEvent.hasOwnProperty("participants") ? selectedEvent.participants : this.state.participants;
            this.setState({showEditForm : true,eventType : selectedEvent.EventType,startTime: selectedEvent.StartTime,
                                        endTime: selectedEvent.EndTime,EventTitle:selectedEvent.EventTitle,Description:selectedEvent.Description,selectedEvent : selectedEvent, participants : [...participants]});
        }else{
            this.setState({showEditForm : false,eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",selectedEvent:{},participants:[this.props.user.username]});
        } 
    }

    onStoryClick(event){
        let projectID = "";
        this.state.allDayStories.map(story => {
            if(story._id == event.target.id){
                projectID = story.projectID;
            }
        });
        let url = "/boards/"+projectID+"?storyID="+event.target.id; 
        window.history.replaceState({}, "",url);
    }

    allDayJSX(){
        let sortedStories = this.sortStories(this.state.allDayStories);
        let allDayJSX = [];
        sortedStories.map(story => {
            allDayJSX.push(<div className = {story.priority} id = {story._id} onClick={this.onStoryClick}>  
                                <h3>{story.storytitle}</h3>
                                <h4>{story.description}</h4>
                                <h4>Priority : {story.priority}</h4>
                            </div>);
        });
        this.state.allDayEvents.map(event => {
            allDayJSX.push(<div className = "eventTab" id = {event._id} onClick={this.onEventClick}>  
                <h3>{event.EventTitle}</h3>
                <h4>{event.Description}</h4>
            </div>);
        });
        return (<div>{allDayJSX}</div>);
    }

    updateEvent(){
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
        httpsMiddleware.httpsRequest("/event","PUT",headers,{...eventObject},{},function(error,responseObject){
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
                let userObject = {...globalThis.props.user};
                let count = 0;
                userObject.events.map(event => {
                    if(event._id == globalThis.state.selectedEvent._id){
                        if(eventObject.hasOwnProperty("EventTitle")){
                            event.EventTitle = eventObject.EventTitle;
                        } if(eventObject.hasOwnProperty("Description")){
                            event.Description = eventObject.Description;
                        } if(eventObject.EventType == "Timed" || eventObject.EventType == "Meeting"){
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
                globalThis.setState({showEditForm : false,eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",participants:[globalThis.props.user.username]}); 
            }
        });
    }

    deleteEvent(){
        let errorObject = {};
        let globalThis = this;
        let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
        let eventIDQuery = "eventID="+this.state.selectedEvent._id;
        httpsMiddleware.httpsRequest("/event","DELETE",headers,eventIDQuery,{},function(error,responseObject) {
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
                globalThis.setState({showEditForm : false,eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",participants:[globalThis.props.user.username]}); 
            }
        });
    }

    timedJSX(){
        let sortedEvent = this.sortStories(this.state.timedEvents,"TimedEvents");
        let timedJSX = [];
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
        let currentDay = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+currentDay;
        let eventDate = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;
        sortedEvent.map(event => {
            let status = "";
            let startTime = event.StartTime.indexOf(":") == 2 ? event.StartTime.substring(0,2) : event.StartTime.substring(0,1);
            let currentTime = this.state.currentTime.indexOf(":") == 2 ? this.state.currentTime.substring(0,2) : this.state.currentTime.substring(0,1);
            if(this.state.currentTime == ""){
                status = currentDate < eventDate ? "Yet to Start" : "Finished"
            }else{
                status = startTime > currentTime ? "Yet to Start" : startTime <= currentTime ? "Finished" : "Current Active";
            }
            let className = status+" eventTab";
            timedJSX.push(<div className = {className} id = {event._id} onClick={this.onEventClick}>  
                            <h3>{event.EventTitle}                         {status}</h3>
                            <h4>{event.Description}</h4>
                            <h5>Starts At: {event.StartTime}   Ends At: {event.EndTime}</h5>
                        </div>);
        });
        return (<div>{timedJSX}</div>);
    }

    sortStories(stories,type = "Stories"){
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
                if(type == "Stories"){
                    if(priorityList[stories[counter]["priority"]] >= priorityList[sel["priority"]])
                    {
                        sel = stories[counter];
                        selIndex = counter;
                    } 
                }else{
                    if(stories[counter]["StartTime"] <= sel["StartTime"]){
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

    addEvent(formObject){
        let errorObject = {};
        let globalThis = this;
        let invalidTime = false;
        if(this.state.eventType != ""){

            if(this.state.eventType == "Timed" || this.state.eventType == "Meeting"){
                this.state.timedEvents.map(event => {
                    if(this.state.endTime == "" ||
                        this.state.startTime == "" ||
                            this.state.endTime <= this.state.startTime ||
                                (this.state.startTime < event.EndTime && this.state.endTime > event.StartTime) ||
                                    (this.state.endTime > event.StartTime && this.state.startTime < event.EndTime)){
                                        invalidTime = true;
                    }
                });
                this.state.meetings.map(event => {
                    if(this.state.endTime == "" ||
                        this.state.startTime == "" ||
                            this.state.endTime <= this.state.startTime ||
                                (this.state.startTime < event.EndTime && this.state.endTime > event.StartTime) ||
                                    (this.state.endTime > event.StartTime && this.state.startTime < event.EndTime)){
                                        invalidTime = true;
                    }
                });  
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
                httpsMiddleware.httpsRequest(formObject.route,formObject.method, headers, {eventObject : {...eventObject}},{},function(error,responseObject) {
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
                        eventObject._id = responseObject.PAYLOAD.eventID;

                        if(globalThis.state.eventType == "Meeting"){
                           eventObject.password = responseObject.PAYLOAD.password;
                        } 

                        let userObject = {...globalThis.props.user};
                        userObject.events.push(eventObject);
                        globalThis.props.setUserState(userObject);
                        globalThis.setState({addNewEvent : false,eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",participants : [globalThis.props.user.username]});
                    }
                });
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

    onDropDownChange(event){

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

    addEventHandler(event){
        if(event.target.className == "addEvent"){
            this.setState({addNewEvent : true});
        }else{
            this.setState({eventType : "", startTime : "", endTime : "",addNewEvent : false});   
        }
    }

    checkUpdate(){
        if(this.state.eventType != "" && this.state.EventTitle != "" && this.state.Description != ""){
            let enableUpdate = ((this.state.EventTitle != this.state.selectedEvent.EventTitle) || 
                                    (this.state.Description != this.state.selectedEvent.Description) ||
                                        (this.state.selectedEvent.hasOwnProperty("participants") && JSON.stringify(this.state.participants) != JSON.stringify(this.state.selectedEvent.participants))) ? false : true;
                                  
            if(this.state.eventType == "Timed" || this.state.eventType == "Meeting"){
                let invalidTime = false;
                if(this.state.timedEvents.length == 1 && (this.state.startTime == this.state.selectedEvent.StartTime
                                                            && this.state.endTime == this.state.selectedEvent.EndTime)){
                    invalidTime = true;                                            
                }else{
                    this.state.timedEvents.map(event => {
                        if(event._id != this.state.selectedEvent._id){
                            if(this.state.endTime == "" ||
                                this.state.startTime == "" ||
                                    this.state.endTime <= this.state.startTime ||
                                        (this.state.startTime == this.state.selectedEvent.StartTime
                                            && this.state.endTime == this.state.selectedEvent.EndTime)||
                                        (this.state.startTime < event.EndTime && this.state.endTime > event.StartTime) ||
                                            (this.state.endTime > event.StartTime && this.state.startTime < event.EndTime)){
                                                invalidTime = true;
                                }
                       }
                    }); 
                    this.state.meetings.map(event => {
                        if(event._id != this.state.selectedEvent._id){
                            if(this.state.endTime == "" ||
                                this.state.startTime == "" ||
                                    this.state.endTime <= this.state.startTime ||
                                        (this.state.startTime == this.state.selectedEvent.StartTime
                                            && this.state.endTime == this.state.selectedEvent.EndTime)||
                                        (this.state.startTime < event.EndTime && this.state.endTime > event.StartTime) ||
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

    meetingJSX(){
        let sortedEvent = this.sortStories(this.state.meetings,"Meeting");
        let meetings = [];
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
        let currentDay = new Date().getDate().toString().length != 1 ? new Date().getDate() : "0"+new Date().getDate();
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+currentDay;
        let eventDate = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;
        sortedEvent.map(event => {
            let status = "";
            let startTime = event.StartTime.indexOf(":") == 2 ? event.StartTime.substring(0,2) : event.StartTime.substring(0,1);
            let currentTime = this.state.currentTime.indexOf(":") == 2 ? this.state.currentTime.substring(0,2) : this.state.currentTime.substring(0,1);
            if(this.state.currentTime == ""){
                status = currentDate < eventDate ? "Yet to Start" : "Finished"
            }else{
                status = startTime > currentTime ? "Yet to Start" : startTime <= currentTime ? "Finished" : "Current Active";
            }
            let className = status+" eventTab";
            meetings.push(<div className = {className} id = {event._id} onClick={event.creator == this.props.user.username && this.onEventClick}>  
                            <h3>RoomName: {event.EventTitle}{status}</h3>
                            <h4><span>MeetingCreator: {event.creator}</span> <span>MeetingCode: {event.password}</span></h4>
                            <h4>{event.Description}</h4>  <button className = {event._id} onClick = {this.startMeeting} disabled = {false}>Start Meeting</button>
                            <h5>Starts At: {event.StartTime}   Ends At: {event.EndTime}</h5>
                        </div>);
        });
        return (<div>{meetings}</div>);
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

    startMeeting (event){
        let selectedEvent = {};
        this.state.meetings.map(meeting => {
            if(event.target.className == meeting._id)
                selectedEvent =  meeting;
        });
        let roomDetails = {
            roomname : selectedEvent.EventTitle,
            name : this.props.user.firstname +" "+ this.props.user.lastname,
            password : selectedEvent.password
        }

        this.setState({meetingContainer : <JitsiContainer roomDetails = {roomDetails} onClose = {this.closeMeeting}/>});
    }

    closeMeeting(){
        this.setState({meetingContainer : ""});
    }

    render(){
        let enableUpdate = this.state.showEditForm && this.checkUpdate();
        let displayTimedDropDown = this.state.eventType == "Timed" || this.state.eventType == "Meeting";
        let displayMeetingParticipants = this.state.eventType == "Meeting";
        let allDayJSX = this.allDayJSX();
        let timeJSX = this.timedJSX();
        let meetingJSX = this.meetingJSX();
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
        let options = ["All Day","Timed","Meeting"];
        let simpleForm = this.state.addNewEvent && !this.state.showEditForm ? <div>
                                                    <select className="eventTypeDropDown" onChange={this.onDropDownChange}>
                                                        <option value = "">EventType</option>
                                                        {
                                                            options.map(option => {
                                                               return <option value={option}>{option}</option>
                                                            })
                                                        }
                                                    </select>
                                                    <select className="stateTime" onChange={this.onDropDownChange} hidden={!displayTimedDropDown}>
                                                            <option value = "">Start Time</option>
                                                        {
                                                            timeArray.map(time => {
                                                                return(<option value={time}>{time}</option>);
                                                            })
                                                        }
                                                    </select>
                                                    <select className="endTime" onChange={this.onDropDownChange} hidden={!displayTimedDropDown}>
                                                            <option value = "">End Time</option>
                                                        {
                                                            timeArray.map(time => {
                                                                return(<option value={time}>{time}</option>);
                                                            })
                                                        }
                                                    </select>
                                                    <div className = "participantsContainer" hidden = {!displayMeetingParticipants}>
                                                        <SearchFeild unfilteredList = {this.createUnfilteredList()} constants = {searchFeildConstants.addParticipants} onSuggestionClick = {this.suggestionAllocator}/>
                                                    </div> 
                                                    <SimpleForm formAttributes = { formConstants.addEvent }
                                                    submitHandler = { this.addEvent }
                                                    changeFieldNames = {[]} />
                                                    <button className="cancelAdd" onClick={this.addEventHandler}>back</button>
                                                </div> : "";
        let editForm = this.state.showEditForm && !this.state.addNewEvent?  <div>
                                                                                <select className="eventTypeDropDown" onChange={this.onDropDownChange} disabled = {true}>
                                                                                    <option value = "">EventType</option>
                                                                                    {
                                                                                        options.map(option => {
                                                                                            if(option == this.state.eventType)
                                                                                                return <option value={option} selected>{option}</option>
                                                                                            else 
                                                                                                return <option value={option}>{option}</option>
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                                <select className="stateTime" onChange={this.onDropDownChange} hidden={!displayTimedDropDown}>
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
                                                                                <select className="endTime" onChange={this.onDropDownChange} hidden={!displayTimedDropDown}>
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
                                                                                <div className = "participantsContainer" hidden = {!displayMeetingParticipants}>
                                                                                    <SearchFeild unfilteredList = {this.createUnfilteredList()} constants = {searchFeildConstants.addParticipants} onSuggestionClick = {this.suggestionAllocator}/>
                                                                                    <ul className = "participantsList">
                                                                                      {
                                                                                        displayMeetingParticipants && this.state.participants.map(participant => {
                                                                                            return (<li onClick ={this.removeParticipant} id = {participant}>{participant}</li>)
                                                                                        })  
                                                                                      }
                                                                                    </ul>
                                                                                </div> 
                                                                                <input type = "text" value = {this.state.EventTitle} className = "title" onChange={this.onDropDownChange}/>
                                                                                <input type = "text" value = {this.state.Description} className = "description" onChange={this.onDropDownChange}/>
                                                                                <button onClick = {this.updateEvent} disabled={enableUpdate}>Update</button>
                                                                                <button onClick = {this.deleteEvent}>Delete</button>
                                                                                <button onClick = {this.onEventClick} className = "back">Back</button>
                                                                            </div> : "";                                                                                                                                                       
        return(<div>
                    <button disabled = {this.state.addNewEvent} hidden = {eventDate < currentDate || this.state.showEditForm} className = "addEvent" onClick = {this.addEventHandler}>+</button>
                    {simpleForm}
                    {editForm}
                    <h3>All Day Events</h3>
                    <hr/>
                    {allDayJSX}
                    <h3>Timed Events</h3>
                    <hr/>
                    {timeJSX}
                    <h3>Meetings</h3>
                    <hr/>
                    {meetingJSX}
                    <div>
                        {this.state.meetingContainer}
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
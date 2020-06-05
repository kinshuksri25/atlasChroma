//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import formConstants from '../../Forms/formConstants';
import cookieManager from '../../Components/cookieManager';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import SimpleForm from '../../Forms/simpleform';
import setMsgAction from '../../store/actions/msgActions';
import setUserAction from '../../store/actions/userActions';

class Events extends Component{
    constructor(props){
        super(props);
        this.state ={
            allDayStories : [],
            allDayEvents : [],
            timedEvents : [],
            selectedEvent : {},
            eventType : "",
            startTime : "",
            endTime : "",
            EventTitle : "",
            Description : "",
            currentTime : "",
            showEditForm : false
        };
        this.allDayJSX = this.allDayJSX.bind(this);
        this.sortStories = this.sortStories.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.setCurrentTime = this.setCurrentTime.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.timedJSX = this.timedJSX.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.onStoryClick = this.onStoryClick.bind(this);
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
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+new Date().getDate();
        let eventDate = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;
        if(currentDate == eventDate)
            this.setState({currentTime : new Date().getHours().toString()+":00"});
    }

    static getDerivedStateFromProps(props,state){
        if(JSON.stringify(state.allDayEvents) == JSON.stringify([]) || JSON.stringify(state.allDayStories) == JSON.stringify([])){
            let allDayEvents = [];
            let allDayStories = [];
            let timedEvents = [];
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
            });

            let newState = {...state};
            newState.allDayStories = [...allDayStories];
            newState.allDayEvents = [...allDayEvents];
            newState.timedEvents = [...timedEvents];
            return {...newState};
        }else{
            return null;
        }
    }

    onEventClick(event){
        if(event.target.className.includes('eventTab')){
            let combinedArray = [...this.state.allDayEvents,...this.state.timedEvents];
            let selectedEvent = {};
            combinedArray.map(combiEvent => {
                if(combiEvent._id == event.target.id)
                {
                    selectedEvent = {...combiEvent};
                }
            }); 
            this.setState({showEditForm : true,eventType : selectedEvent.EventType,startTime: selectedEvent.StartTime,
                                        endTime: selectedEvent.EndTime,EventTitle:selectedEvent.EventTitle,Description:selectedEvent.Description,selectedEvent : selectedEvent});
        }else{
            this.setState({showEditForm : false,eventType : "",startTime:"",endTime:"",EventTitle:"",Description:"",selectedEvent:{}});
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
    }

    timedJSX(){
        let sortedEvent = this.sortStories(this.state.timedEvents,"TimedEvents");
        let timedJSX = [];
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+new Date().getDate();
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
                            <h3>{event.EventTitle}                {status}</h3>
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
        if(this.state.eventType != ""){
            let result = this.state.eventType != "Timed" ? true : this.state.startTime != "" && this.state.endTime != "" && this.state.startTime != this.state.endTime && this.state.startTime.substring(0,3) < this.state.endTime.substring(0,3) ? true : false;
            result && this.state.timedEvents.map(event => {
                if(event.startTime <= this.state.startTime && event.endTime >=this.state.startTime || 
                    event.endTime >= this.state.endTime && event.startTime <=this.state.startTime){
                        result = false;
                }
            });
            if(result){
                let eventObject = {...formObject.formData};
                let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
                eventObject.EventType = globalThis.state.eventType;
                eventObject.CreationDate = globalThis.props.currentDate;
                eventObject.CreationMonth = globalThis.props.currentMonth;
                eventObject.CreationYear = globalThis.props.currentYear;
                if(globalThis.state.eventType == "Timed"){
                    eventObject.StartTime = globalThis.state.startTime;
                    eventObject.EndTime = globalThis.state.endTime;
                }
                httpsMiddleware.httpsRequest(formObject.route,formObject.method, headers, {eventObject : {...eventObject},email:globalThis.props.user.email}, function(error,responseObject) {
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
                        let userObject = {...globalThis.props.user};
                        userObject.events.push(eventObject);
                        globalThis.props.setUserState(userObject);
                        globalThis.setState({addNewEvent : false,eventType : "",startTime:"",endTime:"",EventTitle:"",Description:""});
                    }
                });
            }else{
                errorObject.msg = "start date or end date is empty, or they are equal";
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

    //need to work on this
    checkUpdate(){
        let enableUpdate = true;
        if(this.state.eventType != ""){
            if(this.state.eventType == "All Day"){
                enableUpdate =  this.state.EventTitle != "" || this.state.Description != this.state.selectedEvent.Description && this.state.Description != "" ? false : true;
            }else{
                if(this.state.startTime != "" && this.state.endTime != "" && this.state.startTime < this.state.endTime && 
                    this.state.startTime != this.state.selectedEvent.StartTime || this.state.endTime != this.state.selectedEvent.EndTime)
                {
                    let stateStartTime = this.state.startTime.indexOf(":") == 1 ? this.state.startTime.substring(0,1) : this.state.startTime.substring(0,2);
                    let stateEndTime =  this.state.endTime.indexOf(":") == 1 ? this.state.endTime.substring(0,1) : this.state.endTime.substring(0,2);
                    let invalidTime = false;
                    this.state.timedEvents.map(event => {
                        let eventStartTime = event.StartTime.indexOf(":") == 1 ? event.StartTime.substring(0,1) : event.StartTime.substring(0,2);
                        let eventEndTime = event.EndTime.indexOf(":") == 1 ? event.EndTime.substring(0,1) : event.EndTime.substring(0,2);
                       if(event._id != this.state.selectedEvent._id){
                            if((stateStartTime < eventStartTime && eventEndTime <= eventStartTime) ||
                                    (eventEndTime > eventEndTime && stateStartTime >= eventEndTime)){
                            }else{
                                invalidTime = true;
                            }
                       }
                    });
                    enableUpdate = !invalidTime && this.state.EventTitle != "" || this.state.Description != this.state.selectedEvent.Description && this.state.Description != "" ? false : true;
                }
            }   
        }
        return enableUpdate;
    }

    render(){
        let enableUpdate = false;//this.checkUpdate();
        let displayTimedDropDown = this.state.eventType == "Timed";
        let allDayJSX = this.allDayJSX();
        let timeJSX = this.timedJSX();
        let timeArray = ["0:00","1:00","2:00","3:00","4:00",
                        "5:00","6:00","7:00","8:00",
                        "9:00","10:00","11:00","12:00",
                        "13:00","14:00","15:00","16:00",
                        "17:00","18:00","19:00","20:00",
                        "21:00","22:00","23:00"];
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+new Date().getDate();
        let eventDate = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;                        
        let options = ["All Day","Timed"];
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
                                                    <SimpleForm formAttributes = { formConstants.addEvent }
                                                    submitHandler = { this.addEvent }
                                                    changeFieldNames = {[]} />
                                                    <button className="cancelAdd" onClick={this.addEventHandler}>back</button>
                                                </div> : "";
        let editForm = this.state.showEditForm && !this.state.addNewEvent?  <div>
                                                                                <select className="eventTypeDropDown" onChange={this.onDropDownChange}>
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
                                                                                <input type = "text" value = {this.state.EventTitle} className = "title" onChange={this.onDropDownChange}/>
                                                                                <input type = "text" value = {this.state.Description} className = "description" onChange={this.onDropDownChange}/>
                                                                                <button onClick = {this.updateEvent} disabled={enableUpdate}>Update</button>
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
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.userStateReducer
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
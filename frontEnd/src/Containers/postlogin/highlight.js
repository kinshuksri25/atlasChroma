//Dependencies
import React,{ Component } from "react";
import { connect } from 'react-redux';

import setMsgAction from '../../store/actions/msgActions';
import DateHelper from "../generalContainers/date";
import "../../StyleSheets/highlight.css";
class Highlight extends Component{

        constructor(props){
                super(props);
                this.sortEvents = this.sortEvents.bind(this);
                this.redirect = this.redirect.bind(this);
                this.complieStories = this.complieStories.bind(this);
                this.buildEventList = this.buildEventList.bind(this);
                this.buildStoriesList = this.buildStoriesList.bind(this);
                this.buildMissedConvo = this.buildMissedConvo.bind(this);
        }

        sortEvents (){
                let events = [];
                this.props.user.events.map(event => {
                        if(event.EventType != "All Day" && event.status != "finished"){
                                events.push(event);
                        } 
                });  
                if(events.length <= 1 ){
                   return events;     
                }
                for(let i=1;i<events.length;i++){
                        let finalPosition = -1;
                        let refDate = events[i].CreationYear+"-"+events[i].CreationMonth+"-"+events[i].CreationDate;
                        let refTime = events[i].StartTime;
                        for(let j=i-1;j>=0;j--){
                                let compDate = events[j].CreationYear+"-"+events[j].CreationMonth+"-"+events[j].CreationDate;
                                let compTime = events[j].StartTime;

                                if(refDate < compDate && j == 0){
                                        finalPosition = j;
                                }else if(refDate < compDate && j != 0 && refDate >  events[j-1].CreationYear+"-"+events[j-1].CreationMonth+"-"+events[j-1].CreationDate){
                                        finalPosition = j;
                                }else if(refDate > compDate && j == events.length-1){
                                        finalPosition = j;
                                }else if(refDate == compDate){
                                        if(refTime < compTime){
                                                finalPosition = j;
                                        }
                                }
                        }
                        if(finalPosition >= 0){
                                let tempValue = events[i];
                                let tempCounter = i-1;
                                while(tempCounter >= finalPosition){
                                        events[tempCounter+1] = events[tempCounter]; 
                                        tempCounter--;
                                }
                                events[finalPosition] = tempValue;
                        }
                }
                return events;       
        
        }

        complieStories (){
                let currentDateObject = new DateHelper().currentDateGenerator();
                let currentDate= currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
                let priorityList = {
                        "Urgent" : 5,
                        "High" : 4,
                        "Medium" : 3,
                        "Low"  : 2,
                        "OnHold" : 1
                };

                let compliedStories = [];
                this.props.user.projects.map(project => {
                        if(project.storydetails.length != 0){
                                project.storydetails.map(story => {
                                        if(story.duedate >= currentDate && story.contributor == this.props.user.username && story.status != "Finished"){
                                                let tempStory = {...story};
                                                tempStory.projectID = project._id;
                                                tempStory.projectName = project.title;
                                                compliedStories.push({...tempStory});
                                        }
                                });
                        }
                });
                for(let i = 1;i<compliedStories.length;i++){ 
                    let finalPosition = -1;
                    for(let j=i-1;j>=0;j--){
                        if(compliedStories[i].duedate < compliedStories[j].duedate){
                                finalPosition = j;
                        }else if(compliedStories[i].duedate == compliedStories[j].duedate && priorityList[compliedStories[i].priority] >= priorityList[compliedStories[j].priority]){
                                finalPosition = j;
                        }
                    }
                    if(finalPosition >= 0){
                        let tempValue = compliedStories[i];
                        let tempCounter = i-1;
                        while(tempCounter >= finalPosition){
                            compliedStories[tempCounter+1] = compliedStories[tempCounter]; 
                            tempCounter--;
                        }
                        compliedStories[finalPosition] = tempValue;
                    }
                }
            
                return compliedStories;
        }

        buildEventList(){
              let eventListJSX = [];
              let currentDateObject = new DateHelper().currentDateGenerator();
              let currentDate= currentDateObject.year+"-"+(parseInt(currentDateObject.month)+1)+"-"+currentDateObject.date;
              let compliedEvents = this.sortEvents();
              for(let j=0;j<compliedEvents.length && j<9;j++){
                let dateSum = compliedEvents[j].CreationYear+compliedEvents[j].CreationMonth+compliedEvents[j].CreationDate;      
                let link = "https://localhost:3000/scheduler/"+dateSum+"?eventID="+compliedEvents[j]._id;
                let refDate = compliedEvents[j].CreationYear+"-"+compliedEvents[j].CreationMonth+"-"+compliedEvents[j].CreationDate;
                let status = refDate > currentDate ? "Later" : compliedEvents[j].status == "YettoStart" ? "Today" : "Active";
                let description = compliedEvents[j].EventTitle.length > 20 ? compliedEvents[j].EventTitle.substring(0,18)+"..." : compliedEvents[j].EventTitle; 
                eventListJSX.push(<div className = {status} id={link} onClick={this.redirect}>
                                        {status == "Later" && <h6>You have <span title={compliedEvents[j].EventTitle}>{description}</span>, on {refDate} at {compliedEvents[j].StartTime}</h6>}
                                        {status == "Today" && <h6>You have <span title={compliedEvents[j].EventTitle}>{description}</span>,today at {compliedEvents[j].StartTime}</h6>}
                                        {status == "Active" && <h6>{description},has started</h6>}
                                </div>);    
              }  
              return [...eventListJSX];
        }

        buildStoriesList(){
                let storiesListJSX = [];
                let currentDateObject = new DateHelper().currentDateGenerator();
                let currentDate= currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
                let compliedStories = this.complieStories();
                for(let j=0;j<compliedStories.length && j<9;j++){
                        let link = "https://localhost:3000/projects/"+compliedStories[j].projectID+"?storyID="+compliedStories[j]._id;
                        let storyClass = compliedStories[j].priority + " stories";
                        let description = compliedStories[j].storytitle.length > 20 ? compliedStories[j].storytitle.substring(0,18)+"..." : compliedStories[j].storytitle; 
                        let projDescription = compliedStories[j].projectName.length > 20 ? compliedStories[j].projectName.substring(0,18)+"..." : compliedStories[j].projectName; 
                        storiesListJSX.push(<div className = {storyClass}  id={link} onClick={this.redirect}>
                                                {currentDate < compliedStories[j].duedate && <h6><span title={compliedStories[j].storytitle}>{description}</span>, part of <span title={compliedStories[j].projectName}>{projDescription}</span> is due at {compliedStories[j].duedate}</h6>}
                                                {currentDate == compliedStories[j].duedate && <h6><span title={compliedStories[j].storytitle}>{description}</span>, part of <span title={compliedStories[j].projectName}>{projDescription}</span> is due at today</h6>}
                                        </div>);
               }
                return [...storiesListJSX];
        }

        buildMissedConvo(){

                let missedConvo = [];
                let chatrooms = {...this.props.chatRooms};
                let keys = Object.keys(chatrooms);
                for(let i=0;i < keys.length;i++){
                        let senderName = "";
                        for(let j=0; j<chatrooms[keys[i]].length ;j++){
                                        if(!chatrooms[keys[i]][j].msgDelivered && this.props.user.username == chatrooms[keys[i]][j].recipient){
                                                this.props.userList.map(user => {
                                                        senderName = user.username == chatrooms[keys[i]][j].sender ? user.firstname : senderName;
                                                });
                                        }
                        }
                        senderName != "" && missedConvo.push(<div className="missedConvo"><h6>While you were away, {senderName} pinged you.</h6></div>);
                }
                return [...missedConvo];
        }

        redirect(event){
                window.history.replaceState({}, "",event.currentTarget.id);
        }

        render(){
                return(<div className="highLightContainer">
                                <div className="hightlightedStories">
                                        <h5>Highlighted Stories</h5>
                                        <div className="highlightsContainer">
                                                {this.buildStoriesList()}
                                        </div>
                                </div>
                                <div className="hightlightedEvents">
                                        <h5>Highlighted Events</h5>
                                        <div className="highlightsContainer">
                                                {this.buildEventList()}
                                        </div>
                                </div>
                                <div className="MissedConversation">
                                        <h5>Missed Conversation</h5>
                                        <div className="highlightsContainer">
                                                {this.buildMissedConvo()}
                                        </div>
                                </div> 
                        </div>);
        }
}

const mapStateToProps = (state) => {
        return {
            user: state.userStateReducer,
            userList : state.userListStateReducer,
            chatRooms: state.chatStateReducer
        }
};

const mapDispatchToProps = dispatch => {
        return { 
                setMsgState: (msgObject) => {
                dispatch(setMsgAction(msgObject));
                } 
        };
};
    
export default connect(mapStateToProps,mapDispatchToProps)(Highlight);
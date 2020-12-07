//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';
import {Button} from 'react-bootstrap';

import "../../../StyleSheets/calenderDate.css";
import Events from './events';
import Notes from './notes';
import DateHelper from '../../generalContainers/date';

class CalenderDate extends Component{
    constructor(props){
        super(props);
        this.state ={
            activeTab : "Events"
        };
        this.changeActiveTab = this.changeActiveTab.bind(this);
    }

    changeActiveTab(event){
        let eventButton = document.getElementById("Events");
        let notesButton = document.getElementById("Notes");
        let activeEvent = "";
        if(event.target.id == "Events"){
            activeEvent = "Events";
            eventButton.className = "foreground";
            notesButton.className = "background";
        }else{
            activeEvent = "Notes";
            eventButton.className = "background";
            notesButton.className = "foreground";
        }
        this.setState({activeTab : activeEvent});
    }

    render(){
        let date = this.props.currentYear+"-"+(parseInt(this.props.currentMonth)+1)+"-"+this.props.currentDate;
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+(parseInt(currentDateObject.month)+1)+"-"+currentDateObject.date;
        let heading = this.props.currentDate+" "+this.props.currentMonthName+" "+this.props.currentYear;
        return(<div className = "centralEventsNotesContainer">
                    <div className = "calenderDateUpperContainer">
                        <div className = "topUpperBlock">
                            <Button variant = "primary" className = "backButton" onClick={this.props.onClickHandler}>&#8672;</Button>
                            <div>{heading}</div>
                        </div>
                        <div className = "topLowerBlock">
                            <button id="Events" disabled={this.state.activeTab == "Events"} className="foreground" onClick={this.changeActiveTab}>Events</button>
                            <button id="Notes"  disabled={this.state.activeTab == "Notes"} className="background" onClick={this.changeActiveTab}>Notes</button>
                        </div>
                    </div>
                    {this.state.activeTab == "Events" && <Events currentMonth = {parseInt(this.props.currentMonth)+1} 
                                                                currentYear = {this.props.currentYear} 
                                                                currentDate = {this.props.currentDate}/> }
                    {this.state.activeTab == "Events" || <Notes calenderDate = {date} disableAdd = {date != currentDate}/>}                                                            
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

export default connect(mapStateToProps,mapDispatchToProps)(CalenderDate); 
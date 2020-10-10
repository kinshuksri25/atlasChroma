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
        let activeEvent = "";
        if(event.target.id == "Events"){
            activeEvent = "Events";
        }else{
            activeEvent = "Notes";
        }
        this.setState({activeTab : activeEvent});
    }

    render(){
        let date = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        let heading = this.props.currentDate+" "+this.props.currentMonthName+" "+this.props.currentYear;

        return(<div className = "centralEventsNotesContainer">
                    <div className = "calenderDateUpperContainer">
                        <div className = "topUpperBlock">
                            <Button className = "backButton" onClick={this.props.onClickHandler}>&#8672;</Button>
                            <h3 className = "calenderHeading">{heading}</h3>
                        </div>
                        <div className = "topLowerBlock">
                            <Button id="Events" disabled={this.state.activeTab == "Events"} variant="danger" className = "tab" onClick={this.changeActiveTab}>Events</Button>
                            <Button id="Notes"  disabled={this.state.activeTab == "Notes"} variant="info" className = "tab" onClick={this.changeActiveTab}>Notes</Button>
                        </div>
                    </div>
                    {this.state.activeTab == "Events" && <Events currentMonth = {this.props.currentMonth} 
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
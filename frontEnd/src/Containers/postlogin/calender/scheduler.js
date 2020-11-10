//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import "../../../StyleSheets/scheduler.css";
import DateHelper from '../../generalContainers/date';
import CalenderDate from './calenderDate';
import {urls} from "../../../../../lib/constants/contants";

class Scheduler extends Component {
        constructor(props){
                super(props);
                this.state={
                    currentMonth : "",
                    currentYear : "",
                    currentDate : "", 
                    dateHelper : new DateHelper()
                };
                this.buildCalender = this.buildCalender.bind(this);
                this.changeMonth = this.changeMonth.bind(this);
                this.onClickHandler = this.onClickHandler.bind(this);
        }

        static getDerivedStateFromProps(props,state){
             if(state.currentMonth == "" && state.currentYear == ""){
                let fullDate = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
                if(fullDate.length == "8"){
                        let date=fullDate.substring(6);
                        let month=fullDate.substring(4,6);
                        let year = fullDate.substring(0,4);
                        if( 1940 <= year && year <= 2200 && 0 <= month && month <= 11 && 1 <= date && date <= state.dateHelper.getMonthDays(month,year)){
                                console.log("called3");
                                return{ currentDate : date,
                                        currentMonth : month,
                                        currentYear : year };  
                        }else{
                                window.history.pushState({}, "",urls.SCHEDULER);    
                        }

                }else if(fullDate == "scheduler"){ 
                        let currentDateObject = state.dateHelper.currentDateGenerator();
                        return{ currentMonth : currentDateObject.month,
                                currentYear : currentDateObject.year };    
                }else{
                        window.history.pushState({}, "",urls.SCHEDULER); 
                }
             }
        }

        changeMonth(event){
                let currentMonth = this.state.currentMonth;
                if(currentMonth < "09"){        
                        currentMonth = event.target.className == "next" ? "0"+(parseInt(currentMonth)+1) : "0"+(parseInt(currentMonth)-1);
                }else{
                        currentMonth = event.target.className == "next" ? parseInt(currentMonth)+1 : currentMonth <= 10 ? "0"+(parseInt(currentMonth)-1) : parseInt(currentMonth)-1;
                }
                switch(event.target.className){
                        case "next" :  
                                if(this.state.currentMonth == "11"){
                                        this.setState({
                                                currentMonth : "00",
                                                currentYear : this.state.currentYear + 1
                                        });
                                }else{
                                        this.setState({
                                                currentMonth : currentMonth
                                        });
                                }
                                break;
                        case "previous" :
                                if(this.state.currentMonth == "00"){
                                        this.setState({
                                                currentMonth : "11",
                                                currentYear : this.state.currentYear - 1
                                        });
                                }else{
                                        this.setState({
                                                currentMonth : currentMonth
                                        });
                                }
                                break;
                }       
        }

        buildCalender(){
                let globalThis = this;
                let currentDayObject = this.state.dateHelper.currentDateGenerator();
                let noOfDays = this.state.dateHelper.getMonthDays(this.state.currentMonth,this.state.currentYear);
                let dayCounter = 1;
                let firstDay = new Date(this.state.currentYear,this.state.currentMonth,1).toDateString().substring(0,3);
                let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                let noOfWeeks =0;
                for(let i=0;i<days.length;i++){
                        noOfWeeks = days[i] == firstDay ? i : noOfWeeks;
                }
                noOfWeeks = noOfWeeks <= 4 ? 5 : 6;
                let currentWeek = 0;
                let calenderJSX = [];
                while(currentWeek <= noOfWeeks){
                        let weekJSX = days.map(day => {
                              if(currentWeek == 0){
                                return(<span className="calenderHeader">{day}</span>);
                              }else{
                                if(dayCounter == 1 ){
                                        if(firstDay == day){
                                                dayCounter++;
                                                if(currentDayObject.month == this.state.currentMonth && currentDayObject.date == "01")
                                                        return (<button className="calenderButton currentDay" id = {dayCounter-1} onClick = {globalThis.onClickHandler}>{dayCounter-1}</button>);
                                                else
                                                        return (<button className="calenderButton" id = {dayCounter-1} onClick = {globalThis.onClickHandler}>{dayCounter-1}</button>);
                                        }else{
                                                return(<button className="calenderButtonHidden" disabled={true}>0</button>);
                                        }
                                }else if(dayCounter <= noOfDays){
                                        let day = dayCounter.toString().length == 1 ? "0"+dayCounter.toString() : dayCounter;
                                        dayCounter++;
                                        if(currentDayObject.month == this.state.currentMonth && currentDayObject.date == day)
                                                return (<button className="calenderButton currentDay" id = {dayCounter-1} onClick = {globalThis.onClickHandler}>{dayCounter-1}</button>);
                                        else
                                                return (<button className="calenderButton" id = {dayCounter-1} onClick = {globalThis.onClickHandler}>{dayCounter-1}</button>);
                                } 
                              }     
                        });
                        currentWeek == 0 && calenderJSX.push(<div className = "daysContainer">{weekJSX}</div>);  
                        currentWeek != 0 && calenderJSX.push(<div className = "weekContainer">{weekJSX}</div>);  
                        currentWeek++;  
                }
                return calenderJSX;
        }

        onClickHandler(event){
                if(event.target.className == "calenderButton" || event.target.className == "calenderButton currentDay"){
                        let currentDay = event.target.id.length != 1 ? event.target.id : "0"+event.target.id;
                        this.setState({currentDate : currentDay},()=>{
                                let date = this.state.currentYear+this.state.currentMonth+this.state.currentDate;
                                window.history.replaceState({}, "","scheduler/"+date);
                        });
                }else{
                        this.setState({currentDate : ""});
                        window.history.replaceState({}, "",window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"))); 
                }    
        }

        render(){
                let month = {
                        "00" : "January",
                        "01" : "Februray",
                        "02" : "March",
                        "03" : "April",
                        "04" : "May",
                        "05" : "June",
                        "06" : "July",
                        "07" : "August",
                        "08" : "September",
                        "09" : "October",
                        "10" : "November",
                        "11"  : "December"                           
                     } 
                return(<div className = "parentSchedulerContainer">
                                {this.state.currentDate == "" &&   <div className = "calenderContainer"> 
                                                                        <div className = "calenderUpperBlock">
                                                                                <div className="calenderUpperInnerBlock">
                                                                                        <button onClick = {this.changeMonth} className = "previous">&lt;</button>
                                                                                        <div className = "calenderDateHeading">{month[this.state.currentMonth]},{this.state.currentYear}</div>
                                                                                        <button onClick = {this.changeMonth} className = "next">&gt;</button>
                                                                                </div>
                                                                        </div>
                                                                        <div className = "calenderLowerBlock">{this.buildCalender()}</div>
                                                                   </div>}

                                {this.state.currentDate == "" || <CalenderDate currentMonth = {this.state.currentMonth} 
                                                                  currentMonthName = {month[this.state.currentMonth]}
                                                                  currentYear = {this.state.currentYear} 
                                                                  currentDate = {this.state.currentDate} 
                                                                  onClickHandler={this.onClickHandler}/>}                                                                
                        </div>);
        }
}

const mapStateToProps = (state) => {
        return {
            user : state.userStateReducer
        }
    };
    
export default connect(mapStateToProps,null)(Scheduler); 
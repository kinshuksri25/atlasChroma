//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import CalenderDate from './calenderDate';
import {urls} from "../../../../../lib/constants/contants";

class Scheduler extends Component {
        constructor(props){
                super(props);
                this.state={
                    currentMonth : "",
                    currentYear : "",
                    currentDate : "",   
                };
                this.buildCalender = this.buildCalender.bind(this);
                this.getMonthDays = this.getMonthDays.bind(this);
                this.changeMonth = this.changeMonth.bind(this);
                this.onClickHandler = this.onClickHandler.bind(this);
        }

        componentDidMount(){
                let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
                this.setState({
                        currentMonth : currentMonth,
                        currentYear : new Date().getFullYear()  
                },()=>{
                        let currentDate = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
                        currentDate = currentDate.length == 1 && currentDate <= 9 && currentDate >0 ? "0"+currentDate : currentDate;
                        if(currentDate.length == 2 && currentDate <= this.getMonthDays() && currentDate > 0){
                                window.history.pushState({}, "",urls.SCHEDULER+"/"+currentDate);   
                                let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+new Date().getMonth() : new Date().getMonth();
                                this.setState({
                                    currentDate : currentDate   
                                });                 
                        }else{
                                if(currentDate != "scheduler"){
                                        window.history.pushState({}, "",urls.SCHEDULER);     
                                }
                        }
                }); 
        }

        getMonthDays(){
                let noOfDays = 0;
                let currentMonth = this.state.currentMonth;
                let currentYear = this.state.currentYear;
                if(currentMonth == 0 
                || currentMonth == 2 
                || currentMonth == 4 
                || currentMonth == 6 
                || currentMonth == 7
                || currentMonth == 9
                || currentMonth == 11){
                        noOfDays = 31;
                } else if(currentMonth == 3
                        || currentMonth == 5
                        || currentMonth == 8
                        || currentMonth == 10){
                        noOfDays = 30;        
                } else{
                        noOfDays = currentYear%4 && currentYear%100 && currentYear%400 ? 29 : 28;
                }
                return noOfDays;      
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
                let noOfDays = this.getMonthDays();
                let dayCounter = 1;
                let firstDay = new Date(this.state.currentYear,this.state.currentMonth,1).toDateString().substring(0,3);
                let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                let noOfWeeks =0;
                for(let i=0;i<days.length;i++){
                        noOfWeeks = days[i] == firstDay ? i : noOfWeeks;
                }
                noOfWeeks = noOfWeeks <= 4 ? 5 : 6;
                let currentWeek = 1;
                let calenderJSX = [];
                while(currentWeek <= noOfWeeks){
                        let weekJSX = days.map(day => {
                                if(dayCounter == 1 ){
                                        if(firstDay == day){
                                                dayCounter++;
                                                return (<button className="calenderButton" id = {dayCounter-1} onClick = {globalThis.onClickHandler}>{dayCounter-1}</button>);
                                        }else{
                                                return(<button className="calenderButton" disabled={true}>0</button>);
                                        }
                                }else if(dayCounter <= noOfDays){
                                        dayCounter++;
                                        return (<button className="calenderButton" id = {dayCounter-1} onClick = {globalThis.onClickHandler}>{dayCounter-1}</button>);
                                }else{
                                        return (<button className="calenderButton" disabled={true}>0</button>);
                                }       
                        });
                        calenderJSX.push(<div>{weekJSX}</div>);  
                        currentWeek++;  
                }
                return calenderJSX;
        }

        onClickHandler(event){
           switch(event.target.className){
                case "calenderButton" : 
                        let currentDay = event.target.id.length != 1 ? event.target.id : "0"+event.target.id;
                        window.history.replaceState({}, "",window.location.pathname+"/"+currentDay);
                        this.setState({currentDate : currentDay});
                        break;
                default : 
                        window.history.replaceState({}, "",window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")));
                        this.setState({currentDate : ""});
                        break;                        
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
                let schedulerJSX = this.state.currentMonth == "" && this.state.currentYear == "" ? "" :
                                         this.state.currentDate == "" ?  <div> 
                                                <button onClick = {this.changeMonth} className = "previous">"Previous"</button>
                                                <div className = "monthYear">{month[this.state.currentMonth]},{this.state.currentYear}</div>
                                                <button onClick = {this.changeMonth} className = "next">"Next"</button>
                                                {this.buildCalender()}
                                          </div> : <CalenderDate currentMonth = {this.state.currentMonth} 
                                                        currentYear = {this.state.currentYear} 
                                                        currentDate = {this.state.currentDate} 
                                                        onClickHandler={this.onClickHandler}/>;
                return(<div>
                            {schedulerJSX}
                        </div>);
        }
}

const mapStateToProps = (state) => {
        return {
            user : state.userStateReducer
        }
    };
    
export default connect(mapStateToProps,null)(Scheduler); 
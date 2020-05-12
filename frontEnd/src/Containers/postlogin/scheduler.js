//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import CalenderDate from './calenderDate';

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
                this.setState({
                    currentMonth : new Date().getMonth(),
                    currentYear : new Date().getFullYear()    
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
                switch(event.target.className){
                        case "next" :   
                                if(this.state.currentMonth == "11"){
                                        this.setState({
                                                currentMonth : 0,
                                                currentYear : this.state.currentYear + 1
                                        });
                                }else{
                                        this.setState({
                                                currentMonth : this.state.currentMonth + 1
                                        });
                                }
                                break;
                        case "previous" :
                                if(this.state.currentMonth == "0"){
                                        this.setState({
                                                currentMonth : 11,
                                                currentYear : this.state.currentYear - 1
                                        });
                                }else{
                                        this.setState({
                                                currentMonth : this.state.currentMonth - 1
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
                        window.history.replaceState({}, "",window.location.pathname+"/"+event.target.id);
                        this.setState({currentDate : event.target.id});
                        break;
                default : 
                        window.history.replaceState({}, "",window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")));
                        this.setState({currentDate : ""});
                        break;                        
           }     
        }

        render(){
                let month = {
                        "0" : "January",
                        "1" : "Februray",
                        "2" : "March",
                        "3" : "April",
                        "4" : "May",
                        "5" : "June",
                        "6" : "July",
                        "7" : "August",
                        "8" : "September",
                        "9" : "October",
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
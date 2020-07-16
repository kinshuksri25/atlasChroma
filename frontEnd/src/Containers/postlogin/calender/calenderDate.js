//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import Events from './events';
import Notes from './notes';

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
        let heading = this.props.currentYear+"-"+this.props.currentMonth+"-"+this.props.currentDate;
        let bodyJSX = this.state.activeTab == "Events" ? <Events currentMonth = {this.props.currentMonth} 
                                                            currentYear = {this.props.currentYear} 
                                                            currentDate = {this.props.currentDate}/> : 
                                                         <Notes calenderDate = {heading}/>;
        return(<div>
                    <button onClick={this.props.onClickHandler}>X</button>
                    <button id="Events" onClick={this.changeActiveTab}>Events</button>
                    <button id="Notes" onClick={this.changeActiveTab}>Notes</button>
                    <div className = "calenderHeading">{heading}</div>
                    <div>{bodyJSX}</div>
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
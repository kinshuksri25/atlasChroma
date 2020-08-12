//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import cookieManager from '../../../Components/cookieManager'
import setMsgAction from '../../../store/actions/msgActions';
import httpsMiddleware from '../../../middleware/httpsMiddleware';

class StoryForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            priorityList : ["StoryPriority","Urgent","High","Medium","Low","OnHold"],
            contributorList : ["Contributors",...this.props.projectDetails.contributors],
            currentStatus: "",
            storyTitle : "",
            storyDescription : "",
            storyComments : "",
            duedate : "",
            storyContributor : "",
            storyPriority : "",
            columnArray : []
        };
        this.onStoryAddHandler = this.onStoryAddHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.generateColumnArray = this.generateColumnArray.bind(this);
    }

    componentDidMount(){
        this.state.columnArray.length==0 && this.setState({columnArray : [...this.generateColumnArray()]});
    }

    onChangeHandler(event){
        switch(event.target.className){
            case "storyTitle":
                this.setState({storyTitle : event.target.value});
                break;
            case "storyDescription":
                this.setState({storyDescription : event.target.value});
                break;
            case "comments":
                this.setState({storyComments : event.target.value});
                break;
            case "priority":
                this.setState({storyPriority : event.target.value});
                break;
            case "duedate":
                this.setState({duedate : event.target.value});
                break;    
            case "contributor":
                this.setState({storyContributor : event.target.value});
                break;
            case "selectPhase":
                this.setState({currentStatus : event.target.value});
                break;        
        }
    }

    onStoryAddHandler(){
        let globalThis = this;
        let errorObject = {};
        let currentMonth = new Date().getMonth().toString().length == 1 ? "0"+(new Date().getMonth()+1) : (new Date().getMonth()+1);
        let currentDate = new Date().getFullYear()+"-"+currentMonth+"-"+new Date().getDate();
        if(this.state.storyTitle != "" && this.state.storyDescription != "" && 
            this.state.storyContributor != "" && this.state.duedate >= currentDate && this.state.storyPriority != "" &&
                this.state.currentStatus != "" && this.state.storyComments != ""){

            let formData = {
                "StoryTitle" : this.state.storyTitle,
                "Description" : this.state.storyDescription,
                "Contributor" : this.state.storyContributor,
                "Priority" : this.state.storyPriority,
                "EndDate" : this.state.duedate,
                "currentStatus" : this.state.currentStatus,
                "Comments" : this.state.storyComments,
                "projectID" : this.props.projectDetails._id,
                "projectName" : this.props.projectDetails.title
            };

            let headers = {"CookieID" : cookieManager.getUserSessionDetails()};
            httpsMiddleware.httpsRequest("/stories","POST", headers, {...formData},function(error,responseObject) {
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
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
                    globalThis.props.closeForm();
                }
            });
        }else{
            if(this.state.duedate < currentDate){
                errorObject.msg = EMSG.CLI_STRY_DTEERR;
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }else{
                errorObject.msg = EMSG.CLI_STRY_STRDTILSERR;
                errorObject.status = "ERROR";
                globalThis.props.setMsgState(errorObject);
            }
        }
    }

    generateColumnArray(){
        let templates = [...this.props.projectDetails.templatedetails];
        let columnsArray = templates.map(template => {
            let column = {
                "NAME" : template.EXTENDS != "" ? template.EXTENDS +"->"+template.NAME : template.NAME,
                "ID" : template._id,
                "hasChildren": template.CHILDREN.length > 0 ? true : false
            }
            return ({...column});
        });
        return columnsArray;
    }

    render(){                                                                   
        let storyFormJSX =  <div>
                                <input type ="text" value = {this.state.storyTitle} className = "storyTitle" onChange = {this.onChangeHandler}/>
                                <input type ="textarea" rows = "5" cols = "20" value = {this.state.storyDescription} className = "storyDescription" onChange = {this.onChangeHandler}/>
                                <input type = "textarea" rows = "5" cols = "20" value = {this.state.storyComments} className = "comments" onChange = {this.onChangeHandler}/>
                                <input type ="date" value = {this.state.duedate} className = "duedate" onChange = {this.onChangeHandler}/>
                                <select className = "priority" onChange = {this.onChangeHandler}>
                                    {
                                        this.state.priorityList.map(priority => {
                                            return (<option value = { priority }>{priority}</option>);
                                        })
                                    }
                                </select>
                                <select className = "contributor" onChange = {this.onChangeHandler}>
                                    {
                                        this.state.contributorList.map(contributor => {
                                            return (<option value = { contributor }>{contributor}</option>);
                                        })
                                    }
                                </select>
                                <select className = "selectPhase" onChange = {this.onChangeHandler}>
                                    <option value = "" selected>Select Phase</option>
                                    {
                                        this.state.columnArray.map(column => {
                                            if(!column.hasChildren){
                                                return(<option value = { column.ID }>{column.NAME}</option>);
                                            }
                                        })
                                    }
                                </select>
                                <button onClick = {this.onStoryAddHandler}>Add</button>
                            </div>;
        return (<div> 
                    {storyFormJSX}
                    <button onClick = {this.props.closeForm}>X</button>
                </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {     
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(StoryForm); 
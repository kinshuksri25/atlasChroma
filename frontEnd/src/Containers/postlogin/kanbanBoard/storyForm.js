//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import cancel from "../../../Images/icons/cancel.png";
import {Form,Button} from 'react-bootstrap';
import cookieManager from '../../../Components/cookieManager';
import setMsgAction from '../../../store/actions/msgActions';
import httpsMiddleware from '../../../middleware/httpsMiddleware';
import {EMSG,urls} from '../../../../../lib/constants/contants';
import DateHelper from '../../generalContainers/date';

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
        let errorObject = {};
        switch(event.target.id){
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
                if(event.target.value >= this.props.projectDetails.duedate){
                    errorObject.msg = "Invalid date selected";
                    errorObject.status = "ERROR";
                    this.props.setMsgState(errorObject);
                }else{
                    this.setState({duedate : event.target.value});
                }
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
        let currentDateObject = new DateHelper().currentDateGenerator();
        let currentDate = currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        if(this.state.storyTitle != "" && this.state.storyDescription != "" && 
            this.state.storyContributor != "" && (this.state.duedate > currentDate || this.state.duedate == currentDate) && this.state.storyPriority != "" &&
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
            globalThis.props.closeForm();
            httpsMiddleware.httpsRequest("/stories","POST", headers, {...formData},function(error,responseObject) {
                if((responseObject.STATUS != 200 && responseObject.STATUS != 201) || error){
                    if(error){
                        errorObject.msg = EMSG.CLI_QURY_BCKDWN;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                        window.history.pushState({},"",urls.LOGOUT);
                    }else{
                        errorObject.msg = responseObject.EMSG;
                        errorObject.status = "ERROR";
                        globalThis.props.setMsgState(errorObject);
                    }
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
                "hasChildren": template.CHILDREN.length > 0 ? true : false,
                "workFlowEnd" : template.workFlowEnd
            }
            return ({...column});
        });
        return columnsArray;
    }

    render(){                                                                   
        let storyFormJSX =  <div>
                                <Form.Group>
                                    <Form.Control type ="text" value = {this.state.storyTitle} id = "storyTitle" placeHolder="Title" onChange = {this.onChangeHandler}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control as ="textarea" rows = "4" value = {this.state.storyDescription} id = "storyDescription" placeHolder="Description" onChange = {this.onChangeHandler}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control as = "textarea" rows = "3" value = {this.state.storyComments} id="comments" placeholder="Comments" onChange = {this.onChangeHandler}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control type ="date" value = {this.state.duedate} id = "duedate" onChange = {this.onChangeHandler}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control as="select" id = "priority" onChange = {this.onChangeHandler}>
                                        {
                                            this.state.priorityList.map(priority => {
                                                return (<option value = { priority }>{priority}</option>);
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control as="select" id = "contributor" onChange = {this.onChangeHandler}>
                                        {
                                            this.state.contributorList.map(contributor => {
                                                return (<option value = { contributor }>{contributor}</option>);
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control as="select" id = "selectPhase" onChange = {this.onChangeHandler}>
                                        <option value = "" selected>Select Phase</option>
                                        {
                                            this.state.columnArray.map(column => {
                                                if(!column.hasChildren && !column.workFlowEnd){
                                                    return(<option value = { column.ID }>{column.NAME}</option>);
                                                }
                                            })
                                        }
                                    </Form.Control>
                                </Form.Group>        
                                <Button className="storyAddButton" onClick = {this.onStoryAddHandler}>Add</Button>
                            </div>;
        return (<div>
                    <button id="storiesAddCancel" className = "hideFormButton addCancel" onClick = {this.props.closeForm}><img src={cancel}/></button>
                    {storyFormJSX}
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
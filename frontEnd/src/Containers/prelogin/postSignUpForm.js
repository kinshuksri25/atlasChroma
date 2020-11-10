import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../StyleSheets/postSignup.css';
import httpsMiddleware from '../../middleware/httpsMiddleware';
import {EMSG,urls} from "../../../../lib/constants/contants";
import SimpleForm from '../../Forms/simpleform';
import ProfilePicture from "../generalContainers/profilePictureGen";
import cookieManager from '../../Components/cookieManager';
import setMsgAction from '../../store/actions/msgActions';
import {msgObject} from '../../../../lib/constants/storeConstants';
import formConstants from '../../Forms/formConstants';

class PostSignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            "ID": "",
            "photo" : "",
            "displayPhotoSel" : false
        };
        this.changeProfilePic = this.changeProfilePic.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.showPhotoSelector = this.showPhotoSelector.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    } 

    componentDidMount() {
        let ID = localStorage.uniqueID;
        let sessionExists = ID == undefined ? false : true;
        if (!sessionExists) {
            window.history.pushState({},"",urls.LANDING);
        }else{
            this.setState({ID:ID});
        }
    }

    showPhotoSelector(){
        this.setState({displayPhotoSel : !this.state.displayPhotoSel});
    }

    changeProfilePic(event){
        this.setState({'photo': event.target.src, displayPhotoSel : !this.state.displayPhotoSel});
    }

    onChangeHandler(formObject){
    };

    onSubmitHandler(formObject){
        let headers = {};
        let errorObject = {...msgObject};
        let globalThis = this;
        if (formObject.formData.hasOwnProperty('FirstName') && formObject.formData.hasOwnProperty('LastName') && formObject.formData.hasOwnProperty('Phone')) {
            formObject.formData.id = this.state.ID;
            formObject.formData.ProfilePhoto = this.state.photo;
            httpsMiddleware.httpsRequest(formObject.route, formObject.method, headers, formObject.formData,function(error,responseObject) {
                if(error || responseObject.Status == "ERROR"){
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
                    console.log(responseObject);
                    //set the session
                    cookieManager.setUserSessionDetails(responseObject.PAYLOAD);
                    //TODO --> change the pushState 'state' and 'title'
                    window.history.pushState({},"",urls.PROJECT);
                }
            });
        } else {
            errorObject.msg = EMSG.CLI_MID_INVMET;
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
        }
    }

    render() {
        let buttonInner = this.state.photo == "" ? <div style={{width: "100%"}}> + </div>: <img className ="profilePhoto" src={this.state.photo}/>;
        return (<div className = "postSignUpFormPage">
                   <div className="heading"><span>Just a couple of more details, and you will be off to the races!</span></div>
                   <div className = "postSignupFormContainer">
                        <div>
                            <button className = 'profilePictureButton' onClick ={this.showPhotoSelector}>{buttonInner}</button>
                            {this.state.displayPhotoSel && <ProfilePicture openModal = {this.state.displayPhotoSel} selectProfilePic = {this.changeProfilePic} cancelHandler = {this.showPhotoSelector}/>}
                            <SimpleForm formAttributes = { formConstants.postSignup }
                            submitHandler = { this.onSubmitHandler }
                            changeHandler = { this.onChangeHandler }
                            changeFieldNames = {["Phone"]}/> 
                        </div>  
                    </div>
                </div>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(null,mapDispatchToProps)(PostSignUpForm);
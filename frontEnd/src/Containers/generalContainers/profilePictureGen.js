//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import https from 'https';

import cancel from "../../Images/icons/cancel.png";
import refresh from "../../Images/icons/refresh.png";
import "../../StyleSheets/profilePicture.css";
import Modal from 'react-modal';
import setLoadingAction from '../../store/actions/loadingActions';

const stringdecoder = require('string_decoder').StringDecoder;
const decoder = new stringdecoder('utf-8');

class ProfilePicture extends Component {
    constructor(props){
        super(props);
        this.state={
            profilePics : []
        }
        this.buildPictureGen = this.buildPictureGen.bind(this);
        this.loadPicture = this.loadPicture.bind(this);
    }

    componentDidMount(){    
        this.loadPicture();
    }

    buildPictureGen(){
        let pictures = [];
        this.state.profilePics.map(picture => {
            pictures.push(<div><img src={picture.urls.thumb} onClick={this.props.selectProfilePic} className = "photo"/></div>);                        
        });
        return (<div className = "pictureContainer">{pictures}</div>);
    }

    loadPicture(){
        let globalThis = this;
        let picGen = https.request("https://api.unsplash.com//photos/random?client_id=NheQe5dqK5XKOrBoA2MHddLyVlGDSW3mcrDZuseFOkE&count=9&orientation=squarish", (response) => {

            let responseString = '';

            response.on('data', function(chunk) {
                responseString += decoder.write(chunk);
            });

            response.on('end', function() {
                responseString += decoder.end();
                responseString = JSON.parse(responseString);
                globalThis.setState({
                    profilePics : responseString.slice(0,9)
                });
            });
        });
        picGen.end();
    }

    render(){
        if(this.props.openModal && this.state.profilePics.length == 0){
            this.props.changeLoadingState(true);
        }else{
            this.props.changeLoadingState(false);
        }
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              padding               : '25px',
              borderRadius          : '8px',
              transform             : 'translate(-50%, -50%)'
            }
          };
        let profilePicture = this.state.profilePics.length == 0 ? "" : this.buildPictureGen();
        return( <Modal
                isOpen={this.props.openModal && this.state.profilePics.length != 0}
                style={customStyles}>
                    <div className = "gridContainer">
                        <button className = "refresh" onClick={this.loadPicture}><img src={refresh}/></button>
                        <button className = "cancel" onClick={this.props.cancelHandler}><img src={cancel}/></button>
                        {profilePicture}
                     </div>   
                </Modal>);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeLoadingState: (isLoading) =>{
            dispatch(setLoadingAction(isLoading));
        } 
    };
};

export default connect(null,mapDispatchToProps)(ProfilePicture);
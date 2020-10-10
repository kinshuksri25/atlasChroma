//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import https from 'https';

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
    }

    componentDidMount(){
        let globalThis = this;
        let randomPage = Math.floor(Math.random() * 30);
        let picGen = https.request("https://picsum.photos/v2/list?page="+randomPage, (response) => {

            let responseString = '';

            response.on('data', function(chunk) {
                responseString += decoder.write(chunk);
            });

            response.on('end', function() {
                responseString += decoder.end();
                responseString = JSON.parse(responseString);
                console.log(responseString);
                globalThis.setState({
                    profilePics : responseString.slice(0,9)
                });
            });
        });
        picGen.end();
    }

    buildPictureGen(){
        let pictures = [];
        let count = 0;
        //let count = Math.floor(Math.random() * 30);
        while(count < 9){
            pictures.push(<img src={this.state.profilePics[count].download_url} onClick={this.props.selectProfilePic} className = "photo"/>);                        
            count++;
        }
        return (<div className = "pictureContainer">{pictures}</div>);
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
              paddingTop            : '0px',
              maxWidth              : '36%',
              transform             : 'translate(-50%, -50%)'
            }
          };
        let profilePicture = this.state.profilePics.length == 0 ? "" : this.buildPictureGen();
        return( <Modal
                isOpen={this.props.openModal && this.state.profilePics.length != 0}
                style={customStyles}>
                    <div className = "gridContainer">
                        <button className = "cancel" onClick={this.props.cancelHandler}>X</button>
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
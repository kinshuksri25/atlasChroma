//Dependencies
import React, { Component } from 'react';
import https from 'https';

const stringdecoder = require('string_decoder').StringDecoder;
const decoder = new stringdecoder('utf-8');

export default class ProfilePicture extends Component {
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
            pictures.push(<img src={this.state.profilePics[count].download_url} onClick={this.props.selectProfilePic} width = "200" height = "200"/>);                        
            count++;
        }
        return (<div>{pictures}</div>);
    }

    render(){
        let profilePicture = this.state.profilePics.length == 0 ? "" : this.buildPictureGen();
        return( <div>
                    <button onClick={this.props.cancelHandler}>X</button>
                    {profilePicture}
                </div>);
    }
}
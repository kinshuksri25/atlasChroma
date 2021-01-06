//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {Spinner} from 'react-bootstrap';

import '../../StyleSheets/loadingComponent.css';

class LoadingComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            variant:"primary",
            counter: 0
        };
    }

    componentDidMount(){
        let colorsArray = ["primary","success","danger","warning","info"];
        setInterval(() =>{
            if(this.props.isLoading){
                let count = 0;
                if(this.state.counter == 4){
                    count = 0;
                }else{
                    count =  this.state.counter+1;
                }
                this.setState({variant:colorsArray[count],counter : count});
            }else if(!this.props.isLoading && this.state.variant != "primary"){
                this.setState({variant : "primary",counter : 0});
            }
        },800);
    }

    render(){
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)',
              background            : 'transparent',
              border                : 'none',
              overflow              : 'visible'
            }
          };
        return(<Modal
                isOpen={this.props.isLoading}
                style={customStyles}>
                   <Spinner className = "spinners" animation="border" variant={this.state.variant}/>
                </Modal>);
    }
}


const mapStateToProps = state => {
    return {
      isLoading : state.loadingStateReducer.isLoading
    }
  };
  
export default connect(mapStateToProps,null)(LoadingComponent);
  
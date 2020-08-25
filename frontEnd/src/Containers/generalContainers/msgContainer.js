//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Alert} from 'react-bootstrap';

import  '../../StyleSheets/msgContainer.css';
import setMsgAction from '../../store/actions/msgActions';

class MsgContainer extends Component {
  
  constructor(props){
    super(props);
    this.resetMsgState = this.resetMsgState.bind(this);
  }

  resetMsgState () {
    setTimeout(() =>{
      this.props.resetMsgState({msg : '',status : ''});
    },3000);
  }
  
  render(){
    this.props.msgObject.status != '' && this.resetMsgState();
    let msgClassName = this.props.msgObject.status == '' ? "noMsg" : this.props.msgObject.status == "ERROR" ? "ErrorMsg" : "SuccessMsg";
    return(
      <div className = {msgClassName}>
        {this.props.msgObject.msg}
      </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    msgObject : state.msgStateReducer
  }
};

const mapDispatchToProps = dispatch => {
  return {
        resetMsgState: (msgObject) => {
          dispatch(setMsgAction(msgObject));
      } 
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(MsgContainer);

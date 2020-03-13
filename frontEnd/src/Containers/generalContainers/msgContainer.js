//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import setMsg from '../../store/actions/msgActions';

class msgContainer extends Component {
  
  constructor(props){
    super(props);
  }

  resetMsgState = () => {
    setTimeout(() =>{
      this.props.resetMsgState({msg : '',status : ''});
    },3000);
  }
  
  render(){
    this.props.msgObject.status != '' && resetMsgState();
    let msgClassName = this.props.msgObject.status == '' ? "noMsg" : this.props.msgObject.status == "ERROR" ? "ErrorMsg" : "SuccessMsg";
    return(<div className = {msgClassName}>this.props.msgObject.msg</div>);
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
          dispatch(setMsg(msgObject));
      } 
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(msgContainer);

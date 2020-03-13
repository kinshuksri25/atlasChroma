//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

class errorMsg extends Component {
  
  constructor(props){
    super(props);
  }
  render(){
    return(<div>Error Msg</div>);
  }
}

const mapStateToProps = state => {
  return {
      errorMsg : state.errorMsgReducer.errorMsg
  }
};

const mapDispatchToProps = dispatch => {
    return {
            //TODO --> add action for errormsg change  
        }
    };
};

export default connect(matchStateToProps,mapDispatchToProps)(errorMsg);

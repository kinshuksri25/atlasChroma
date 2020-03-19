//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

class KanbanBoard extends Component {

        constructor(props){
                super(props);
        }
        render(){
                return (<div> {this.props.projectObject.title} </div>);
        }
}

export default connect(null,null)(KanbanBoard);
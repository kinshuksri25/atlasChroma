//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

class BoardColumn extends Component{
    constructor(props){
        super(props);
        this.state = {};                     
    }

    componentDidMount(){
        this.setState({});
        this.buildColumn = this.buildColumn.bind(this);
    }

    buildColumn(){
        
    }

    render(){
        return(<div>BOARDCOLUMN</div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(Story); 

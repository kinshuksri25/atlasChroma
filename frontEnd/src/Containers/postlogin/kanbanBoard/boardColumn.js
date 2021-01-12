//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import { connect } from 'react-redux';

import StoryContainer from './storyContainer';

class BoardColumn extends Component{
    constructor(props){
        super(props);
        this.state = {
                        columnID:"",
                        columnHeading:"",
                        columnChildren:[],
                        columnExtends:"",
                        columnWIPLimit: ""
                     }; 
        this.buildColumn = this.buildColumn.bind(this);                                  
    }

    componentDidMount(){

        this.setState({
                         columnID:this.props.columnDetails._id,
                         columnHeading:this.props.columnDetails.NAME,
                         columnChildren:this.props.columnDetails.CHILDREN,
                         columnExtends:this.props.columnDetails.EXTENDS,
                         columnWIPLimit:this.props.columnDetails.WIP
                      });
    }
    
    buildColumn(){
        if(this.state.columnChildren.length == 0){
            return(<div className = "phaseContainer" id = {this.state.columnID}>
                        <div className = "phaseHeading">{this.state.columnHeading}</div>
                        <StoryContainer currentProject={this.props.currentProject} columnID = {this.state.columnID} maxStoryWidth={this.props.maxStoryWidth}/>
                    </div>);
        }else{
            return(<div className = "phaseContainer" id = {this.state.columnID}>
                        <div className = "phaseHeading">{this.state.columnHeading}</div>
                         <div className = "phaseBody">
                            {
                                this.state.columnChildren.map(child => {
                                return <BoardColumn currentProject={this.props.currentProject} columnDetails = {child} maxStoryWidth={this.props.maxStoryWidth}/>
                                })
                            }
                         </div>   
                    </div>);
        }
    }

    render(){
        let boardJSX = this.state.columnID != "" ? this.buildColumn()  : "";
        return(<div>{boardJSX}</div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userStateReducer
    }
};

export default connect(mapStateToProps,null)(BoardColumn); 

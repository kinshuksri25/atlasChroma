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
        this.editStory = this.editStory.bind(this);                                  
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

    editStory(storyID){
        this.props.editStory(storyID);
    }
    
    buildColumn(){
        let style = {
            float : "left",
            width : this.props.width
        }
        if(this.state.columnChildren.length == 0){
            return(<div style = {style} className = "phaseContainer" id = {this.state.columnID}>
                        <div className = "phaseHeading">{this.state.columnHeading}</div>
                        <div className="storiesContainer">
                            <StoryContainer editStory = {this.editStory} columnID = {this.state.columnID}/>
                        </div>
                    </div>);
        }else{
            return(<div style = {style} className = "phaseContainer" id = {this.state.columnID}>
                        <div className = "phaseHeading">{this.state.columnHeading}</div>
                            {
                                this.state.columnChildren.map(child => {
                                let width = this.props.width/this.state.columnChildren.length; 
                                return <BoardColumn columnDetails = {child} width = {width}/>
                                })
                            }
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

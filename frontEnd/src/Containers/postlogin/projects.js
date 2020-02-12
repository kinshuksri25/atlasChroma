//Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Projects extends Component {

        constructor(props){
                super(props);
        }

        render(){
                return (<div> "Projects" </div>);    
        }
        
}

const mapStateToProps = (state) => {
        return {
            user: state.userStateReducer.user
        }
    };
    
const mapDispatchToProps = dispatch => {
        return {
            setUserState: (userObject) => {
                dispatch(setUserAction(userObject));
            }
        };
    };
    
export default connect(mapStateToProps,mapDispatchToProps)(Projects);
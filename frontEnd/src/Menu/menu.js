//Dependencies
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import React,{ Component } from 'react';

import dashboardImage from "../Images/icons/dashboard.png";
import projectsImage from "../Images/icons/projects.png";
import schedulerImage from "../Images/icons/scheduler.png";
import logoutImage from "../Images/icons/logout.png";
import "../StyleSheets/menu.css";
import {EMSG} from '../../../lib/constants/contants';
import setMsgAction from '../store/actions/msgActions';

class Menu extends Component{

    constructor(props){
        super(props);
        this.state = {
            currentUrl:"" 
        }
        this.onClickHandler = this.onClickHandler.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
    }

    componentDidMount(){
        let url = this.props.url == "" ? window.location.pathname.substring(1).toLowerCase() : this.props.url;
        this.setState({currentUrl: url});
        
    }

    renderMenu(){
        if(this.props.menuArray == [] || this.props.menuArray == "" || this.props.menuArray == {} || this.props.menuArray == undefined){
            errorObject.msg = EMSG.CLI_MNU_IMNUARR;
            errorObject.status = "ERROR";
            globalThis.props.setMsgState(errorObject);
            return '';
        }else{
            let url = window.location.pathname.substring(1).toLowerCase();
            let menu = this.props.menuArray.map(menuElement => {
                let menu = menuElement.title != "Profile" ? <button disabled = {url.indexOf(menuElement.route) >= 0} title={menuElement.title} id={menuElement.route} className="menuButton" onClick={this.onClickHandler}>
                                                                <img src={menuElement.image} width = "30" height = "30"/>
                                                            </button> :
                                                            <button disabled = {url.indexOf(menuElement.route) >= 0} title={menuElement.title} id={menuElement.route} className="menuButton" onClick={this.onClickHandler}>
                                                                <img src={this.props.user.photo} width = "50" height = "50"/>
                                                            </button>;
                return(
                         <div className = "menuButtonContainer">
                            {menu}   
                         </div>   
                      );
            });
            return (<div>{menu}</div>);        
        } 
    }

    onClickHandler(event){
        let route = event.target.id;
        this.setState({currentUrl : route}, () => {
            //push new url to history
            window.history.pushState({},"",window.location.origin+"/"+route); 
        });
    }

    render(){
        let menuComponent = this.renderMenu();
        return(<div className = "menuContainer">{menuComponent}</div>);
    }

}

const mapStateToProps = (state) => {
    return {
        url: state.urlStateReducer.currentUrl,
        user : state.userStateReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setMsgState: (msgObject) => {
            dispatch(setMsgAction(msgObject));
        } 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
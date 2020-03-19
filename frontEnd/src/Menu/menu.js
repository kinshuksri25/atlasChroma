//Dependencies
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import React,{ Component } from 'react';

import {EMSG} from '../../../lib/constants/contants';
import setUrlAction from "../store/actions/urlActions";

class Menu extends Component{

    constructor(props){
        super(props);
        this.state = {
            currentUrl:"",
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
            console.log(EMSG.CLI_MNU_IMNUARR);
            return '';
        }else{
            let menuArray = this.props.menuArray;
            let menu = menuArray.map(menuElement => {
                return(
                         <div className = "menuButtonContainer">
                            <button title={menuElement.title} id={menuElement.route} className="menuButton" onClick={this.onClickHandler}>
                                <i className={menuElement.icon}></i>
                            </button>   
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
        return(<div>{menuComponent}</div>);
    }

}

const mapStateToProps = (state) => {
    return {
        url: state.urlStateReducer.currentUrl
    }
};



export default connect(mapStateToProps, null)(Menu);
//Dependencies
import React,{Component} from 'react';

export default class SearchFeild extends Component{

    constructor(props){
        super(props);
        this.state ={
            autoComplete: "",
            suggestions:[]
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(event){
        this.setState({autoComplete:event.target.value},() => {
            if(this.state.autoComplete != ""){
                let resultSet = [];
                this.props.userList.map(user => {
                    if(user.UserName.substring(0,this.state.autoComplete.length) == this.state.autoComplete || user.Email.substring(0,this.state.autoComplete.length) == this.state.autoComplete){
                      resultSet.push(user);  
                    }
                });
                this.setState({suggestions:resultSet});
            }
        });
    }
    

    render(){
    return(<div>
            <input type="text" id ="autoComplete" value = {this.state.autoComplete} onChange = {this.onChange}/>
          </div>);
    }
}
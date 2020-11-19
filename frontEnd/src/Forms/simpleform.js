import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import {Form,Button} from 'react-bootstrap';

class SimpleForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
                formData : {}
        };
        this.buildForm = this.buildForm.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.arrayRemove = this.arrayRemove.bind(this);
        this.stateBuilder = this.stateBuilder.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
        this.offFocus = this.offFocus.bind(this);
    }   
    
    componentDidMount(){
        this.stateBuilder();
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            this.setState({formData : {}}, () => {
                this.stateBuilder();
            });
        }
      }

    onKeyDownHandler(event) {
        if (event.key == "Tab" || event.key == "Enter") {
            let newState = this.state.formData;
            this.props.changeHandler(newState);
        }
    }

    offFocus(){
        let newState = this.state.formData;
        this.props.changeHandler(newState);
    }

    stateBuilder () {
        let stateParams = this.props.formAttributes;
        let formParam;
        let formData = {};
        stateParams.map(param => {
            if (param.type == "form") {
                formParam = param;
                this.setState({method : param.method});
            }
        });
        stateParams = this.arrayRemove(stateParams, formParam);
        stateParams.map(stateParam => {
            if (stateParam.type != "button") {
                formData[stateParam.name] = "";
                this.setState({
                    formData
                })
            }else{
                this.setState({
                    route : stateParam.route
                })
            }
        })
    }

    onSubmitHandler(event) {
        event.preventDefault();
        let returnObject = this.state;
        this.props.submitHandler(returnObject);

    }
    onChangeHandler(event) {
        let formData = this.state.formData;
        formData[event.target.name] = event.target.value;
        this.setState({
            formData
        });
    }

    buildForm() {
        let params = this.props.formAttributes;
        let optionNumber = -1;
        let formParam;
        params.map(param => {
            if (param.type == "form") {
                formParam = param;
            }
        });
        params = this.arrayRemove(params, formParam);
        return ( <Form method = { formParam.method }
                 encType = { formParam.enctype }
                 id = { formParam.id }
                 onSubmit = { this.onSubmitHandler }> 
                 {
                    params.map(param => 
                        {
                            if (param.type == "button") {
                                return <Button id = { param.id } 
                                className = { param.className } 
                                key = { param.id } variant={param.variantType} type="submit"> { param.name } </Button>	
                            } else {
                                if (this.props.changeFieldNames.length != 0 && this.props.changeFieldNames.includes(param.name)) {
                                    return <Form.Group>
                                                <Form.Control type = { param.type } 
                                                name = { param.name } 
                                                placeholder = { param.placeholder }
                                                value = { this.state.formData[param.name] }
                                                id = { param.id }
                                                key = { param.id }
                                                className = { param.className }
                                                onChange = { this.onChangeHandler }
                                                hidden = { param.isHidden }
                                                required = { param.isRequired }
                                                onKeyDown = { this.onKeyDownHandler }
                                                onBlur={this.offFocus}
                                                autoComplete="off"
                                                tabIndex = "0" />
                                            </Form.Group>
                                         
                            } else {
                                switch (param.type) {
                                case "DropDown":{ 
                                                optionNumber++;
                                                return ( <Form.Control as="select" id = { param.name }
                                                          name = { param.name } key = { param.id } id = { param.id } className = { param.className }
                                                          onChange = { this.onChangeHandler } required = { param.isRequired }> 
                                                          {
                                                            this.props.options[optionNumber].map(option => {
                                                            return ( <option value = { option } > { option } </option>)
                                                            })
                                                          } 
                                                          </Form.Control>);
                                                  break;
                                                }             
                                case "textarea":{
                                        return(<Form.Group>
                                                    <Form.Control as = {param.type}
                                                    name = { param.name }
                                                    rows = {param.rows}
                                                    placeholder = { param.placeholder }
                                                    value = { this.state.formData[param.name] }
                                                    id = { param.id }
                                                    key = { param.id }
                                                    className = { param.className }
                                                    onChange = { this.onChangeHandler }
                                                    hidden = { param.isHidden }
                                                    required = { param.isRequired }
                                                    autoComplete="off"/> 
                                                </Form.Group>);                                                       
                                                break;                                                                

                                } 
                                default:{ return <Form.Group>
                                                    <Form.Control type = { param.type }
                                                    name = { param.name }
                                                    placeholder = { param.placeholder }
                                                    value = { this.state.formData[param.name] }
                                                    id = { param.id }
                                                    key = { param.id }
                                                    className = { param.className }
                                                    onChange = { this.onChangeHandler }
                                                    hidden = { param.isHidden }
                                                    required = { param.isRequired }
                                                    autoComplete="off"/>   
                                                </Form.Group>        
                                          break;
                                        }
                                }

                            }

                        }
                    }
                )
            } 
        </Form>)
    }

    arrayRemove(arr, value) {
        return arr.filter(function(element) {
            return element != value;
        });
    }

    render() {
        let form = this.buildForm();
        return ( <div className="simpleForm" id="simpleFormID"> { form } </div>);
    }
}
export default SimpleForm;
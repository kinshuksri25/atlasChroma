//Dependencies
import React, { Component } from 'react';
import { hot } from "react-hot-loader";
import SimpleForm from './Forms/simpleform';
import formConstants from './Forms/formConstants';
import httpsMiddleware from '../middleware/httpsMiddleware';
import localSession from '../Components/sessionComponent';

//middleware has to be added to dependencies

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "loginForm": ""
        };
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    //submit handler for the form
    onSubmitHandler(formObject) {
        delete formObject.Login;
        var headers = { "Origin": "https://localhost:3000" };
        var formParam;

        if (formObject.Password != undefined) {
            formConstants.login.map(param => {
                if (param.type == "form") {
                    formParam = param;
                }
            });
            formObject.route = formParam.route;
        } else {
            formConstants.googleLogin.map(param => {
                if (param.type == "form") {
                    formParam = param;
                }
            });
            formObject.route = formParam.route;
        }
        httpsMiddleware.httpsRequest(formParam.route, formParam.method, headers, formObject, function(responseObject) {
            if (!responseObject.Status) {
                console.log(responseObject.ErrorMsg);
            } else {
                //set the session
                var session = localSession;
                var sessionObject = session.setSessionObject(Result);

            }
        });
    }
    onClickHandler(event) {
            event.target.id == "login" && this.setState({
                        "loginForm": <
                            SimpleForm formAttributes = { formConstants.login }
                        submitHandler = { this.onSubmitHandler }
                        changeFieldNames = {
                            []
                        }
                        />  })
                        event.target.id == "googleLogin" && this.setState({
                                "loginForm": <
                                    SimpleForm formAttributes = { formConstants.googleLogin }
                                submitHandler = { this.onSubmitHandler }
                                changeFieldNames = {
                                    []
                                }
                                />  });
                            }

                            render() {
                                return ( <
                                    div >
                                    <
                                    button id = "login"
                                    onClick = { this.onClickHandler } > Login < /button> <
                                    button id = "googleLogin"
                                    onClick = { this.onClickHandler } > Login with Google < /button> { this.state.loginForm }  < /
                                    div >
                                );
                            }
                        }


                        export default hot(module)(Login);
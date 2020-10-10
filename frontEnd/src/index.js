import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import './StyleSheets/common.css';
import 'bootstrap/dist/css/bootstrap.css';
import Router from "./router.js";
import store from "./store/store";

//const store = storeCreator();
ReactDOM.render(<Provider store = { store }> 
                    <Router/> 
                </Provider>, document.getElementById("root"));
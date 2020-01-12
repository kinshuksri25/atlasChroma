import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Router from "./router.js";
import storeCreator from "./store/store";

const store = storeCreator();

ReactDOM.render(<Provider store = { store }> 
                    <Router/> 
                </Provider>, document.getElementById("root"));
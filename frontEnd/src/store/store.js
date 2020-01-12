//Central Store File

//Dependencies
import { createStore, combineReducers } from "redux";
import userStateReducer from "./reducers/userStateReducer";
import urlStateReducer from "./reducers/urlStateReducer";

export default function storeCreator (){

    const combinedReducer = combineReducers({userStateReducer,urlStateReducer});
    const store = createStore(combinedReducer);
    return store;
} 
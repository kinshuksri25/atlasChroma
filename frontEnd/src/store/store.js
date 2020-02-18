//Central Store File

//Dependencies
import { createStore, combineReducers } from "redux";
import userStateReducer from "./reducers/userStateReducer";
import urlStateReducer from "./reducers/urlStateReducer";
import userListStateReducer from "./reducers/userListStateReducer";

export default function storeCreator (){

    const combinedReducer = combineReducers({userStateReducer,urlStateReducer,userListStateReducer});
    const store = createStore(combinedReducer);
    return store;
} 
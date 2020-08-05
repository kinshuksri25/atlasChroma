//Central Store File

//Dependencies
import { createStore, combineReducers } from "redux";
import userStateReducer from "./reducers/userStateReducer";
import urlStateReducer from "./reducers/urlStateReducer";
import msgStateReducer from "./reducers/msgStateReducer";
import userListStateReducer from "./reducers/userListStateReducer";
import socketStateReducer from "./reducers/socketStateReducer";
import chatStateReducer from './reducers/chatStateReducer';

const combinedReducer = combineReducers({userStateReducer,
    urlStateReducer,
    userListStateReducer,
    msgStateReducer,
    socketStateReducer,
    chatStateReducer});

export default store = createStore(combinedReducer);
//Central Store File

//Dependencies
import { createStore, combineReducers } from "redux";
import userStateReducer from "./reducers/userStateReducer";
import urlStateReducer from "./reducers/urlStateReducer";
import msgStateReducer from "./reducers/msgStateReducer";
import userListStateReducer from "./reducers/userListStateReducer";
import socketStateReducer from "./reducers/socketStateReducer";
import chatStateReducer from './reducers/chatStateReducer';
import loadingStateReducer from './reducers/loadingStateReducer';
import clockStateReducer from './reducers/clockStateReducer';

const combinedReducer = combineReducers({userStateReducer,
    urlStateReducer,
    userListStateReducer,
    msgStateReducer,
    socketStateReducer,
    chatStateReducer,
    loadingStateReducer,
    clockStateReducer
    });

const store = createStore(combinedReducer);

export default store;
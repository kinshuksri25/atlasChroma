//Central Store File

//Dependencies
import { createStore, combineReducers } from "redux";
import userStateReducer from "./reducers/userStateReducer";
import urlStateReducer from "./reducers/urlStateReducer";
import msgStateReducer from "./reducers/msgStateReducer";
import userListStateReducer from "./reducers/userListStateReducer";
import projectStateReducer from "./reducers/projectStateReducer";

export default function storeCreator (){

    const combinedReducer = combineReducers({userStateReducer,
                                            urlStateReducer,
                                            userListStateReducer,
                                            msgStateReducer,
                                            projectStateReducer});
    const store = createStore(combinedReducer);
    return store;
} 
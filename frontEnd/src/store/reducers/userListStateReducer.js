//UserList Reducer File

//Dependencies
import {userList} from "../../../../lib/constants/objectConstants";
import {actionTypes} from "../../../../lib/constants/dataConstants";

export default function userListStateReducer (state = userList, action) {

    switch(action.type){
        case actionTypes.SETUSERLIST : 
            return [...state,action.payload];
            break;
        default :
            return [...state];
    }
}

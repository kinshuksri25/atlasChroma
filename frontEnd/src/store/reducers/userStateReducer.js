//User Reducer File

//Dependencies
import {userObject} from "../../../../lib/constants/storeConstants";
import {actionTypes} from "../../../../lib/constants/contants";

export default function userStateReducer (state = userObject, action) {
    switch(action.type){
        case actionTypes.SETUSER : 
            return {...state,...action.payload};
            break;
        default :
            return {...state};
    }
}

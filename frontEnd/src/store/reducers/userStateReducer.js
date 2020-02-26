//User Reducer File

//Dependencies
import {userObject} from "../../../../lib/constants/objectConstants";
import {actionTypes} from "../../../../lib/constants/dataConstants";

export default function userStateReducer (state = userObject, action) {

    switch(action.type){
        case actionTypes.SETUSER : 
            return {...state,...action.payload};
            break;
        default :
            return {...state};
    }
}

//Url Reducer File

//Dependencies
import {socketObject} from "../../../../lib/constants/storeConstants";
import {actionTypes} from "../../../../lib/constants/contants";

export default function socketStateReducer (state = socketObject, actions) {

    switch(actions.type){

        case actionTypes.SETSOCKET : 
               return {io : actions.payload};
               break;
        default : 
               return {...state};
               break;         
    }
}
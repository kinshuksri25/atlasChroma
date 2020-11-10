//Time Reducer File

//Dependencies
import {clockObject} from "../../../../lib/constants/storeConstants";
import {actionTypes} from "../../../../lib/constants/contants";

export default function clockStateReducer (state = clockObject, actions) {

    switch(actions.type){

        case actionTypes.UPDATEPREVIOUSTIME : 
                return {previousTime : actions.payload};
                break;
        default : 
                return {...state};
                break;         
    }
}
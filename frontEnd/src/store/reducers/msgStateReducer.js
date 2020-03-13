//Url Reducer File

//Dependencies
import {msgObject} from "../../../../lib/constants/storeConstants";
import {actionTypes} from "../../../../lib/constants/contants";

export default function msgStateReducer (state = msgObject, actions) {

    switch(actions.type){

        case actionTypes.CHANGEMSG : 
               return {...state , ...actions.payload};
               break;
        default : 
               return {...state};
               break;         
    }
}
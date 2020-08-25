//loading Reducer File

//Dependencies
import {loadingObject} from "../../../../lib/constants/storeConstants";
import {actionTypes} from "../../../../lib/constants/contants";

export default function loadingStateReducer (state = loadingObject, actions) {

    switch(actions.type){

        case actionTypes.CHANGELOADINGSTATE : 
               return {...state , isLoading: actions.payload};
               break;
        default : 
               return {...state};
               break;         
    }
}
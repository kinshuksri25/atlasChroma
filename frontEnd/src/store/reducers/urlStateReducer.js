//Url Reducer File

//Dependencies
import {urlObject} from "../../../../lib/constants/objectConstants";
import {actionTypes} from "../../../../lib/constants/dataConstants";

export default function urlStateReducer (state = urlObject, actions) {

    switch(actions.type){

        case actionTypes.CHANGEURL : 
               return {currentUrl : actions.payload};
               break;
        default : 
               return {...state};
               break;         
    }
}
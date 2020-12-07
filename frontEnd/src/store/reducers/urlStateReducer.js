//Url Reducer File

//Dependencies
import {urlObject} from "../../../../lib/constants/storeConstants";
import {actionTypes} from "../../../../lib/constants/contants";

export default function urlStateReducer (state = urlObject, actions) {

    switch(actions.type){

        case actionTypes.CHANGEURL : 
               return {currentUrl : actions.payload,activeTab: actions.payload.split("/")[1]};
               break;
        default : 
               return {...state};
               break;         
    }
}
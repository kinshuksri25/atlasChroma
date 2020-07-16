//chat Reducer File

//Dependencies
import {messageObject} from "../../../../lib/constants/storeConstants";
import {actionTypes} from "../../../../lib/constants/contants";

export default function chatStateReducer (state = messageObject, actions) {
        let stateObject = {...state};
        switch(actions.type){
                case actionTypes.ADDMSG : 
                        stateObject[actions.payload.chatRoom].push(actions.payload.message);
                        return {...stateObject};
                        break;
                case actionTypes.ADDROOM : 
                        stateObject[actions.payload] = [];
                        return {...stateObject};
                        break;

                case actionTypes.SETMSG : 
                        return {...actions.payload};
                        break;                
                default : 
                        return {...state};
                        break;         
        }
}
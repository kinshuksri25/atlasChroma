//chat Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

function setMessageObjectAction(messageObject){
    return ({
        type: actionTypes.SETMSG,
        payload: messageObject
    });
}

function addMsgAction(msgObject,roomname) {
    return ({
        type: actionTypes.ADDMSG,
        payload: {message : msgObject,chatRoom : roomname}
    });
};

//chat room creation
function addChatRoomAction(chatRoom){
    return({
        type : actionTypes.ADDROOM,
        payload: chatRoom
    });
}

export {addMsgAction,addChatRoomAction,setMessageObjectAction};
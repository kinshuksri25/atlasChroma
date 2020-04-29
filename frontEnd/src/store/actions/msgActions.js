//Url Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function setMsgAction(msgObject) {
    return ({
        type: actionTypes.CHANGEMSG,
        payload: msgObject
    });
};
//Url Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function setMsg(msgObject) {
    return ({
        type: actionTypes.CHANGEMSG,
        payload: msgObject
    });
};
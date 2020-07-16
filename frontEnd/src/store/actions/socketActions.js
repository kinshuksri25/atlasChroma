//Socket Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function setSocketObject(socketObject) {
    return ({
        type: actionTypes.SETSOCKET,
        payload: socketObject
    });
};
//Clock Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function updateTime(time) {
    return ({
        type: actionTypes.UPDATEPREVIOUSTIME,
        payload: time
    });
};
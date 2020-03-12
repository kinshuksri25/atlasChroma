//Users Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function setUserAction(userObject) {
    return ({
        type: actionTypes.SETUSER,
        payload: userObject
    });
};
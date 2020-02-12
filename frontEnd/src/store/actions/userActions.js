//Users Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/dataConstants";

export default function setUserAction(userObject) {
    return ({
        type: actionTypes.SETUSER,
        payload: userObject
    });
};
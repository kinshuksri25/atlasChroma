//Url Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/dataConstants";

export default function setUrlAction(url) {
    return ({
        type: actionTypes.CHANGEURL,
        payload: url
    });
};
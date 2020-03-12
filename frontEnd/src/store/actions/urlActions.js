//Url Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function setUrlAction(url) {
    return ({
        type: actionTypes.CHANGEURL,
        payload: url
    });
};
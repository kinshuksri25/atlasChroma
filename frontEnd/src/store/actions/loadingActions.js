//Loading Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function setLoadingAction(isLoading) {
    return ({
        type: actionTypes.CHANGELOADINGSTATE,
        payload: isLoading
    });
};
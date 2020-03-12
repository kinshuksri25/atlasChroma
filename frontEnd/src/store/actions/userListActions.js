//UserList Actions File

//Dependencies
import {actionTypes} from "../../../../lib/constants/contants";

export default function setUserListStateAction(userList) {
    return ({
        type: actionTypes.SETUSERLIST,
        payload: userList
    });
};
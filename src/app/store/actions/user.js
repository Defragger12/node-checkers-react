import * as actionTypes from "./actionTypes";
import {retrieveUserFileNames} from "../../util/requests";

export const setFileNames = (fileNames) => {
    return {
        type: actionTypes.SET_FILE_NAMES,
        names: fileNames
    };
};

export const fetchFileNames = () => {
    return async dispatch => {
        dispatch(setFileNames(await retrieveUserFileNames()))
    };
};
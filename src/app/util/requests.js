import {BASE_URL} from "../../constants";
import axios from "axios";

export const retrieveUserAvatars = async () => {
    let response = await axios({
        url: `${BASE_URL}/useravatars`,
        method: 'get',
        withCredentials: true
    });

    return response.data;
};

export const retrieveUserName = async () => {
    let response = await axios({
        url: `${BASE_URL}/username`,
        method: 'get',
        withCredentials: true
    });

    return response.data;
};

export const checkIfAuthenticated = async () => {
    let response = await axios({
        url: `${BASE_URL}/auth`,
        method: 'get',
        withCredentials: true
    });

    return response.data;
};

export const retrieveFieldDataForUser = async () => {
    let response = await axios({
        url: `${BASE_URL}/field`,
        method: 'get',
        withCredentials: true
    });

    return response.data;
};

export const preparePlayerList = async () => {
    let response = await axios({
        url: `${BASE_URL}/players`,
        method: 'get',
        withCredentials: true
    });

    return response.data;
};

export const submitForm = async (form, data) => {

    let attrs;
    if (!data) {
        attrs = {
            data: new FormData(form),
            contentType: false,
            processData: false,
        }
    } else {
        attrs = {
            data: data
        }
    }

    let response = await axios({
        method: form.method,
        url: form.action,
        withCredentials: true,
        ...attrs
    });

    return response.data;
};

export const retrieveUserFileNames = async () => {
    let response = await axios({
        url: `${BASE_URL}/files`,
        method: 'get',
        withCredentials: true
    });

    return response.data;
};

export const downloadFile = (fileName) => {
    window.location = `${BASE_URL}/file?filename=${fileName}`;
};
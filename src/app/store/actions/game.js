import * as actionTypes from "./actionTypes";
import {preparePlayerList} from "../../util/requests";

export const setPlayersOnline = (playersOnline) => {
    return {
        type: actionTypes.SET_PLAYERS_ONLINE,
        players: playersOnline
    };
};

//todo maybe use redux thunk
export const fetchPlayersOnline = () => {
    return async dispatch => {
        dispatch(setPlayersOnline(await preparePlayerList()));
    }
};

export const updateInGameState = (username, isInGame) => {
    return {
        type: actionTypes.UPDATE_INGAME_STATE,
        username,
        isInGame
    }
};

export const addPlayerToList = (username, isInGame) => {
    return {
        type: actionTypes.UPDATE_INGAME_STATE,
        username,
        isInGame
    }
};

export const removePlayerFromList = (username) => {
    return {
        type: actionTypes.UPDATE_INGAME_STATE,
        username
    }
};
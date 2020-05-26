import * as actionTypes from '../actions/actionTypes';

const initialState = {
    playersOnline: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PLAYERS_ONLINE:
            return {...state, playersOnline: action.players};
        case actionTypes.UPDATE_INGAME_STATE:
            return {
                ...state, playersOnline: state.playersOnline.map(player => player.name === action.username ? {
                    ...player, isInGame: action.isInGame
                } : player)
            };
        case actionTypes.ADD_PLAYER_TO_LIST:
            if (state.playersOnline.find(player => player.name === action.username)) {
                return state;
            }
            return {
                ...state,
                playersOnline: [...state.playersOnline, {name: action.username, isInGame: action.isInGame}]
            };
        case actionTypes.REMOVE_PLAYER_FROM_LIST:
            return {
                ...state,
                playersOnline: state.playersOnline.filter(player => player.name !== action.username)
            };
        default:
            return state;
    }
};

export default reducer;
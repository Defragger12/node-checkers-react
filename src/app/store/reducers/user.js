import * as actionTypes from '../actions/actionTypes';

const initialState = {
    fileNames: []
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_FILE_NAMES: return {...state, fileNames: action.names};
        default: return state;
    }
};

export default reducer;
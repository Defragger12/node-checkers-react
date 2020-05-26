import {bottomLeft, bottomRight, topLeft, topRight} from "./positioning";

export const RANK = {
    PLEB: 'pleb',
    QUEEN: 'queen'
};

export const COLOR = {
    BLACK: 'black',
    WHITE: 'white'
};

export const DIRECTION = {
    TOP_LEFT: topLeft,
    TOP_RIGHT: topRight,
    BOTTOM_LEFT: bottomLeft,
    BOTTOM_RIGHT: bottomRight
};

export const TURN_DELAY = 200;

export const STEP_LENGTH = 101;
export const FIELD_LENGTH = 8;
export const FIELD_HORIZONTAL_BORDER_LENGTH = 51;
export const FIELD_VERTICAL_BORDER_LENGTH = 50;

export const PORT = 3001;
export const BASE_URL = `http://localhost:${PORT}`;
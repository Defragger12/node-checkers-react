import "./Square.css";

import React from 'react';
import {FIELD_HORIZONTAL_BORDER_LENGTH, FIELD_VERTICAL_BORDER_LENGTH, STEP_LENGTH} from "../../../constants";

const Square = ({position, piece, playerColor, isInactive}) => {

    const generateClass = () => {
        return "square " + (!piece ? "droppable " : generatePieceClass(piece));
    };

    const generatePieceClass = (piece) => {
        return piece.rank + "_" + piece.color + ((piece.color === playerColor && !isInactive) ? " draggable" : "");
    };

    const style = {
        left: FIELD_HORIZONTAL_BORDER_LENGTH + (position[0] - 1) * STEP_LENGTH + 'px',
        top: FIELD_VERTICAL_BORDER_LENGTH + (position[1] - 1) * STEP_LENGTH + 'px'
    };

    return (
        <div
            className={generateClass()}
            style={style}
            data-position={position}
        />
    )
};

export default Square;
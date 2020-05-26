import React from 'react';
import './Photo.css';
import {COLOR} from "../../../constants";

const Photo = ({color, avatar, isHighlighted}) => {
    let id = `${color}_color`;
    return (
        <img
            src={`/assets/photos/${avatar || 'unknown.png'}`}
            id={id}
            alt={id}
            className={`${color}_player ${(avatar || color === COLOR.WHITE) ? "" : "d-none"}${isHighlighted ? " highlighted" : ""}`}
            />
    )
};

export default Photo;
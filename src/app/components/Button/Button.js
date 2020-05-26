import React from 'react';
import {BASE_URL} from "../../../constants";

const Button = ({id, label, disabled, handleClick, targetModal, action, name}) => {
    if (targetModal) {
        return (
            <button onClick={handleClick} type="button" id={id} className="btn btn-outline-secondary mb-2"
                    data-toggle="modal" data-target={targetModal} disabled={disabled}>
                {label}
            </button>
        )
    } else {
        return (
            <form action={`${BASE_URL}${action}`} method="post">
                <label className="btn btn-outline-secondary" htmlFor={id}>{label}</label>
                <input id={id} type="file" name={name} onChange={handleClick}/>
            </form>
        )
    }
};

export default Button;
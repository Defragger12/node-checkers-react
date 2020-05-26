import React from 'react';
import "./Modal.css"
import ModalItem from "./ModalItem/ModalItem";

const Modal = ({type, items}) => (
    <div className="modal fade" id={`${type}ListModal`} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-body list-group">
                    <button type="button" className="close-button" data-dismiss="modal" aria-label="Close">
                        &times;
                    </button>
                    {items.map(item => <ModalItem type={type} item={item} key={item.toString()}/>)}
                </div>
            </div>
        </div>
    </div>
);

export default Modal;
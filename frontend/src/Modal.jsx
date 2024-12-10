import React from 'react';
import './Modal.css'; // Styles du modal

function Modal({ onClose, children }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;

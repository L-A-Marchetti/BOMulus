import React, { useEffect } from 'react';
import './Modal.css'; // Styles du modal

function Modal({ onClose, children }) {
    // Gestion de la fermeture avec la touche Échap
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        // Nettoyage de l'écouteur d'événements
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    // Gestion de la fermeture en cliquant sur l'overlay
    const handleOverlayClick = () => {
        onClose();
    };

    // Empêcher la fermeture lorsque l'on clique à l'intérieur du modal
    const handleContentClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;

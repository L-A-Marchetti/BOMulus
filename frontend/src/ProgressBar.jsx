import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, className = '' }) => {
    const size = '100%'; // Use 100% to fill the parent container
    const strokeWidth = 3; // Épaisseur du contour

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`progress-bar ${className}`}
        >
            {/* Carré de fond */}
            <rect
                x={strokeWidth / 2}
                y={strokeWidth / 2}
                width={100 - strokeWidth}
                height={100 - strokeWidth}
                fill="#353535"
            />
            {/* Contour du carré pour la progression */}
            <rect
                x={strokeWidth / 2}
                y={strokeWidth / 2}
                width={100 - strokeWidth}
                height={100 - strokeWidth}
                fill="none"
                stroke="#575757"
                strokeWidth={strokeWidth}
                strokeDasharray={400} // Périmètre du carré
                strokeDashoffset={400 - (progress / 100) * 400}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
        </svg>
    );
};

export default ProgressBar;
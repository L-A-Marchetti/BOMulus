import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, className = '' }) => {
    const size = 100;
    const strokeWidth = 3;
    const halfStrokeWidth = strokeWidth / 2;

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${size} ${size}`}
            className={`progress-bar ${className}`}
        >
            {/* Carré de fond */}
            <rect
                x={halfStrokeWidth}
                y={halfStrokeWidth}
                width={size - strokeWidth}
                height={size - strokeWidth}
                fill="#353535"
            />
            {/* Contour du carré pour la progression */}
            <rect
                x={halfStrokeWidth}
                y={halfStrokeWidth}
                width={size - strokeWidth}
                height={size - strokeWidth}
                fill="none"
                stroke="#575757"
                strokeWidth={strokeWidth}
                strokeDasharray={400}
                strokeDashoffset={400 - (progress / 100) * 400}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
        </svg>
    );
};

export default ProgressBar;
/*
 * ProgressBar.jsx
 * 
 * Affiche un contour de carré qui se remplit progressivement en fonction du pourcentage de progression.
 *
 * Props:
 * progress: Nombre représentant le pourcentage d'achèvement (0 à 100).
 */

import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
    const size = 70; // Taille du carré en pixels (ajustez selon vos préférences)
    const strokeWidth = 3; // Épaisseur du contour

    const perimeter = 4 * (size - strokeWidth); // Périmètre du carré

    const offset = perimeter - (progress / 100) * perimeter;

    return (
        <svg width={size} height={size} className="progress-bar">
            {/* Carré de fond */}
            <rect
                x={strokeWidth / 2}
                y={strokeWidth / 2}
                width={size - strokeWidth}
                height={size - strokeWidth}
                fill="#353535"
            />
            {/* Contour du carré pour la progression */}
            <rect
                x={strokeWidth / 2}
                y={strokeWidth / 2}
                width={size - strokeWidth}
                height={size - strokeWidth}
                fill="none"
                stroke="#575757"
                strokeWidth={strokeWidth}
                strokeDasharray={perimeter}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
        </svg>
    );
};

export default ProgressBar;

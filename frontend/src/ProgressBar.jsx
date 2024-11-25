/*
 * ProgressBar.jsx
 * 
 * Affiche un disque qui se remplit progressivement en fonction du pourcentage de progression.
 *
 * Props:
 * progress: Nombre représentant le pourcentage d'achèvement (0 à 100).
 */

import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
    const size = 50; // Diamètre du disque
    const strokeWidth = 2; // Bordure extérieure
    const center = size / 2;
    const radius = center - strokeWidth; // Rayon du disque intérieur
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="progress-bar">
            {/* Cercle de fond */}
            <circle
                className="progress-bar-background"
                cx={center}
                cy={center}
                r={radius}
                fill="#353535" // Couleur du fond
            />
            {/* Cercle de progression */}
            <circle
                className="progress-bar-circle"
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#575757" // Couleur du remplissage
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
        </svg>
    );
};

export default ProgressBar;

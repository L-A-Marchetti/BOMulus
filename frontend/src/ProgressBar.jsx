/*
 * ProgressBar.jsx
 * 
 * Displays a progress bar indicating the completion percentage of a task.
 *
 * Props:
 * progress: Number representing the completion percentage (0 to 100).
 */

import React from 'react';
import './AnalyzeButton.css';

// Displays a progress bar with the given percentage
const ProgressBar = ({ progress }) => (
    <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
);

export default ProgressBar;

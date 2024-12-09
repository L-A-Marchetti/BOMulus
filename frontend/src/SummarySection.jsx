import React from 'react';
import './CompareView.css'; // Importing the external CSS file
import Stats from './Stats';

// Main SummarySection component
function SummarySection({ operatorCounts, opColors, statsData }) {
    return (
        <div className="summary-section" >
            <div className="operator-summary">
                {operatorCounts.map(({ operator, count }) => (
                    <span key={operator} style={{ color: opColors[operator], marginRight: '20px' }}>
                        {operator}: {count}
                    </span>
                ))}
            </div>
            {/* Ajoutez d'autres informations si nécessaire */}
        </div>
    );
}

export default SummarySection;

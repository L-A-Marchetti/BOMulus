// SummarySection.jsx

import React from 'react';
import './CompareView.css'; // Importing the external CSS file

// Main SummarySection component
function SummarySection({ components, operators, opColors }) {
    return (
        <div className="summary-section">
            <div className="operator-summary">
                {operators.map((operator) => (
                    <span key={operator} style={{ color: opColors[operator], marginRight: '20px' }}>
                        {operator}: {components.filter(comp => comp.Operator === operator).length}
                    </span>
                ))}
            </div>
            {/* Vous pouvez ajouter d'autres informations ici */}
        </div>
    );
}

export default SummarySection;

import React from 'react';
import './WarningToolTip.css';
const WarningTooltip = ({ totalWarnings }) => {
    return (
        <div className="warning-tooltip">
            {totalWarnings}
        </div>
    );
};

export default WarningTooltip;
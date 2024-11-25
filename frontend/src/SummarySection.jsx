/*
 * SummarySection.jsx
 * 
 * Component for displaying summary information and filter buttons.
 *
 * Props:
 * components: Array of components to summarize.
 * operators: Array of operator types.
 * opColors: Object mapping operator types to colors.
 * activeFilters: Object containing the active state of filters.
 * toggleFilter: Function to toggle the active state of a filter.
 */


import React from 'react';
import Button from './Button';
import './CompareView.css'; // Importing the external CSS file

// Main SummarySection component
function SummarySection({ components, operators, opColors, activeFilters, toggleFilter }) {
    // Calculate counts for various statuses
    const getStatusCounts = () => ({
        outOfStockCount: components.filter(comp => comp.availability === "" && comp.analyzed).length,
        riskyLifecycleCount: components.filter(comp =>
            comp.lifecycle_status !== "" &&
            comp.lifecycle_status !== "New Product" &&
            comp.lifecycle_status !== "New at Mouser" &&
            comp.analyzed
        ).length,
        manufacturerMessagesCount: components.filter(comp =>
            comp.info_messages !== null && comp.analyzed
        ).length,
        mismatchingMpnCount: components.filter(comp =>
            comp.mismatch_mpn !== null && comp.analyzed
        ).length
    });

    const statusCounts = getStatusCounts();

    return (
        <div className="summary-section">
            <div className="operator-summary">
                {operators.map((operator) => (
                    <span key={operator} style={{ color: opColors[operator], marginRight: '20px' }}>
                        {operator}: {components.filter(comp => comp.Operator === operator).length}
                    </span>
                ))}
            </div>
            <div className="filter-buttons">
                <FilterButton
                    label="Out of Stock"
                    count={statusCounts.outOfStockCount}
                    isActive={activeFilters.outOfStock}
                    onClick={() => toggleFilter('outOfStock')}
                />
                <FilterButton
                    label="Risky Lifecycle"
                    count={statusCounts.riskyLifecycleCount}
                    isActive={activeFilters.riskyLifecycle}
                    onClick={() => toggleFilter('riskyLifecycle')}
                />
                <FilterButton
                    label="Manufacturer Messages"
                    count={statusCounts.manufacturerMessagesCount}
                    isActive={activeFilters.manufacturerMessages}
                    onClick={() => toggleFilter('manufacturerMessages')}
                />
                <FilterButton
                    label="Mismatching MPN"
                    count={statusCounts.mismatchingMpnCount}
                    isActive={activeFilters.mismatchingMpn}
                    onClick={() => toggleFilter('mismatchingMpn')}
                />
            </div>
        </div>
    );
}

// Sub-component for individual filter buttons
function FilterButton({ label, count, isActive, onClick }) {
    return (
        <Button
            onClick={onClick}
            className={`filter-button ${isActive ? 'active' : ''}`}
        >
            {label}: {count}
        </Button>
    );
}

export default SummarySection;

/*
 * CompareView.jsx
 * 
 * Displays and manages the comparison of components.
 *
 * Props:
 * components: Array of all components.
 * setComponents: Function to update the parent's component state.
 * onPinToggle: Function to handle pinning/unpinning of components.
 * pinnedComponents: Array of currently pinned components.
 *
 * States:
 * activeFilters: Object containing active filter states.
 *
 * Sub-components:
 * OperatorExpander: Expandable section for each operator type.
 * Button: Reusable button component for filters.
 *
 * Backend Dependencies:
 * GetComponents: Fetches updated component data.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { GetComponents } from "../wailsjs/go/main/App";
import './CompareView.css';
import OperatorExpander from './Expander';
import SummarySection from './SummarySection';

// Constants
const OPERATORS = ["INSERT", "UPDATE", "DELETE", "EQUAL"];
const OP_COLORS = {
    INSERT: '#86b384',
    UPDATE: '#8e84b3',
    DELETE: '#cc7481',
    EQUAL: '#636363',
};

// Main CompareView component
function CompareView({ components, setComponents, onPinToggle, pinnedComponents }) {
    const [activeFilters, setActiveFilters] = useState({
        outOfStock: false,
        riskyLifecycle: false,
        manufacturerMessages: false,
        mismatchingMpn: false
    });

    // Fetches and updates components
    const updateComponents = useCallback(async () => {
        try {
            const updatedComponents = await GetComponents();
            setComponents(updatedComponents);
        } catch (error) {
            console.error("Error fetching components:", error);
        }
    }, [setComponents]);

    useEffect(() => {
        updateComponents();
        const intervalId = setInterval(updateComponents, 300);
        return () => clearInterval(intervalId);
    }, [updateComponents]);

    // Toggles filter state
    const toggleFilter = (filterName) => {
        setActiveFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    // Filters components based on active filters
    const filterComponents = (components) => {
        return components.filter(comp => {
            if (activeFilters.outOfStock && (comp.availability !== "" || !comp.analyzed)) return false;
            if (activeFilters.riskyLifecycle && (comp.lifecycle_status === "" || comp.lifecycle_status === "New Product" || comp.lifecycle_status === "New at Mouser" || !comp.analyzed)) return false;
            if (activeFilters.manufacturerMessages && (comp.info_messages === null || !comp.analyzed)) return false;
            if (activeFilters.mismatchingMpn && (comp.mismatch_mpn === null || !comp.analyzed)) return false;
            return true;
        });
    };

    return (
        <div className="compare-grid">
            {components.length > 0 && (
                <SummarySection
                    components={components}
                    operators={OPERATORS}
                    opColors={OP_COLORS}
                    activeFilters={activeFilters}
                    toggleFilter={toggleFilter}
                />
            )}

            {OPERATORS.map((operator) => {
                const filteredComponents = filterComponents(components.filter(comp => comp.Operator === operator));
                return filteredComponents.length > 0 ? (
                    <OperatorExpander
                        key={operator}
                        operator={operator}
                        components={filteredComponents}
                        color={OP_COLORS[operator]}
                        count={filteredComponents.length}
                        onPinToggle={onPinToggle}
                        pinnedComponents={pinnedComponents}
                    />
                ) : null;
            })}
        </div>
    );
}

export default CompareView;

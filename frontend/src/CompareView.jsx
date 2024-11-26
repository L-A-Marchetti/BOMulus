// CompareView.jsx

import React, { useEffect, useCallback } from 'react';
import { GetComponents } from "../wailsjs/go/main/App";
import './CompareView.css';
import OperatorExpander from './Expander';
import SummarySection from './SummarySection';

function CompareView({ components, setComponents, onPinToggle, pinnedComponents, activeFilters, operators, opColors }) {
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

    // Filters components based on active filters
    const filterComponents = (components) => {
        return components.filter(comp => {
            // Filtrer par opérateurs sélectionnés
            if (activeFilters.operators.length > 0 && !activeFilters.operators.includes(comp.Operator)) {
                return false;
            }
            // Filtrer par avertissements
            if (activeFilters.warning) {
                if (activeFilters.warning === 'outOfStock' && (comp.availability !== "" || !comp.analyzed)) return false;
                if (activeFilters.warning === 'riskyLifecycle' && (comp.lifecycle_status === "" || comp.lifecycle_status === "New Product" || comp.lifecycle_status === "New at Mouser" || !comp.analyzed)) return false;
                if (activeFilters.warning === 'manufacturerMessages' && (comp.info_messages === null || !comp.analyzed)) return false;
                if (activeFilters.warning === 'mismatchingMpn' && (comp.mismatch_mpn === null || !comp.analyzed)) return false;
            }
            // Autres filtres si nécessaire
            return true;
        });
    };

    return (
        <div className="compare-grid">
            {components.length > 0 && (
                <SummarySection
                    components={components}
                    operators={operators}
                    opColors={opColors}
                />
            )}

            {operators.map((operator) => {
                const filteredComponents = filterComponents(components.filter(comp => comp.Operator === operator));
                return filteredComponents.length > 0 ? (
                    <OperatorExpander
                        key={operator}
                        operator={operator}
                        components={filteredComponents}
                        color={opColors[operator]}
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

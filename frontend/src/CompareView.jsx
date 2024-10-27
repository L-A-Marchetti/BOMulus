import React, { useEffect, useState, useCallback } from 'react';
import { GetComponents } from "../wailsjs/go/main/App";
import './CompareView.css';
import AnalyzeButton from './AnalyzeButton';
import OperatorExpander from './Expander';
import Button from './Button';

function CompareView({ setComponents, onPinToggle, pinnedComponents }) {
    const [components, setLocalComponents] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        outOfStock: false,
        riskyLifecycle: false,
        manufacturerMessages: false,
        mismatchingMpn: false
    });

    const operators = ["INSERT", "UPDATE", "DELETE", "EQUAL"];
    const opColors = {
        INSERT: '#86b384',
        UPDATE: '#8e84b3',
        DELETE: '#cc7481',
        EQUAL: '#636363',
    };

    const updateComponents = useCallback(async () => {
        try {
            const updatedComponents = await GetComponents();
            console.log(updatedComponents);
            setLocalComponents(updatedComponents);
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

    const handleComponentAnalyzed = (currentIndex) => {
        setLocalComponents(prevComponents =>
            prevComponents.map((component, index) =>
                index === currentIndex ? { ...component, Analyzed: true } : component
            )
        );
    };

    const getStatusCounts = () => {
        const outOfStockCount = components.filter(comp => comp.availability === "" && comp.analyzed).length;
        const riskyLifecycleCount = components.filter(comp =>
            comp.lifecycle_status !== "" &&
            comp.lifecycle_status !== "New Product" &&
            comp.lifecycle_status !== "New at Mouser" &&
            comp.analyzed
        ).length;
        const manufacturerMessagesCount = components.filter(comp =>
            comp.info_messages !== null && comp.analyzed
        ).length;
        const mismatchingMpnCount = components.filter(comp =>
            comp.mismatch_mpn !== null && comp.analyzed
        ).length;

        return { outOfStockCount, riskyLifecycleCount, manufacturerMessagesCount, mismatchingMpnCount };
    };

    const toggleFilter = (filterName) => {
        setActiveFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    const statusCounts = getStatusCounts();

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
                <div className="summary-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {operators.map((operator) => (
                            <span key={operator} style={{ color: opColors[operator], marginRight: '20px' }}>
                                {operator}: {components.filter(comp => comp.Operator === operator).length}
                            </span>
                        ))}
                        <AnalyzeButton onComponentAnalyzed={handleComponentAnalyzed} />
                    </div>
                    <div>
                        <Button 
                            onClick={() => toggleFilter('outOfStock')}
                            style={{ 
                                backgroundColor: activeFilters.outOfStock ? 'lightblue' : 'inherit',
                            }}
                        >
                            Out of Stock: {statusCounts.outOfStockCount}
                        </Button>
                        <Button 
                            onClick={() => toggleFilter('riskyLifecycle')}
                            style={{ 
                                backgroundColor: activeFilters.riskyLifecycle ? 'lightblue' : 'inherit',
                            }}
                        >
                            Risky Lifecycle: {statusCounts.riskyLifecycleCount}
                        </Button>
                        <Button 
                            onClick={() => toggleFilter('manufacturerMessages')}
                            style={{ 
                                backgroundColor: activeFilters.manufacturerMessages ? 'lightblue' : 'inherit',                                                   }}
                        >
                            Manufacturer Messages: {statusCounts.manufacturerMessagesCount}
                        </Button>
                        <Button 
                            onClick={() => toggleFilter('mismatchingMpn')}
                            style={{ 
                                backgroundColor: activeFilters.mismatchingMpn ? 'lightblue' : 'inherit',
                            }}
                        >
                            Mismatching MPN: {statusCounts.mismatchingMpnCount}
                        </Button>
                    </div>
                </div>
            )}

            {operators.map((operator, index) => {
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

import React, { useEffect, useState, useCallback } from 'react';
import { GetComponents } from "../wailsjs/go/main/App";
import './CompareView.css';
import AnalyzeButton from './AnalyzeButton';
import OperatorExpander from './Expander';

function CompareView({ setComponents, onPinToggle, pinnedComponents }) {
    const [components, setLocalComponents] = useState([]);
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
            console.log(updatedComponents); // Vérifie la structure des données ici
            setLocalComponents(updatedComponents);
            setComponents(updatedComponents); // Mettre à jour les composants dans App
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

    const getDiffSummary = () => {
        return operators.map(operator => components.filter(comp => comp.Operator === operator).length);
    };

    const getStatusCounts = () => {
        const outOfStockCount = components.filter(comp => comp.Availability === "" && comp.Analyzed).length;
        const riskyLifecycleCount = components.filter(comp =>
            comp.LifecycleStatus !== "" &&
            comp.LifecycleStatus !== "New Product" &&
            comp.LifecycleStatus !== "New at Mouser" &&
            comp.Analyzed
        ).length;
        const manufacturerMessagesCount = components.filter(comp =>
            comp.InfoMessages !== null && comp.Analyzed
        ).length;
        const mismatchingMpnCount = components.filter(comp =>
            comp.MismatchMpn !== null && comp.Analyzed
        ).length;

        return { outOfStockCount, riskyLifecycleCount, manufacturerMessagesCount, mismatchingMpnCount };
    };

    const diffSummary = getDiffSummary();
    const statusCounts = getStatusCounts();

    return (
        <div className="compare-grid">
            {/* Afficher la section de résumé uniquement si des composants existent */}
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
                        {/* Ajout des nouveaux compteurs */}
                        <span style={{ marginRight: '20px' }}>
                            Out of Stock: {statusCounts.outOfStockCount}
                        </span>
                        <span style={{ marginRight: '20px' }}>
                            Risky Lifecycle: {statusCounts.riskyLifecycleCount}
                        </span>
                        <span style={{ marginRight: '20px' }}>
                            Manufacturer Messages: {statusCounts.manufacturerMessagesCount}
                        </span>
                        <span style={{ marginRight: '20px' }}>
                            Mismatching MPN: {statusCounts.mismatchingMpnCount}
                        </span>
                    </div>
                </div>
            )}

            {/* Afficher OperatorExpander uniquement si des composants existent pour cet opérateur */}
            {operators.map((operator, index) => {
                const filteredComponents = components.filter(comp => comp.Operator === operator);
                return filteredComponents.length > 0 ? (
                    <OperatorExpander
                        key={operator}
                        operator={operator}
                        components={filteredComponents}
                        color={opColors[operator]}
                        count={diffSummary[index]}
                        onPinToggle={onPinToggle} // Passer la fonction d'épinglage
                        pinnedComponents={pinnedComponents}
                    />
                ) : null; // Ne rien rendre si aucun composant n'est trouvé
            })}
        </div>
    );
}

export default CompareView;

import React from 'react';
import './CompareView.css';
import OperatorExpander from './Expander';
import SummarySection from './SummarySection';
import PinnedComponents from './PinnedComponents';
import RightSidebar from './RightSideBar';
import Button from './Button';
import TopMenu from './TopMenu'; // Ajout de TopMenu

function CompareView({
    onComponentAnalyzed,
    components,
    onCompare,
    onPinToggle,
    pinnedComponents = [], // Valeur par défaut
    operators,
    opColors,
    onClose,
    activeWorkspace,
    activeFilters,
    setActiveFilters, // Props nécessaires pour TopMenu
    warningCounts,
    totalWarnings,
}) {
    console.log("CompareView.jsx - onCompare:", onCompare);

    // Calculer operatorCounts
    const operatorCounts = operators.map((operator) => {
        const count = components.filter((comp) => comp.Operator === operator).length;
        return { operator, count };
    });

    return (
        <div className="compare-view-layout">
            {/* Main content */}
            <main id="main-content" className="main-content">
                {/* Workspace header with close button */}
                <div className="close-button-container">
                    ☰ Current workspace :&nbsp;
                    <span style={{ fontWeight: 'bold' }}>
                        {activeWorkspace?.replace(/\\/g, '/').split('/').pop()}
                    </span>
                    <div className="close-button-spacer"></div>
                    <Button onClick={onClose}>☓</Button>
                </div>
                <RightSidebar />
                {/* Top menu bar */}
                <TopMenu
                    onComponentAnalyzed={onComponentAnalyzed}
                    onCompare={onCompare}
                    operators={operators}
                    operatorCounts={operatorCounts}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    opColors={opColors}
                    warningCounts={warningCounts}
                    totalWarnings={totalWarnings}
                />

                {/* Summary section */}
                {components.length > 0 && (
                    <SummarySection
                        operatorCounts={operatorCounts}
                        opColors={opColors}
                    />
                )}

                {/* Operator-specific components */}
                <div className="operator-sections">
                    {operators.map((operator) => {
                        const operatorComponents = components.filter(
                            (comp) => comp.Operator === operator
                        );
                        return operatorComponents.length > 0 ? (
                            <OperatorExpander
                                key={operator}
                                operator={operator}
                                components={operatorComponents}
                                color={opColors[operator]}
                                count={operatorComponents.length}
                                onPinToggle={onPinToggle}
                                pinnedComponents={pinnedComponents}
                            />
                        ) : null;
                    })}
                </div>
            </main>
        </div>
    );
}

export default CompareView;

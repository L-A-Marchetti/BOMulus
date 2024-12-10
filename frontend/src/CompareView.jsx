import React from 'react';
import './CompareView.css';
import OperatorExpander from './Expander';
import Button from './Button';
import TopMenu from './TopMenu'; // Ajout de TopMenu
import SettingsIcon from "./assets/images/settings.svg";
import DesignatorEditor from "./DesignatorEditor";

function CompareView({
    onComponentAnalyzed,
    components,
    componentsAll,
    onCompare,
    onPinToggle,
    pinnedComponents = [],
    operators,
    opColors,
    onClose,
    onSettings,
    activeWorkspace,
    activeFilters,
    setActiveFilters,
    warningCounts,
    totalWarnings,
    statsData = { statsData }
}) {
    console.log("CompareView.jsx - onCompare:", onCompare);

    // Calculer operatorCounts
    const operatorCounts = operators.map((operator) => {
        const count = components.filter((comp) => comp.Operator === operator).length;
        return { operator, count };
    });
    console.log("2. Updated Components:", componentsAll);

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
                    <Button style={{ marginRight: '10px' }} onClick={onSettings}>
                        <img style={{ width: '15px', height: '18px' }} src={SettingsIcon} alt="Settings Icon" />
                    </Button>
                    <Button onClick={onClose}>☓</Button>
                </div>
                {/* Top menu bar */}
                <TopMenu
                    componentsAll={componentsAll}
                    onComponentAnalyzed={onComponentAnalyzed}
                    onCompare={onCompare}
                    operators={operators}
                    operatorCounts={operatorCounts}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    opColors={opColors}
                    warningCounts={warningCounts}
                    totalWarnings={totalWarnings}
                    pinnedComponents={pinnedComponents}
                    statsData={statsData}
                />



                <div>
                    <h1>Designator Edit Test</h1>
                    <DesignatorEditor />
                </div>

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

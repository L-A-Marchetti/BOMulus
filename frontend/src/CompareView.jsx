import './CompareView.css';
import React, { useState, useEffect } from 'react';
import { GetApiPriority } from '../wailsjs/go/main/App';
import OperatorExpander from './Expander';
import Button from './Button';
import TopMenu from './TopMenu'; // Ajout de TopMenu
import SettingsIcon from "./assets/images/settings.svg";
import DesignatorEditor from "./DesignatorEditor";

function CompareView({
    onRefreshComponents,
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
    const [apiPriority, setApiPriority] = useState([]);

    useEffect(() => {
        loadApiPriority();
    }, []);

    const loadApiPriority = async () => {
        try {
            const priority = await GetApiPriority();
            setApiPriority(priority || []);
        } catch (error) {
            console.error("Error loading API priority:", error);
        }
    };

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
                    onRefreshComponents={onRefreshComponents}
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
                                apiPriority={apiPriority}
                            />
                        ) : null;
                    })}
                </div>
            </main>
        </div>
    );
}

export default CompareView;

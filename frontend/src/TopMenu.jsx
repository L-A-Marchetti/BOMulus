import React from 'react';
import './TopMenu.css';
import FileManager from './FileManager';
import AnalyzeButton from './AnalyzeButton';
import Filters from './Filters';
import Stats from './Stats';

function TopMenu({
    onComponentAnalyzed,
    operators,
    operatorCounts,
    activeFilters,
    setActiveFilters,
    opColors,
    warningCounts,
    totalWarnings,
    onCompare,
    pinnedComponents,
    statsData
}) {
    return (
        <div className="top-menu">
            <div className="left-side">
                <h4 className="section-title">File manager</h4>
                {onCompare && <FileManager onCompare={onCompare} />}
            </div>

            <div className="middle-side">
                <h4 className="section-title">Analysis</h4>
                <AnalyzeButton onComponentAnalyzed={onComponentAnalyzed} />
            </div>

            {/* On crée un conteneur flex pour Stats et Filters */}
            <div className="stats-filters-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Stats statsData={statsData} />
                <div>
                    <h4 className="section-title">Filters</h4>
                    <Filters
                        operators={operators}
                        operatorCounts={operatorCounts}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        opColors={opColors}
                        warningCounts={warningCounts}
                        totalWarnings={totalWarnings}
                        pinnedComponents={pinnedComponents}
                    />
                </div>
            </div>
        </div>
    );
}

export default TopMenu;

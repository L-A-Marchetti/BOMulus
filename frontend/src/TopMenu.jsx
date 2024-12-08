import React from 'react';
import './TopMenu.css';
import FileManager from './FileManager'; // Ajout de l'import manquant
import AnalyzeButton from './AnalyzeButton'; // Ajout de l'import manquant
import Filters from './Filters'; // Ajout de l'import manquant

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
    pinnedComponents // Ajout
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
            <div className="right-side">
                <h4 className="section-title">Filters</h4>
                <Filters
                    operators={operators}
                    operatorCounts={operatorCounts}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    opColors={opColors}
                    warningCounts={warningCounts}
                    totalWarnings={totalWarnings}
                    pinnedComponents={pinnedComponents} // Ajout
                />
            </div>
        </div>
    );
}

export default TopMenu;

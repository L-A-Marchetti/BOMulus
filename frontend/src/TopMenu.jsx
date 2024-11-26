// TopMenu.jsx

import React from 'react';
import FileManager from './FileManager';
import AnalyzeButton from './AnalyzeButton';
import Filters from './Filters';
import './TopMenu.css';

function TopMenu({ onComponentAnalyzed, components, operators, activeFilters, setActiveFilters, opColors }) {
    return (
        <div className="top-menu">
            <div className="left-side">
                <h4 className="section-title">File manager</h4>
                <FileManager />
            </div>
            <div className="middle-side">
                <h4 className="section-title">Analysis</h4>
                <AnalyzeButton onComponentAnalyzed={onComponentAnalyzed} />
            </div>
            <div className="right-side">
                <h4 className="section-title">Filters</h4>
                <Filters
                    components={components}
                    operators={operators}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    opColors={opColors}
                />
            </div>
        </div>
    );
}

export default TopMenu;

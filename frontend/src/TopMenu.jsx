// TopMenu.jsx

import React from 'react';
import FileManager from './FileManager';
import AnalyzeButton from './AnalyzeButton';
import './TopMenu.css';

function TopMenu({ onComponentAnalyzed }) {
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
                {/* Vous pouvez ajouter d'autres composants ici */}
            </div>
        </div>
    );
}

export default TopMenu;

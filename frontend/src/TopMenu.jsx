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
    onCompare
}) {
    console.log("TopMenu.jsx - Transmitting onCompare:", onCompare);
    return (
        <div className="top-menu">
            {/* Section gauche : Gestion des fichiers */}
            <div className="left-side">
                <h4 className="section-title">File manager</h4>
                {onCompare && <FileManager onCompare={onCompare} />}
            </div>


            {/* Section centrale : Bouton d'analyse */}
            <div className="middle-side">
                <h4 className="section-title">Analysis</h4>
                <AnalyzeButton onComponentAnalyzed={onComponentAnalyzed} />
            </div>

            {/* Section droite : Filtres */}
            <div className="right-side">
                <h4 className="section-title">Filters</h4>
                <Filters
                    operators={operators}
                    operatorCounts={operatorCounts} // Comptes d'opérateurs calculés globalement
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    opColors={opColors}
                    warningCounts={warningCounts} // Comptes de warnings calculés globalement
                    totalWarnings={totalWarnings}
                />
            </div>
        </div>
    );
}

export default TopMenu;

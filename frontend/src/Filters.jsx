// Filters.jsx

import React from 'react';
import './Filters.css';
import BookmarkIcon from "./assets/images/bookmark.svg";
import WarningToolTip from './WarningToolTip';

function Filters({ components, operators, activeFilters, setActiveFilters, opColors }) {
    // Calculer les quantités pour chaque opérateur
    const operatorCounts = operators.map((operator) => {
        const count = components.filter(comp => comp.Operator === operator).length;
        return { operator, count };
    });

    // Calculer les quantités pour les warnings
    const warningsCounts = {
        outOfStock: components.filter(comp => comp.availability === "" && comp.analyzed).length,
        riskyLifecycle: components.filter(comp =>
            comp.lifecycle_status !== "" &&
            comp.lifecycle_status !== "New Product" &&
            comp.lifecycle_status !== "New at Mouser" &&
            comp.analyzed
        ).length,
        manufacturerMessages: components.filter(comp =>
            comp.info_messages !== null && comp.analyzed
        ).length,
        mismatchingMpn: components.filter(comp =>
            comp.mismatch_mpn !== null && comp.analyzed
        ).length,
    };

    const totalWarnings = warningsCounts.outOfStock + warningsCounts.riskyLifecycle + warningsCounts.manufacturerMessages + warningsCounts.mismatchingMpn;

    // Gérer le clic sur un opérateur
    const handleOperatorClick = (operator) => {
        setActiveFilters(prevFilters => {
            const isSelected = prevFilters.operators.includes(operator);
            let newOperators;
            if (isSelected) {
                // Si déjà sélectionné, on le retire
                newOperators = prevFilters.operators.filter(op => op !== operator);
            } else {
                // Sinon, on l'ajoute
                newOperators = [...prevFilters.operators, operator];
            }
            return {
                ...prevFilters,
                operators: newOperators,
            };
        });
    };

    // Gérer le changement de filtre pour les warnings
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div className="filters">
            <div className="filters-grid">
                {/* Boutons des opérateurs */}
                <div className="filter-item">
                    <div className="filter-item operator-buttons">
                        {operatorCounts.map(({ operator, count }) => (
                            <button
                                key={operator}
                                className={`operator-button ${activeFilters.operators.includes(operator) ? 'active' : ''}`}
                                style={{ backgroundColor: opColors[operator] }}
                                onClick={() => handleOperatorClick(operator)}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Dropdown Warnings */}
                <div className="filter-item">
                    <div className="dropdown-container">
                        <WarningToolTip totalWarnings={totalWarnings} />
                        <select
                            name="warning"
                            value={activeFilters.warning || ""}
                            onChange={handleFilterChange}
                            className="filter-select-dropdown"
                        >
                            <option value="" > > Warnings</option>
                            <option value="outOfStock">
                                Out of Stock: {warningsCounts.outOfStock}
                            </option>
                            <option value="riskyLifecycle">
                                Risky Lifecycle: {warningsCounts.riskyLifecycle}
                            </option>
                            <option value="manufacturerMessages">
                                Manufacturer Messages: {warningsCounts.manufacturerMessages}
                            </option>
                            <option value="mismatchingMpn">
                                Mismatching MPN: {warningsCounts.mismatchingMpn}
                            </option>
                        </select>
                    </div>
                </div>

                {/* Dropdown Filter 3 */}
                <div className="filter-item">
                    <select
                        name="filter3"
                        value={activeFilters.filter3 || ""}
                        onChange={handleFilterChange}
                        className="filter-select-dropdown"
                    >
                        <option value="">Functions</option>
                        {/* Ajoutez vos options ici */}
                    </select>
                </div>

                {/* Dropdown Filter 4 */}
                <div className="filter-item">
                    <select
                        name="filter4"
                        value={activeFilters.filter4 || ""}
                        onChange={handleFilterChange}
                        className="filter-select-dropdown"
                    >
                        <option value="">Suggestions</option>
                        {/* Ajoutez vos options ici */}
                    </select>
                </div>

                {/* Bouton pour réinitialiser les filtres */}
                <button onClick={() => setActiveFilters({
                    operators: [],
                    warning: '',
                    filter3: '',
                    filter4: ''
                })} className="filters-button">
                    <img src={BookmarkIcon} alt="Reset filters" style={{ width: "20px", height: "20px" }} />
                </button>
            </div>
        </div>
    );
}

export default Filters;

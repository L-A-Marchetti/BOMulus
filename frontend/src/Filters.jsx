import React from 'react';
import './Filters.css';
import BookmarkIcon from "./assets/images/bookmark.svg";
import WarningToolTip from './WarningToolTip';

function Filters({ operators, operatorCounts, activeFilters, setActiveFilters, opColors, warningCounts, totalWarnings }) {
    // Gérer le clic sur un opérateur
    const handleOperatorClick = (operator) => {
        setActiveFilters(prevFilters => {
            const isSelected = prevFilters.operators.includes(operator);
            const newOperators = isSelected
                ? prevFilters.operators.filter(op => op !== operator) // Retirer l'opérateur
                : [...prevFilters.operators, operator]; // Ajouter l'opérateur
            return { ...prevFilters, operators: newOperators };
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
                        {operatorCounts && operatorCounts.map(({ operator, count }) => (
                            <button
                                key={operator}
                                className={`operator-button ${activeFilters.operators.includes(operator) ? 'active' : ''}`}
                                style={{ backgroundColor: opColors[operator] }}
                                onClick={() => handleOperatorClick(operator)}
                            >
                                {operator} ({count})
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
                            <option value="">> Warnings</option>
                            {warningCounts && (
                                <>
                                    <option value="outOfStock">Out of Stock: {warningCounts.outOfStock}</option>
                                    <option value="riskyLifecycle">Risky Lifecycle: {warningCounts.riskyLifecycle}</option>
                                    <option value="manufacturerMessages">Manufacturer Messages: {warningCounts.manufacturerMessages}</option>
                                    <option value="mismatchingMpn">Mismatching MPN: {warningCounts.mismatchingMpn}</option>
                                </>
                            )}
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
                        <option value="">> Functions</option>
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
                        <option value="">> Suggestions</option>
                        {/* Ajoutez vos options ici */}
                    </select>
                </div>

                {/* Bouton pour réinitialiser les filtres */}
                <button
                    onClick={() => setActiveFilters({
                        operators: [],
                        warning: '',
                        filter3: '',
                        filter4: ''
                    })}
                    className="filters-button"
                >
                    <img src={BookmarkIcon} alt="Reset filters" style={{ width: "20px", height: "20px" }} />
                </button>
            </div>
        </div>
    );
}

export default Filters;

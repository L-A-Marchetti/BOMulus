import React from 'react';
import './Filters.css';
import BookmarkIcon from "./assets/images/bookmark.svg";
import WarningToolTip from './WarningToolTip';
import BookmarkToolTip from './BookmarkToolTip'; // Ajout
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg"; // Ajout

function Filters({ operators, operatorCounts, activeFilters, setActiveFilters, opColors, warningCounts, totalWarnings, pinnedComponents }) {
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

    const handlePinnedToggle = () => {
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            pinned: !prevFilters.pinned // Bascule le filtre pinned
        }));
    };

    return (
        <div className="filters">
            <div className="filters-grid">
                <div className="filter-item">
                    <div className="filter-item operator-buttons">
                        {operatorCounts && operatorCounts.map(({ operator, count }) => (
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
                                    <option value="outOfStock">
                                        Out of Stock: {warningCounts.outOfStock}
                                    </option>
                                    <option value="riskyLifecycle">
                                        Risky Lifecycle: {warningCounts.riskyLifecycle}
                                    </option>
                                    <option value="manufacturerMessages">
                                        Manufacturer Messages: {warningCounts.manufacturerMessages}
                                    </option>
                                    <option value="mismatchingMpn">
                                        Mismatching MPN: {warningCounts.mismatchingMpn}
                                    </option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className="filter-item">
                    <select
                        name="filter3"
                        value={activeFilters.filter3 || ""}
                        onChange={handleFilterChange}
                        className="filter-select-dropdown"
                    >
                        <option value="">> Functions</option>
                    </select>
                </div>

                <div className="filter-item">
                    <select
                        name="filter4"
                        value={activeFilters.filter4 || ""}
                        onChange={handleFilterChange}
                        className="filter-select-dropdown"
                    >
                        <option value="">> Suggestions</option>
                    </select>
                </div>



                <button
                    onClick={() => setActiveFilters(prevFilters => ({ ...prevFilters, pinned: !prevFilters.pinned }))}
                    className={`filters-button ${activeFilters.pinned ? 'active' : ''}`}
                    style={{ position: 'relative' }} // Ajouté
                >
                    <BookmarkToolTip totalBookmarks={pinnedComponents.length} />
                    <img
                        src={activeFilters.pinned ? BookmarkFilledIcon : BookmarkIcon}
                        alt="Toggle pinned filter"
                        style={{ width: "20px", height: "20px" }}
                    />
                </button>


            </div>
        </div>
    );
}

export default Filters;
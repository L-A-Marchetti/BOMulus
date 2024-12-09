import React from 'react';
import './Filters.css';
import BookmarkIcon from "./assets/images/bookmark.svg";
import WarningToolTip from './WarningToolTip';
import BookmarkToolTip from './BookmarkToolTip';
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg";

function Filters({ operators, operatorCounts, activeFilters, setActiveFilters, opColors, warningCounts, totalWarnings, pinnedComponents }) {
    const handleOperatorClick = (operator) => {
        setActiveFilters(prevFilters => {
            const isSelected = prevFilters.operators.includes(operator);
            const newOperators = isSelected
                ? prevFilters.operators.filter(op => op !== operator)
                : [...prevFilters.operators, operator];
            return { ...prevFilters, operators: newOperators };
        });
    };

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
            pinned: !prevFilters.pinned
        }));
    };

    return (
        <div className="filters">
            {/* Première ligne : opérateurs et warnings */}
            <div className="operator-buttons">
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

            <div className="dropdown-container warnings-select">
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

            {/* Bouton bookmark qui s'étend sur 2 rangées */}
            <button
                onClick={handlePinnedToggle}
                className={`filters-button ${activeFilters.pinned ? 'active' : ''}`}
            >
                <BookmarkToolTip totalBookmarks={pinnedComponents.length} />
                <img
                    src={activeFilters.pinned ? BookmarkFilledIcon : BookmarkIcon}
                    alt="Toggle pinned filter"
                    style={{ width: "20px", height: "20px" }}
                />
            </button>

            {/* Deuxième ligne : Functions et Suggestions */}
            <select
                name="filter3"
                value={activeFilters.filter3 || ""}
                onChange={handleFilterChange}
                className="filter-select-dropdown functions-select"
            >
                <option value="">> Functions</option>
            </select>

            <select
                name="filter4"
                value={activeFilters.filter4 || ""}
                onChange={handleFilterChange}
                className="filter-select-dropdown suggestions-select"
            >
                <option value="">> Suggestions</option>
            </select>
        </div>
    );
}

export default Filters;

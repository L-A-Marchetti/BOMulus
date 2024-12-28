import React, { useState, useEffect } from 'react';
import './Filters.css';
import BookmarkIcon from "./assets/images/bookmark.svg";
import WarningToolTip from './WarningToolTip';
import BookmarkToolTip from './BookmarkToolTip';
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg";
import Modal from './Modal';
import FunctionManager from './FunctionManager';
import SettingsIcon from "./assets/images/settings.svg";


function Filters({ operators, operatorCounts, activeFilters, setActiveFilters, opColors, warningCounts, totalWarnings, pinnedComponents, componentsAll, onRefreshComponents }) {

    const [showFunctionManagerModal, setShowFunctionManagerModal] = useState(false);


    const [designators, setDesignators] = useState([]);

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

    const [functions, setFunctions] = useState([]);

    const loadData = (components = componentsAll) => {
        console.log("Loading data for FunctionManager with components:", components);
        let allDesignators = [];
        for (const c of components) {
            if (c.designators && c.designators.length > 0) {
                allDesignators = allDesignators.concat(c.designators);
            }
        }

        setDesignators(allDesignators);

        const uniqueLabels = new Set();
        allDesignators.forEach(d => {
            if (d.label.name && d.label.name.trim() !== '') {
                uniqueLabels.add(d.label.name.trim());
            }
        });
        setFunctions(Array.from(uniqueLabels));
    };

    useEffect(() => {
        console.log("ComponentsAll updated in FunctionManager:", componentsAll);
        loadData();
    }, [componentsAll]);

    const handlePinnedToggle = () => {
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            pinned: !prevFilters.pinned
        }));
    };

    console.log("4. Updated Components:", componentsAll);

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
                        {console.log("OPERATOR COUNT :", operator, count)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                    name="filter3"
                    value={activeFilters.filter3 || ""}
                    onChange={handleFilterChange}
                    className="filter-select-dropdown functions-select"
                >
                    <option value="">> Functions</option>
                    >{functions.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}

                </select>

                {/* Bouton pour gérer les fonctions */}
                <button
                    onClick={() => setShowFunctionManagerModal(true)}
                    className={`settings-button`}
                >
                    <img style={{ width: '15px', height: '18px' }} src={SettingsIcon} alt="Settings Icon" />
                </button>
            </div>

            <select
                name="filter4"
                value={activeFilters.filter4 || ""}
                onChange={handleFilterChange}
                className="filter-select-dropdown suggestions-select"
            >
                <option value="">> Suggestions</option>
            </select>
            {showFunctionManagerModal && (
                <Modal onClose={() => setShowFunctionManagerModal(false)}>
                    <FunctionManager
                        onClose={() => setShowFunctionManagerModal(false)}
                        componentsAll={componentsAll}
                        onRefreshComponents={(updatedComponents) => {
                            console.log("Filters - Refreshing components with:", updatedComponents);
                            onRefreshComponents(updatedComponents); // Passe les nouveaux composants au parent
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Filters;

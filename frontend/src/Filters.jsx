import React, { useState, useEffect } from 'react';
import './Filters.css';
import BookmarkIcon from "./assets/images/bookmark.svg";
import WarningToolTip from './WarningToolTip';
import BookmarkToolTip from './BookmarkToolTip';
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg";
import Modal from './Modal';
import FunctionManager from './FunctionManager';
import SettingsIcon from "./assets/images/settings.svg";

function Filters({
    operators,
    operatorCounts,
    activeFilters,
    setActiveFilters,
    opColors,
    warningCounts,
    totalWarnings,
    pinnedComponents,
    componentsAll,
    onRefreshComponents
}) {

    const [showFunctionManagerModal, setShowFunctionManagerModal] = useState(false);

    // États internes
    const [designators, setDesignators] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [colorMap, setColorMap] = useState({});   // Map des couleurs

    // [ASTUCE: Couleur de la fonction sélectionnée]
    const [selectedFunctionColor, setSelectedFunctionColor] = useState('#ffffff');

    // ----------------------------------------------------------
    // Gestion des opérateurs
    // ----------------------------------------------------------
    const handleOperatorClick = (operator) => {
        setActiveFilters(prevFilters => {
            const isSelected = prevFilters.operators.includes(operator);
            const newOperators = isSelected
                ? prevFilters.operators.filter(op => op !== operator)
                : [...prevFilters.operators, operator];
            return { ...prevFilters, operators: newOperators };
        });
    };

    // ----------------------------------------------------------
    // Gestion des changements de filtres
    // ----------------------------------------------------------
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        // [ASTUCE: Si le filtre modifié est "functions", mettre à jour la couleur]
        if (name === 'filter3') {
            const newColor = colorMap[value] || '#ffffff';
            setSelectedFunctionColor(newColor);
        }

        setActiveFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // ----------------------------------------------------------
    // Chargement des fonctions et de leurs couleurs
    // ----------------------------------------------------------
    const loadData = (components = componentsAll) => {
        let allDesignators = [];
        for (const c of components) {
            if (c.designators && c.designators.length > 0) {
                allDesignators = [...allDesignators, ...c.designators];
            }
        }

        setDesignators(allDesignators);

        const uniqueLabels = new Set();
        const tempColorMap = {};
        allDesignators.forEach(d => {
            if (d.label?.name && d.label.name.trim() !== '') {
                const fName = d.label.name.trim();
                uniqueLabels.add(fName);
                tempColorMap[fName] = d.label.color || '#000000';
            }
        });

        setFunctions(Array.from(uniqueLabels));
        setColorMap(tempColorMap);
    };

    useEffect(() => {
        loadData();
    }, [componentsAll]);

    // ----------------------------------------------------------
    // Gestion du filtre "pinned"
    // ----------------------------------------------------------
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
                            <option value="moq">MOQ: {warningCounts.moq}</option>
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <select
                    name="filter3"
                    value={activeFilters.filter3 || ""}
                    onChange={handleFilterChange}
                    className="filter-select-dropdown functions-select"
                    // [ASTUCE: Appliquer la couleur dynamiquement uniquement ici]
                    style={{ color: activeFilters.filter3 ? colorMap[activeFilters.filter3] || '#ffffff' : '#ffffff' }}
                >
                    <option value="">> Functions</option>
                    {functions.map(f => {
                        const color = colorMap[f] || '#ffffff';
                        return (
                            <option
                                key={f}
                                value={f}
                                style={{ color }} // Couleur inline dans la liste déroulante
                            >
                                {/* Carré coloré suivi du nom */}
                                ■ {f}
                            </option>
                        );
                    })}
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
                            onRefreshComponents(updatedComponents);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Filters;

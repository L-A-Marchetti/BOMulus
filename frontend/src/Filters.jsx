import React, { useState, useEffect, useRef } from 'react';
import './Filters.css';

import BookmarkIcon from "./assets/images/bookmark.svg";
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg";
import WarningToolTip from './WarningToolTip';
import BookmarkToolTip from './BookmarkToolTip';
import Modal from './Modal';
import FunctionManager from './FunctionManager';
import SettingsIcon from "./assets/images/settings.svg";

import MismatchmpnIcon from "./assets/images/mismatchingmpn.svg";
import ManmessageIcon from "./assets/images/manmessage.svg";
import OutofstockIcon from "./assets/images/outofstock.svg";
import LifecycleIcon from "./assets/images/lifecycle.svg";
import MoqIcon from "./assets/images/moq.svg";

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
    const [colorMap, setColorMap] = useState({}); // Map des couleurs (functionName -> hexColor)

    // Couleur de la fonction sélectionnée (optionnel, si besoin d’afficher dans un style)
    const [selectedFunctionColor, setSelectedFunctionColor] = useState('#ffffff');

    // ----------------------------------------------------------------
    //  Dropdown custom pour Warnings (EXISTANT)
    // ----------------------------------------------------------------
    const [isWarningDropdownOpen, setIsWarningDropdownOpen] = useState(false);
    const warningDropdownRef = useRef(null);

    // Options avec les logos, ajout de l'option "Aucun filtre"
    const warningOptions = [
        {
            value: "",
            label: "No filters",
            icon: null,
            count: totalWarnings
        },
        {
            value: "outOfStock",
            label: "Out of Stock",
            icon: OutofstockIcon,
            count: warningCounts.outOfStock
        },
        {
            value: "riskyLifecycle",
            label: "Risky Lifecycle",
            icon: LifecycleIcon,
            count: warningCounts.riskyLifecycle
        },
        {
            value: "manufacturerMessages",
            label: "Manufacturer Messages",
            icon: ManmessageIcon,
            count: warningCounts.manufacturerMessages
        },
        {
            value: "mismatchingMpn",
            label: "Mismatching MPN",
            icon: MismatchmpnIcon,
            count: warningCounts.mismatchingMpn
        },
        {
            value: "moq",
            label: "MOQ",
            icon: MoqIcon,
            count: warningCounts.moq
        }
    ];

    // ----------------------------------------------------------------
    //  Dropdown custom pour Functions
    // ----------------------------------------------------------------
    const [isFunctionsDropdownOpen, setIsFunctionsDropdownOpen] = useState(false);
    const functionsDropdownRef = useRef(null);

    // ----------------------------------------------------------------
    //  Dropdown custom pour Suggestions
    // ----------------------------------------------------------------
    const [isSuggestionsDropdownOpen, setIsSuggestionsDropdownOpen] = useState(false);
    const suggestionsDropdownRef = useRef(null);

    // ----------------------------------------------------------------
    //  useEffect qui ferme tous les dropdowns au clic à l'extérieur
    // ----------------------------------------------------------------
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Warnings
            if (warningDropdownRef.current && !warningDropdownRef.current.contains(event.target)) {
                setIsWarningDropdownOpen(false);
            }
            // Functions
            if (functionsDropdownRef.current && !functionsDropdownRef.current.contains(event.target)) {
                setIsFunctionsDropdownOpen(false);
            }
            // Suggestions
            if (suggestionsDropdownRef.current && !suggestionsDropdownRef.current.contains(event.target)) {
                setIsSuggestionsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ----------------------------------------------------------------
    //  Sélection d'une option dans "Warnings"
    // ----------------------------------------------------------------
    const handleWarningSelect = (option) => {
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            warning: option.value
        }));
        setIsWarningDropdownOpen(false);
    };

    // Bouton toggle du dropdown "Warnings"
    const handleWarningDropdownButtonClick = () => {
        setIsWarningDropdownOpen(prevState => !prevState);
    };

    // ----------------------------------------------------------------
    //  Sélection d'un opérateur
    // ----------------------------------------------------------------
    const handleOperatorClick = (operator) => {
        setActiveFilters(prevFilters => {
            const isSelected = prevFilters.operators.includes(operator);
            const newOperators = isSelected
                ? prevFilters.operators.filter(op => op !== operator)
                : [...prevFilters.operators, operator];
            return { ...prevFilters, operators: newOperators };
        });
    };

    // ----------------------------------------------------------------
    //  Sélection "Functions" (ancien filter3)
    // ----------------------------------------------------------------
    const handleFunctionsDropdownButtonClick = () => {
        setIsFunctionsDropdownOpen(prevState => !prevState);
    };

    const handleFunctionSelect = (f) => {
        // Met à jour le filter3
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            filter3: f
        }));
        // Met à jour la couleur
        setSelectedFunctionColor(colorMap[f] || '#ffffff');
        setIsFunctionsDropdownOpen(false);
    };

    // ----------------------------------------------------------------
    //  Sélection "Suggestions" (ancien filter4)
    // ----------------------------------------------------------------
    const handleSuggestionsDropdownButtonClick = () => {
        setIsSuggestionsDropdownOpen(prevState => !prevState);
    };

    const handleSuggestionSelect = (value) => {
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            filter4: value
        }));
        setIsSuggestionsDropdownOpen(false);
    };

    // ----------------------------------------------------------------
    //  Chargement des fonctions et de leurs couleurs
    // ----------------------------------------------------------------
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

    // ----------------------------------------------------------------
    //  Gestion du filtre "pinned"
    // ----------------------------------------------------------------
    const handlePinnedToggle = () => {
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            pinned: !prevFilters.pinned
        }));
    };

    // ----------------------------------------------------------------
    //  Rendu du composant
    // ----------------------------------------------------------------
    return (
        <div className="filters">
            {/* =================================================== */}
            {/*   1ère ligne : opérateurs et dropdown Warnings     */}
            {/* =================================================== */}
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

            {/* Dropdown "Warnings" */}
            <div className="dropdown-container warnings-select" ref={warningDropdownRef}>
                <WarningToolTip totalWarnings={totalWarnings} />
                <div className="custom-select">
                    <button
                        className="custom-select-button"
                        onClick={handleWarningDropdownButtonClick}
                    >
                        <span className="arrow">{isWarningDropdownOpen ? '▲' : '▼'}</span>
                        {activeFilters.warning ? (
                            warningOptions.find(option => option.value === activeFilters.warning)?.icon ? (
                                <>
                                    <img
                                        src={
                                            warningOptions.find(opt => opt.value === activeFilters.warning)?.icon
                                        }
                                        alt={
                                            warningOptions.find(opt => opt.value === activeFilters.warning)?.label
                                        }
                                        className="option-icon"
                                    />
                                    {warningOptions.find(opt => opt.value === activeFilters.warning)?.label}
                                </>
                            ) : (
                                "Aucun filtre"
                            )
                        ) : (
                            "Warnings"
                        )}
                    </button>

                    {isWarningDropdownOpen && (
                        <ul className="custom-select-options">
                            {warningOptions.map(option => (
                                <li
                                    key={option.value}
                                    className={`custom-select-option ${activeFilters.warning === option.value ? 'selected' : ''
                                        }`}
                                    onClick={() => handleWarningSelect(option)}
                                >
                                    {option.icon && (
                                        <img
                                            src={option.icon}
                                            alt={option.label}
                                            className="option-icon"
                                        />
                                    )}
                                    {option.label} {option.value && `(${option.count})`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Bouton bookmark qui s'étend sur deux rangées (grid-row: 1/3) */}
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

            {/* =================================================== */}
            {/*   2ème ligne : Dropdown "Functions" + Settings     */}
            {/* =================================================== */}
            <div
                className="dropdown-container functions-select"
                ref={functionsDropdownRef}
                style={{ display: 'flex', alignItems: 'center' }}
            >
                {/* Dropdown custom "Functions" */}
                <div className="custom-select">
                    <button
                        className="custom-select-button"
                        onClick={handleFunctionsDropdownButtonClick}
                        style={{
                            color: activeFilters.filter3
                                ? colorMap[activeFilters.filter3] || '#ffffff'
                                : '#ffffff'
                        }}
                    >
                        <span className="arrow">{isFunctionsDropdownOpen ? '▲' : '▼'}</span>
                        {activeFilters.filter3 || 'Functions'}
                    </button>

                    {isFunctionsDropdownOpen && (
                        <ul className="custom-select-options">
                            {/* Option pour "Aucune fonction" */}
                            <li
                                key=""
                                className={`custom-select-option ${!activeFilters.filter3 ? 'selected' : ''}`}
                                onClick={() => handleFunctionSelect("")}
                                style={{ color: '#ffffff' }}
                            >
                                No filters
                            </li>

                            {/* Les fonctions dynamiques */}
                            {functions.map(f => {
                                const color = colorMap[f] || '#ffffff';
                                return (
                                    <li
                                        key={f}
                                        className={`custom-select-option ${activeFilters.filter3 === f ? 'selected' : ''
                                            }`}
                                        onClick={() => handleFunctionSelect(f)}
                                        style={{ color }}
                                    >
                                        {/* Petit carré + nom */}
                                        ■ {f}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Bouton Settings à côté */}
                <button
                    onClick={() => setShowFunctionManagerModal(true)}
                    className="settings-button"
                    style={{ marginLeft: '4px' }}
                >
                    <img
                        style={{ width: '15px', height: '18px' }}
                        src={SettingsIcon}
                        alt="Settings Icon"
                    />
                </button>
            </div>

            {/* =================================================== */}
            {/*   2ème ligne : Dropdown "Suggestions"              */}
            {/* =================================================== */}
            <div
                className="dropdown-container suggestions-select"
                ref={suggestionsDropdownRef}
            >
                <div className="custom-select">
                    <button
                        className="custom-select-button"
                        onClick={handleSuggestionsDropdownButtonClick}
                    >
                        <span className="arrow">{isSuggestionsDropdownOpen ? '▲' : '▼'}</span>
                        {activeFilters.filter4 || 'Suggestions'}
                    </button>

                    {isSuggestionsDropdownOpen && (
                        <ul className="custom-select-options">
                            {/* Exemple d'option "Aucune suggestion" */}
                            <li
                                key=""
                                className={`custom-select-option ${!activeFilters.filter4 ? 'selected' : ''}`}
                                onClick={() => handleSuggestionSelect("")}
                            >
                                Aucune suggestion
                            </li>

                            {/* Exemple d'options possibles (à adapter) */}
                            <li
                                key="improveSomething"
                                className={`custom-select-option ${activeFilters.filter4 === "improveSomething" ? 'selected' : ''
                                    }`}
                                onClick={() => handleSuggestionSelect("improveSomething")}
                            >
                                Improve Something
                            </li>

                            <li
                                key="checkAnotherThing"
                                className={`custom-select-option ${activeFilters.filter4 === "checkAnotherThing" ? 'selected' : ''
                                    }`}
                                onClick={() => handleSuggestionSelect("checkAnotherThing")}
                            >
                                Check Another Thing
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            {/* --------------------------------------------------- */}
            {/*   Modal pour FunctionManager                       */}
            {/* --------------------------------------------------- */}
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

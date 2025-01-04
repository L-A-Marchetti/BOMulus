import React, { useState, useEffect, useRef } from 'react';
import './Filters.css';
import BookmarkIcon from "./assets/images/bookmark.svg";
import WarningToolTip from './WarningToolTip';
import BookmarkToolTip from './BookmarkToolTip';
import BookmarkFilledIcon from "./assets/images/bookmark_filled.svg";
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
    const [colorMap, setColorMap] = useState({});   // Map des couleurs

    // [ASTUCE: Couleur de la fonction sélectionnée]
    const [selectedFunctionColor, setSelectedFunctionColor] = useState('#ffffff');

    // Nouvel état pour gérer l'ouverture du dropdown des warnings
    const [isWarningDropdownOpen, setIsWarningDropdownOpen] = useState(false);

    // Référence pour détecter les clics en dehors du dropdown
    const warningDropdownRef = useRef(null);

    // Options avec les logos, ajout de l'option "Aucun filtre"
    const warningOptions = [
        {
            value: "",
            label: "No filters",
            icon: null, // Pas d'icône pour cette option
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

    // Fonction pour gérer les clics en dehors du dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (warningDropdownRef.current && !warningDropdownRef.current.contains(event.target)) {
                setIsWarningDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fonction pour gérer la sélection d'une option
    const handleWarningSelect = (option) => {
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            warning: option.value
        }));
        setIsWarningDropdownOpen(false);
    };

    // Fonction pour gérer le clic sur le bouton de la liste déroulante
    const handleDropdownButtonClick = () => {
        setIsWarningDropdownOpen(prevState => !prevState);
    };

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

            <div className="dropdown-container warnings-select" ref={warningDropdownRef}>
                <WarningToolTip totalWarnings={totalWarnings} />
                <div className="custom-select">
                    <button
                        className="custom-select-button"
                        onClick={handleDropdownButtonClick}
                    >
                        {activeFilters.warning ? (
                            warningOptions.find(option => option.value === activeFilters.warning)?.icon ? (
                                <>
                                    <img
                                        src={warningOptions.find(option => option.value === activeFilters.warning)?.icon}
                                        alt={warningOptions.find(option => option.value === activeFilters.warning)?.label}
                                        className="option-icon"
                                    />
                                    {warningOptions.find(option => option.value === activeFilters.warning)?.label}
                                </>
                            ) : (
                                "Aucun filtre"
                            )
                        ) : (
                            "> Warnings"
                        )}
                        <span className="arrow">{isWarningDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    {isWarningDropdownOpen && (
                        <ul className="custom-select-options">
                            {warningOptions.map(option => (
                                <li
                                    key={option.value}
                                    className={`custom-select-option ${activeFilters.warning === option.value ? 'selected' : ''}`}
                                    onClick={() => handleWarningSelect(option)}
                                >
                                    {option.icon && <img src={option.icon} alt={option.label} className="option-icon" />}
                                    {option.label} {option.value && `(${option.count})`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Bouton bookmark qui s'étend sur deux rangées */}
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

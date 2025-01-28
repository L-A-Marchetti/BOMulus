// TopMenu.jsx

import React, { useState, useEffect, useRef } from 'react';
import './TopMenu.css';
import FileManager from './FileManager';
import AnalyzeButton from './AnalyzeButton';
import Filters from './Filters';
import Stats from './Stats';
import GlassIcon from './assets/images/glass.svg';
import SortIcon from './assets/images/sort.svg';

import {
    PriceCalculator,
    GetProductionQuantity,
    SetProductionQuantity,
} from '../wailsjs/go/main/App';

function TopMenu({
    onRefreshComponents,
    onComponentAnalyzed,
    operators,
    operatorCounts,
    activeFilters,
    setActiveFilters,
    opColors,
    warningCounts,
    totalWarnings,
    onCompare,
    pinnedComponents,
    statsData,
    componentsAll,
    sortOrder,
    setSortOrder,
}) {
    const [initialized, setInitialized] = useState(false);
    const [calculationResult, setCalculationResult] = useState(null);

    // IMPORTANT: on stocke toujours un **nombre** dans boards
    const [boards, setBoards] = useState(1);

    const [pricePerBoard, setPricePerBoard] = useState(0);
    const [orderPrice, setOrderPrice] = useState(0);

    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Savoir si l'analyse est en cours (pour désactiver Boards)
    const [analysisRunning, setAnalysisRunning] = useState(false);

    // Compteur de composants analysés pour le throttling
    const analyzedCountRef = useRef(0);

    // ----------------------------------------------------------------
    // 1) Initialisation du nombre de boards + calcul initial
    // ----------------------------------------------------------------
    useEffect(() => {
        if (!initialized && componentsAll && componentsAll.length > 0) {
            const initializePrices = async () => {
                try {
                    const quantityFromBackend = await GetProductionQuantity();
                    let initialQuantity = quantityFromBackend
                        ? parseInt(quantityFromBackend, 10)
                        : 1;

                    // Si parseInt a échoué ou si c'est 0/négatif, on met 1
                    if (isNaN(initialQuantity) || initialQuantity <= 0) {
                        initialQuantity = 1;
                    }

                    setBoards(initialQuantity);

                    if (initialQuantity > 0) {
                        await calculatePrices(initialQuantity);
                    }

                    setInitialized(true);
                } catch (error) {
                    console.error("Error initializing prices:", error);
                }
            };

            initializePrices();
        }
    }, [componentsAll, initialized]);

    // ----------------------------------------------------------------
    // 2) Fonction principale de calcul des prix
    // ----------------------------------------------------------------
    const calculatePrices = async (numBoards) => {
        try {
            await SetProductionQuantity(numBoards.toString());
            const result = await PriceCalculator(numBoards);

            if (result) {
                setOrderPrice(result.orderPrice);
                setPricePerBoard(result.unitPrice);
                setCalculationResult(result);
            }

            // Maintenant qu'on a recalculé, on relit la liste des composants
            // via le callback reçu en props :
            if (onRefreshComponents) {
                // onRefreshComponents fera lui-même un "GetComponents()" côté parent.
                onRefreshComponents();
            }

        } catch (err) {
            console.error("Error calculating prices:", err);
            setError('An error occurred while calculating the price');
            setPricePerBoard(0);
            setOrderPrice(0);
            setCalculationResult(null);
        }
    };

    // ----------------------------------------------------------------
    // 3) Callback appelé à CHAQUE composant analysé (throttling)
    // ----------------------------------------------------------------
    const handleAnalyzedDuringAnalysis = (lastAnalyzedComponent) => {
        // Incrémente le compteur
        analyzedCountRef.current += 1;

        // Recalcule tous les 10 composants
        if (analyzedCountRef.current % 10 === 0) {
            calculatePrices(boards);
        }

        // Callback parent éventuel
        if (onComponentAnalyzed) {
            onComponentAnalyzed(lastAnalyzedComponent);
        }
    };

    // ----------------------------------------------------------------
    // 4) À la fin de l’analyse, on fait un dernier calcul
    // ----------------------------------------------------------------
    const handleAnalysisCompleted = () => {
        // Attendre 500 ms pour laisser le backend finir d'écrire
        setTimeout(() => {
            calculatePrices(boards);
            analyzedCountRef.current = 0;
        }, 500);
    };

    // ----------------------------------------------------------------
    // 5) Quand on modifie "Boards" (stockage en number)
    // ----------------------------------------------------------------
    const handleBoardsChange = async (e) => {
        const rawValue = e.target.value;

        // On autorise la saisie vide pour "0"
        if (rawValue === '') {
            setBoards(0);
            return;
        }

        // Vérifie que c'est bien des chiffres
        if (/^[0-9]+$/.test(rawValue)) {
            const numBoards = parseInt(rawValue, 10);
            // Si c'est 0 ou plus
            if (numBoards >= 0) {
                setBoards(numBoards); // <-- on stocke un nombre (pas une string)

                // Et si c'est > 0, on recalcule direct
                if (numBoards > 0) {
                    try {
                        await calculatePrices(numBoards);
                    } catch (err) {
                        console.error("Error calculating prices:", err);
                        setError('An error occurred while calculating the price');
                    }
                } else {
                    // numBoards === 0 => pas de recalcul ?
                    // Vous pourriez décider d'accepter ou afficher un warning
                    setError('');
                }
            }
        }
    };


    // ----------------------------------------------------------------
    // 6) Formatage + tri
    // ----------------------------------------------------------------
    const formatPrice = (price) => `$${price.toFixed(2)}`;

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleAnalysisStatusChange = (newStatus) => {
        setAnalysisRunning(newStatus === 'running');
    };

    // ----------------------------------------------------------------
    // 7) RENDER
    // ----------------------------------------------------------------
    return (
        <div className="top-menu">

            {/* --- ROW 1 --- */}
            <div className="first-row">
                <div className="left-side">
                    <h4 className="section-title">File manager</h4>
                    {onCompare && <FileManager onCompare={onCompare} />}
                </div>

                <div className="middle-side">
                    <h4 className="section-title">Analysis</h4>
                    <div className="analyze-and-price">

                        <AnalyzeButton
                            onComponentAnalyzed={handleAnalyzedDuringAnalysis}
                            onAnalysisCompleted={handleAnalysisCompleted}
                            onStatusChange={handleAnalysisStatusChange}
                        />

                        <div className="price-editor-container">
                            <div className="boards-control">
                                <label className="price-label" htmlFor="boards-input">
                                    Boards
                                </label>

                                <input
                                    id="boards-input"
                                    type="text"
                                    // Conversion du nombre en string pour l'affichage
                                    value={boards === 0 ? '' : String(boards)}
                                    onChange={handleBoardsChange}
                                    disabled={analysisRunning}
                                />

                                {error && (
                                    <p style={{ color: 'red', margin: 0 }}>{error}</p>
                                )}
                            </div>

                            <div className="price-info-container">
                                <div className="price-per-board">
                                    <label className="price-label">Price per Board</label>
                                    <span className="price-value">
                                        {formatPrice(pricePerBoard)}
                                    </span>
                                </div>
                                <div className="order-price">
                                    <label className="price-label">Order Price</label>
                                    <span className="price-value">
                                        {formatPrice(orderPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="filters-container">
                    <h4 className="section-title" style={{ textAlign: 'left' }}>
                        Filters
                    </h4>
                    <Filters
                        onRefreshComponents={onRefreshComponents}
                        operators={operators}
                        operatorCounts={operatorCounts}
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        opColors={opColors}
                        warningCounts={warningCounts}
                        totalWarnings={totalWarnings}
                        pinnedComponents={pinnedComponents}
                        componentsAll={componentsAll}
                    />
                </div>
            </div>

            {/* --- ROW 2 : Stats --- */}
            <div className="second-row">
                <Stats
                    statsData={statsData}
                    componentsAll={componentsAll}
                    calculationResult={calculationResult}
                    boards={boards}
                />
            </div>

            {/* --- ROW 3 : Search + Sort --- */}
            <div className="third-row">
                <h4 className="section-title">Search</h4>
                <div className="search-and-sort-container">
                    <div className="search-bar-container">
                        <img src={GlassIcon} alt="Search" className="search-icon" />
                        <input
                            size={30}
                            type="text"
                            className="search-bar"
                            placeholder="MPN | DESIGNATOR | DESCRIPTION"
                            value={activeFilters.searchQuery || ''}
                            onChange={(e) =>
                                setActiveFilters((prevFilters) => ({
                                    ...prevFilters,
                                    searchQuery: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="sort-container">
                        <img src={SortIcon} alt="Sort" className="sort-icon" />
                        <select
                            className="sort-select"
                            value={sortOrder}
                            onChange={handleSortChange}
                        >
                            <option value="">> Sort By</option>
                            <option value="price-unit-asc">Unit Price: Low to High</option>
                            <option value="price-unit-desc">Unit Price: High to Low</option>
                            <option value="price-asc">Total Price: Low to High</option>
                            <option value="price-desc">Total Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TopMenu;

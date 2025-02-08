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
    GetComponents
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

    // 1) boards = la valeur numérique finale (ex: 12)
    // 2) boardsInput = la chaîne de caractères affichée dans l’input (ex: "12")
    const [boards, setBoards] = useState(1);
    const [boardsInput, setBoardsInput] = useState("1");

    const [pricePerBoard, setPricePerBoard] = useState(0);
    const [orderPrice, setOrderPrice] = useState(0);

    const [error, setError] = useState('');

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
                    setBoardsInput(String(initialQuantity)); // On synchronise l'affichage

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

            // On rafraîchit la liste des composants :
            if (onRefreshComponents) {
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
        analyzedCountRef.current += 1;

        /* Recalcule tous les 10 composants
        if (analyzedCountRef.current % 10 === 0) {
            calculatePrices(boards);
        }
            */

        // Callback parent éventuel
        if (onComponentAnalyzed) {
            onComponentAnalyzed(lastAnalyzedComponent);
        }
    };

    // ----------------------------------------------------------------
    // 4) À la fin de l’analyse, on fait un dernier calcul
    // ----------------------------------------------------------------
    const handleAnalysisCompleted = () => {
        // Attendre un peu pour laisser le backend finir d'écrire
        setTimeout(() => {
            calculatePrices(boards);
            analyzedCountRef.current = 0;
        }, 3000);
    };

    // ----------------------------------------------------------------
    // 5) Gestion de l'input "Boards"
    // ----------------------------------------------------------------

    // A) On met à jour l'affichage dès que l'utilisateur tape
    const handleBoardsInputChange = (e) => {
        setBoardsInput(e.target.value);
    };

    // B) On déclenche le parse + le calcul après un délai (debounce-like)
    useEffect(() => {
        const delay = setTimeout(async () => {
            // On parse la chaîne
            const parsed = parseInt(boardsInput, 10);
            // Nombre valide (>0) ou 0
            const newBoards = isNaN(parsed) || parsed < 0 ? 0 : parsed;

            // Mise à jour du state "boards" effectif
            setBoards(newBoards);

            // Si > 0, on calcule
            if (newBoards > 0) {
                try {
                    await calculatePrices(newBoards);
                    const updatedComponents = await GetComponents();
                    onComponentAnalyzed(updatedComponents);
                } catch (err) {
                    console.error("Error calculating prices:", err);
                    setError('An error occurred while calculating the price');
                }
            } else {
                // Si c'est 0 ou vide, on considère qu'il n'y a rien à calculer
                setError('');
                setPricePerBoard(0);
                setOrderPrice(0);
            }
        }, 300);

        return () => clearTimeout(delay);

    }, [boardsInput]);

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
                                    value={boardsInput}
                                    onChange={handleBoardsInputChange}
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

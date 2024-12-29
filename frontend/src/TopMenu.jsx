import React, { useState, useEffect } from 'react';
import './TopMenu.css';
import FileManager from './FileManager';
import AnalyzeButton from './AnalyzeButton';
import Filters from './Filters';
import Stats from './Stats';

// Import des fonctions Wails côté backend
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
    functionsList,
}) {
    console.log("3. Updated Components:", componentsAll);

    // -- ÉTATS --  
    // Nombre de boards (initialisé depuis le backend)
    const [boards, setBoards] = useState(1);

    // Prix unitaire et total (en dollars), récupérés après calcul
    const [pricePerBoard, setPricePerBoard] = useState(0);
    const [orderPrice, setOrderPrice] = useState(0);

    // Message d’erreur éventuel (ex: saisie invalide)
    const [error, setError] = useState('');

    // --------------------------------------------------------------------------
    // 1. Charger la quantité (boards) existante depuis le backend au montage
    // --------------------------------------------------------------------------
    useEffect(() => {
        loadProductionQuantity();
    }, []);

    const loadProductionQuantity = async () => {
        try {
            const quantityFromBackend = await GetProductionQuantity(); // ex: "10"
            if (quantityFromBackend) {
                // on parse en nombre
                const q = parseInt(quantityFromBackend, 10);
                setBoards(q > 0 ? q : 1);
                // Puis on fait un calcul initial
                calculatePrices(q);
            }
        } catch (error) {
            console.error("Error loading production quantity:", error);
        }
    };

    // --------------------------------------------------------------------------
    // 2. Chaque fois que l’utilisateur modifie 'boards', on recalcule les prix
    // --------------------------------------------------------------------------
    const handleBoardsChange = async (e) => {
        const value = e.target.value;
        // On autorise seulement les chiffres ou le champ vide
        if (value === '' || /^[0-9]+$/.test(value)) {
            setBoards(value);
            setError('');

            // Si le champ est vide, on peut stopper ici (pas de calcul)
            if (value === '') {
                setPricePerBoard(0);
                setOrderPrice(0);
                return;
            }
            // Sinon, on parse et on fait le calcul
            const numBoards = parseInt(value, 10);
            if (numBoards > 0) {
                calculatePrices(numBoards);
            } else {
                setError('Please enter a valid positive number');
                setPricePerBoard(0);
                setOrderPrice(0);
            }
        }
        onComponentAnalyzed();
    };

    // --------------------------------------------------------------------------
    // 3. Calcul des prix (ordre total & prix unitaire) via backend Wails
    // --------------------------------------------------------------------------
    const calculatePrices = async (numBoards) => {
        try {
            // On enregistre côté backend
            await SetProductionQuantity(numBoards.toString());

            // On appelle la fonction de calcul côté backend
            const result = await PriceCalculator(numBoards);
            // Par exemple, on récupère 'result.orderPrice' et 'result.unitPrice'
            if (result) {
                setOrderPrice(result.orderPrice);
                setPricePerBoard(result.unitPrice);
            }
        } catch (err) {
            console.error("Error calculating price:", err);
            setError('An error occurred while calculating the price');
            setPricePerBoard(0);
            setOrderPrice(0);
        }
    };

    // --------------------------------------------------------------------------
    // 4. Format d’affichage (toujours en dollars)
    // --------------------------------------------------------------------------
    const formatPrice = (price) => {
        return `$${price.toFixed(2)}`;
    };

    // --------------------------------------------------------------------------
    // COMPOSANT RENDU
    // --------------------------------------------------------------------------
    return (
        <div className="top-menu">
            {/* ===================== Première ligne (inchangée) ===================== */}
            <div className="top-row">
                <div className="left-side">
                    <h4 className="section-title">File manager</h4>
                    {onCompare && <FileManager onCompare={onCompare} />}
                </div>

                <div className="middle-side">
                    <h4 className="section-title">Analysis</h4>
                    <div className="analyze-and-price">
                        <AnalyzeButton onComponentAnalyzed={onComponentAnalyzed} />
                        <div className="price-editor-container">
                            <div className="boards-control">
                                <label className="price-label" htmlFor="boards-input">
                                    Boards
                                </label>
                                <input
                                    id="boards-input"
                                    type="text"
                                    value={boards}
                                    onChange={handleBoardsChange}
                                />
                                {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
                            </div>
                            <div className="price-info-container">
                                <div className="price-per-board">
                                    <label className="price-label">Price per Board</label>
                                    <span className="price-value">{formatPrice(pricePerBoard)}</span>
                                </div>
                                <div className="order-price">
                                    <label className="price-label">Order Price</label>
                                    <span className="price-value">{formatPrice(orderPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="filters-container">
                    <h4 className="section-title" style={{ textAlign: 'left' }}>Filters</h4>
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

            {/* ===================== Deuxième ligne (boards + prix + Stats) ===================== */}
            <div className="bottom-row">


                {/* Les Stats préexistantes */}
                <Stats
                    statsData={statsData}
                    componentsAll={componentsAll}
                />
            </div>
        </div>
    );
}

export default TopMenu;

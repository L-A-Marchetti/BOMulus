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
    // État pour indiquer si l'initialisation est terminée
    const [initialized, setInitialized] = useState(false);

    const [calculationResult, setCalculationResult] = useState(null);


    // Nombre de boards (initialisé depuis le backend)
    const [boards, setBoards] = useState(1);

    // Prix unitaire et total (en dollars), récupérés après calcul
    const [pricePerBoard, setPricePerBoard] = useState(0);
    const [orderPrice, setOrderPrice] = useState(0);

    // Message d’erreur éventuel (ex: saisie invalide)
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialisation des prix uniquement si `componentsAll` est chargé
        if (!initialized && componentsAll && componentsAll.length > 0) {
            const initializePrices = async () => {
                try {
                    const quantityFromBackend = await GetProductionQuantity();
                    const initialQuantity = quantityFromBackend
                        ? parseInt(quantityFromBackend, 10)
                        : 1; // Utilise 1 par défaut

                    if (boards !== initialQuantity) {
                        setBoards(initialQuantity);
                    }

                    if (initialQuantity > 0) {
                        await calculatePrices(initialQuantity);
                    }

                    setInitialized(true); // Marque comme initialisé
                } catch (error) {
                    console.error("Error initializing prices:", error);
                }
            };

            initializePrices();
        }
    }, [componentsAll, initialized]); // Dépend uniquement de componentsAll et de l'état initialized

    const handleBoardsChange = async (e) => {
        const value = e.target.value;

        if (value === '' || /^[0-9]+$/.test(value)) {
            const numBoards = parseInt(value, 10);

            setBoards(value); // Met à jour l'état local du nombre de boards
            setError('');

            if (!isNaN(numBoards) && numBoards > 0) {
                try {
                    await calculatePrices(numBoards);
                } catch (err) {
                    console.error("Error calculating prices:", err);
                    setError('An error occurred while calculating the price');
                }
            }
        }
    };

    const calculatePrices = async (numBoards) => {
        try {
            await SetProductionQuantity(numBoards.toString());

            const result = await PriceCalculator(numBoards);

            if (result) {
                setOrderPrice(result.orderPrice);
                setPricePerBoard(result.unitPrice);
                setCalculationResult(result);
            }
        } catch (err) {
            console.error("Error calculating prices:", err);
            setError('An error occurred while calculating the price');
            setPricePerBoard(0);
            setOrderPrice(0);
            setCalculationResult(null);
        }

        onComponentAnalyzed();
    };

    const formatPrice = (price) => `$${price.toFixed(2)}`;

    return (
        <div className="top-menu">
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

            <div className="bottom-row">
                <Stats statsData={statsData} componentsAll={componentsAll} calculationResult={calculationResult} boards={boards} />
            </div>
        </div>
    );
}

export default TopMenu;

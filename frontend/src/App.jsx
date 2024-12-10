import React, { useState, useEffect } from 'react';
import './App.css';
import CompareView from './CompareView';
import TopBar from './TopBar';
import WorkspaceCreator from './WorkspaceCreator';
import { MaximizeWindow, GetComponents, GetActiveWorkspace, StopAnalysis, GetSavedAPIKeys, GetAnalyzeSaveState, GetAnalysisRefreshDays } from "../wailsjs/go/main/App";
import Button from './Button';
import TopMenu from './TopMenu';
import Modal from './Modal';
import PricingCalculator from './PricingCalculator';
import Settings from './Settings';

const OPERATORS = ["INSERT", "UPDATE", "DELETE", "EQUAL"];
const OP_COLORS = {
    INSERT: '#86b384',
    UPDATE: '#8e84b3',
    DELETE: '#cc7481',
    EQUAL: '#636363',
};

function App() {
    const [showCompareView, setShowCompareView] = useState(false);
    const [compareKey, setCompareKey] = useState(0);
    const [components, setComponents] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [pinnedComponents, setPinnedComponents] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        operators: [],
        warning: '',
        filter3: '',
        filter4: '',
        pinned: false,
    });

    // Ajout des states pour stocker les clés API et paramètres
    const [mouserApiKey, setMouserApiKey] = useState('');
    const [bomulusApiKey, setBomulusApiKey] = useState('');
    const [analyzeSaveState, setAnalyzeSaveStateState] = useState(false);
    const [analysisRefreshDays, setAnalysisRefreshDays] = useState(0);

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    useEffect(() => {
        if (showCompareView) {
            (async () => {
                try {
                    const workspace = await GetActiveWorkspace();
                    setActiveWorkspace(workspace);
                    // Charger les clés et paramètres dès que la CompareView est affichée
                    await loadInitialSettings();
                } catch (error) {
                    console.error("Error fetching active workspace:", error);
                }
            })();
        } else {
            setActiveWorkspace(null);
        }
    }, [showCompareView]);

    // Cette fonction charge les clés et paramètres sans attendre l'ouverture du modal
    const loadInitialSettings = async () => {
        try {
            const savedKeys = await GetSavedAPIKeys();
            setMouserApiKey(savedKeys.mouser_api_key || '');
            setBomulusApiKey(savedKeys.bomulus_api_key || '');

            const state = await GetAnalyzeSaveState();
            setAnalyzeSaveStateState(state);

            const days = await GetAnalysisRefreshDays();
            setAnalysisRefreshDays(days);

            console.log("API keys, analyze state and refresh days loaded.");
        } catch (error) {
            console.error("Error loading initial settings:", error);
        }
    };

    const handleComponentAnalyzed = async (updatedComponent) => {
        console.log("handleComponentAnalyzed - Updated Component:", updatedComponent);
        try {
            const updatedComponents = await GetComponents();
            console.log("1. Updated Components:", componentsAll);
            setComponents(updatedComponents);
        } catch (error) {
            console.error("Error fetching components after analysis:", error);
        }
    };

    const calculateOperatorCounts = () => {
        return OPERATORS.map((operator) => {
            const count = components.filter((comp) => comp.Operator === operator).length;
            return { operator, count };
        });
    };

    const calculateWarningCounts = () => {
        if (!components.length) {
            return {
                outOfStock: 0,
                riskyLifecycle: 0,
                manufacturerMessages: 0,
                mismatchingMpn: 0,
                totalWarnings: 0,
            };
        }
        const counts = {
            outOfStock: components.filter((comp) => comp.availability === "" && comp.analyzed).length,
            riskyLifecycle: components.filter(
                (comp) =>
                    comp.lifecycle_status !== "" &&
                    comp.lifecycle_status !== "New Product" &&
                    comp.lifecycle_status !== "New at Mouser" &&
                    comp.analyzed
            ).length,
            manufacturerMessages: components.filter((comp) => comp.info_messages !== null && comp.analyzed).length,
            mismatchingMpn: components.filter((comp) => comp.mismatch_mpn !== null && comp.analyzed).length,
        };
        return { ...counts, totalWarnings: Object.values(counts).reduce((a, b) => a + b, 0) };
    };

    const operatorCounts = calculateOperatorCounts();
    const warningCounts = calculateWarningCounts();

    const handleToggleCompareView = async () => {
        MaximizeWindow();
        try {
            const updatedComponents = await GetComponents();
            setComponents(updatedComponents);
        } catch (error) {
            console.error("Error fetching components:", error);
        }
        setShowCompareView(true);
        setCompareKey((prevKey) => prevKey + 1);
    };

    const handleCloseCompareView = () => {
        StopAnalysis();
        setShowCompareView(false);
    };

    const handleSettings = () => {
        setShowSettingsModal(true);
    };

    const getFilteredComponents = () => {
        return components.filter((comp) => {
            if (activeFilters.operators.length > 0 && !activeFilters.operators.includes(comp.Operator)) return false;
            if (activeFilters.warning) {
                if (activeFilters.warning === 'outOfStock' && (comp.availability !== "" || !comp.analyzed)) return false;
                if (activeFilters.warning === 'riskyLifecycle' &&
                    (comp.lifecycle_status === "" || comp.lifecycle_status === "New Product" || !comp.analyzed)) return false;
            }
            if (activeFilters.pinned) {
                const isPinned = pinnedComponents.some(p => p.id === comp.id);
                if (!isPinned) return false;
            }
            return true;
        });
    };

    const handlePinToggle = (id) => {
        setPinnedComponents((prevPinned) => {
            const isAlreadyPinned = prevPinned.some((component) => component.id === id);
            if (isAlreadyPinned) {
                return prevPinned.filter((component) => component.id !== id);
            } else {
                const componentToPin = components.find((component) => component.id === id);
                return componentToPin ? [...prevPinned, { ...componentToPin }] : prevPinned;
            }
        });
    };

    const handleComparison = (comparisonResult) => {
        console.log("App.jsx - handleComparison received:", comparisonResult);
        if (comparisonResult) {
            setComponents(comparisonResult);
            setShowCompareView(true);
        } else {
            alert("Aucune donnée disponible après la comparaison.");
        }
    };

    const totalComponents = components.length;
    const mouserCount = components.filter(comp => comp.analyzed && comp.mismatch_mpn === null).length;
    const unprocuredCount = components.filter(comp => comp.analyzed && comp.mismatch_mpn != null).length;
    const coverage = totalComponents > 0 ? (mouserCount / totalComponents) * 100 : 0;
    const inStockCount = components.filter(comp => comp.availability !== "" && comp.analyzed).length;
    const outOfStockCount = components.filter(comp => comp.availability === "" && comp.analyzed).length;
    const insufficientCount = 0;

    const statsData = {
        coverage,
        mouserCount,
        unprocuredCount,
        inStockCount,
        outOfStockCount,
        insufficientCount,
        total: totalComponents,
    };

    return (
        <>
            <TopBar />
            {!showCompareView && (
                <WorkspaceCreator handleToggleCompareView={handleToggleCompareView} />
            )}
            {showCompareView && (
                <CompareView
                    onComponentAnalyzed={handleComponentAnalyzed}
                    onCompare={handleComparison}
                    onPinToggle={handlePinToggle}
                    compareKey={compareKey}
                    components={getFilteredComponents()}
                    componentsAll={components} // On passe aussi le tableau complet
                    setComponents={setComponents}
                    onClose={handleCloseCompareView}
                    onSettings={handleSettings}
                    activeWorkspace={activeWorkspace}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    operators={OPERATORS}
                    opColors={OP_COLORS}
                    operatorCounts={operatorCounts}
                    warningCounts={warningCounts}
                    totalWarnings={warningCounts.totalWarnings}
                    pinnedComponents={pinnedComponents}
                    statsData={statsData}
                />
            )}

            {showSettingsModal && (
                <Modal onClose={() => setShowSettingsModal(false)}>
                    <h4 style={{ color: 'white', fontFamily: 'Poppins, sans-serif' }}>Pricing</h4>
                    <PricingCalculator />

                    <h4 style={{ color: 'white', fontFamily: 'Poppins, sans-serif' }}>Settings</h4>
                    {/* Vous pouvez également transmettre mouserApiKey, bomulusApiKey, etc. si nécessaire */}
                    <Settings />
                </Modal>
            )}
        </>
    );
}

export default App;

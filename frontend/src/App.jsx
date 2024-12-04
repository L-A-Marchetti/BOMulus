import React, { useState, useEffect } from 'react';
import './App.css';
import CompareView from './CompareView';
import TopBar from './TopBar';
import WorkspaceCreator from './WorkspaceCreator';
import { MaximizeWindow, GetComponents, GetActiveWorkspace, StopAnalysis } from "../wailsjs/go/main/App";
import RightSidebar from './RightSideBar';
import Button from './Button';
import TopMenu from './TopMenu';

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
    const [activeFilters, setActiveFilters] = useState({
        operators: [],
        warning: '',
        filter3: '',
        filter4: '',
    });

    const onComponentAnalyzed = (component) => {
        setComponents(prevComponents => {
            const index = prevComponents.findIndex(c => c.id === component.id);
            if (index !== -1) {
                const updatedComponents = [...prevComponents];
                updatedComponents[index] = component;
                return updatedComponents;
            } else {
                return [...prevComponents, component];
            }
        });
    };

    // Déplacer les fonctions ici avant leur utilisation
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

    // Calculer les opérateurs et warnings
    const operatorCounts = calculateOperatorCounts();
    const warningCounts = calculateWarningCounts();


    // Charger les composants à partir des fichiers Excel
    const handleToggleCompareView = async () => {
        MaximizeWindow();
        try {
            const updatedComponents = await GetComponents(); // Charger les composants ici
            setComponents(updatedComponents);
        } catch (error) {
            console.error("Error fetching components:", error);
        }
        setShowCompareView(true);
        setCompareKey((prevKey) => prevKey + 1);
    };

    // Fermer la vue de comparaison
    const handleCloseCompareView = () => {
        StopAnalysis();
        setShowCompareView(false);
    };

    // Appliquer les filtres sur les composants
    const getFilteredComponents = () => {
        return components.filter((comp) => {
            // Filtrer par opérateurs
            if (activeFilters.operators.length > 0 && !activeFilters.operators.includes(comp.Operator)) {
                return false;
            }

            // Filtrer par avertissements
            if (activeFilters.warning) {
                if (activeFilters.warning === 'outOfStock' && (comp.availability !== "" || !comp.analyzed)) {
                    return false;
                }
                if (
                    activeFilters.warning === 'riskyLifecycle' &&
                    (comp.lifecycle_status === "" || comp.lifecycle_status === "New Product" || !comp.analyzed)
                ) {
                    return false;
                }
                // Ajouter d'autres logiques de filtrage si nécessaire
            }

            return true; // Conserver l'élément si tous les filtres passent
        });
    };

    // Gérer le pin/unpin des composants
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


    console.log("App.jsx - handleComparison:", handleComparison);

    return (
        <>
            <TopBar />
            {!showCompareView && (
                <WorkspaceCreator handleToggleCompareView={handleToggleCompareView} />
            )}
            {showCompareView && (
                <CompareView
                    onComponentAnalyzed={onComponentAnalyzed}
                    onCompare={handleComparison} // Transmet la fonction à CompareView
                    onPinToggle={handlePinToggle}
                    compareKey={compareKey}
                    components={getFilteredComponents()} // Composants filtrés
                    setComponents={setComponents}
                    onClose={handleCloseCompareView}
                    activeWorkspace={activeWorkspace}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    operators={OPERATORS}
                    opColors={OP_COLORS}
                    operatorCounts={operatorCounts} // Ajouté
                    warningCounts={warningCounts}   // Ajouté
                    totalWarnings={warningCounts.totalWarnings} // Ajouté
                />

            )}
        </>
    );
}

export default App;

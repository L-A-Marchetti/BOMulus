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
    const [pinnedComponents, setPinnedComponents] = useState([]); // Ajout
    const [activeFilters, setActiveFilters] = useState({
        operators: [],
        warning: '',
        filter3: '',
        filter4: '',
        pinned: false, // Ajout
    });

    useEffect(() => {
        if (showCompareView) {
            (async () => {
                try {
                    const workspace = await GetActiveWorkspace();
                    setActiveWorkspace(workspace);
                } catch (error) {
                    console.error("Error fetching active workspace:", error);
                }
            })();
        } else {
            setActiveWorkspace(null);
        }
    }, [showCompareView]);

    const handleComponentAnalyzed = async (updatedComponent) => {
        console.log("handleComponentAnalyzed - Updated Component:", updatedComponent);

        // Au lieu de tenter de mettre à jour juste un composant, on récupère la liste complète
        try {
            const updatedComponents = await GetComponents();
            setComponents(updatedComponents);
        } catch (error) {
            console.error("Error fetching components after analysis:", error);
        }
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

            // Filtre par pinned
            if (activeFilters.pinned) {
                const isPinned = pinnedComponents.some(p => p.id === comp.id);
                if (!isPinned) return false;
            }

            return true;
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
    // Dans App.jsx, juste avant le return
    const totalComponents = components.length;

    // Comptons le nombre de composants procurés chez Mouser.
    // On part du principe qu'un composant est "procuré" si `supplier_manufacturer === "Mouser"` et `analyzed === true`.
    const mouserCount = components.filter(comp =>
        comp.analyzed &&
        comp.mismatch_mpn === null // Aucune MPN mismatch
    ).length;

    // Si vous prévoyez d'autres fournisseurs plus tard, vous pourrez ajouter digiKeyCount, etc.
    // Pour l'instant, disons qu'un composant non procuré c'est tout ce qui n'est pas Mouser et est analysé.
    const unprocuredCount = components.filter(comp => comp.analyzed && comp.mismatch_mpn != null).length;

    // BOM Coverage : (mouserCount / total) * 100
    const coverage = totalComponents > 0 ? (mouserCount / totalComponents) * 100 : 0;

    // Availability (déjà une partie de la logique) :
    // in stock: availability !== "" && analyzed
    const inStockCount = components.filter(comp => comp.availability !== "" && comp.analyzed).length;
    // out of stock: availability === "" && analyzed
    const outOfStockCount = components.filter(comp => comp.availability === "" && comp.analyzed).length;
    // insuffisant stock : selon votre logique, si vous n'en avez pas pour l'instant, mettez 0 ou un calcul simplifié
    const insufficientCount = 0; // à ajuster selon vos besoins

    const statsData = {
        coverage,        // Pour le donut coverage
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
                    setComponents={setComponents}
                    onClose={handleCloseCompareView}
                    activeWorkspace={activeWorkspace}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    operators={OPERATORS}
                    opColors={OP_COLORS}
                    operatorCounts={operatorCounts}
                    warningCounts={warningCounts}
                    totalWarnings={warningCounts.totalWarnings}
                    pinnedComponents={pinnedComponents} // Ajout
                    statsData={statsData}
                />
            )}

        </>
    );
}

export default App;

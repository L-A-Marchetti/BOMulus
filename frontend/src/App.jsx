// App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';
import CompareView from './CompareView';
import PinnedComponents from './PinnedComponents';
import TopBar from './TopBar';
import WorkspaceCreator from './WorkspaceCreator';
import { MaximizeWindow, GetActiveWorkspace, StopAnalysis } from "../wailsjs/go/main/App";
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
    const [pinnedComponents, setPinnedComponents] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        operators: [],  // Modifié ici
        warning: '',
        filter3: '',
        filter4: '',
    });

    // Fonction pour gérer un composant analysé
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

    // Closes the compare view
    const handleCloseCompareView = () => {
        StopAnalysis();
        setShowCompareView(false);
    };

    // Load the active workspace name when showCompareView is set on true
    useEffect(() => {
        const fetchActiveWorkspace = async () => {
            try {
                const workspace = await GetActiveWorkspace();
                setActiveWorkspace(workspace);
            } catch (error) {
                console.error("Error fetching active workspace:", error);
            }
        };

        fetchActiveWorkspace();
    }, [showCompareView]);

    // Toggles the compare view and updates its key
    const handleToggleCompareView = () => {
        MaximizeWindow();
        setShowCompareView(true);
        setCompareKey(prevKey => prevKey + 1);
    };

    // Handles pinning/unpinning of components
    const handlePinToggle = (id) => {
        setPinnedComponents(prevPinned => {
            const isAlreadyPinned = prevPinned.some(component => component.id === id);
            if (isAlreadyPinned) {
                return prevPinned.filter(component => component.id !== id);
            } else {
                const componentToPin = components.find(component => component.id === id);
                return componentToPin ? [...prevPinned, { ...componentToPin }] : prevPinned;
            }
        });
    };

    return (
        <>
            <TopBar />
            {!showCompareView && (
                <WorkspaceCreator handleToggleCompareView={handleToggleCompareView} />
            )}
            {showCompareView && (
                <CompareViewLayout
                    pinnedComponents={pinnedComponents}
                    onPinToggle={handlePinToggle}
                    compareKey={compareKey}
                    components={components}
                    setComponents={setComponents}
                    onClose={handleCloseCompareView}
                    activeWorkspace={activeWorkspace}
                    onComponentAnalyzed={onComponentAnalyzed}
                    activeFilters={activeFilters}           // Ajouté ici
                    setActiveFilters={setActiveFilters}     // Ajouté ici
                    operators={OPERATORS}
                    opColors={OP_COLORS}
                />
            )}
        </>
    );
}

// Layout component for the compare view
const CompareViewLayout = ({
    pinnedComponents,
    onPinToggle,
    compareKey,
    components,
    setComponents,
    onClose,
    activeWorkspace,
    onComponentAnalyzed,
    activeFilters,
    setActiveFilters,
    operators,
    opColors
}) => (
    <div className="compare-view-layout">
        <PinnedComponents
            pinnedComponents={pinnedComponents}
            onPinToggle={onPinToggle}
        />
        <RightSidebar />
        <main id="main-content" className="main-content">
            <div className="close-button-container">
                ☰ Current workspace :&nbsp;
                <span style={{ fontWeight: 'bold' }}>
                    {activeWorkspace.replace(/\\/g, '/').split('/').pop()}
                </span>
                <div className='close-button-spacer'></div>
                <Button onClick={onClose}>☓</Button>
            </div>
            <TopMenu
                onComponentAnalyzed={onComponentAnalyzed}
                components={components}
                operators={operators}
                opColors={opColors}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
            />
            <CompareView
                key={compareKey}
                components={components}
                setComponents={setComponents}
                onPinToggle={onPinToggle}
                pinnedComponents={pinnedComponents}
                activeFilters={activeFilters}
                operators={operators}
                opColors={opColors}
            />
        </main>
    </div>
);

export default App;

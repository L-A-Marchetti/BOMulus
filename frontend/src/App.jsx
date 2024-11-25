/*
 * App.jsx
 * 
 * Main application component that manages the overall layout and state.
 * Controls the visibility of workspace creator and compare view.
 *
 * Props: None
 *
 * Sub-components:
 * TopBar: Renders the custom title bar.
 * WorkspaceCreator: Allows creation of a new workspace.
 * PinnedComponents: Displays pinned components.
 * RightSidebar: Renders the right sidebar.
 * CompareView: Main view for component comparison.
 *
 * States:
 * showCompareView: Boolean to toggle the compare view visibility.
 * compareKey: Key to force re-render of CompareView.
 * components: Array of all components.
 * pinnedComponents: Array of pinned components.
 * activeWorkspace: Name of the active workspace.
 *
 * Backend Dependencies:
 * MaximizeWindow: Maximizes the application window.
 * GetActiveWorkspace: Return the active workspace path.
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import CompareView from './CompareView';
import PinnedComponents from './PinnedComponents';
import TopBar from './TopBar';
import WorkspaceCreator from './WorkspaceCreator';
import { MaximizeWindow, GetActiveWorkspace, StopAnalysis } from "../wailsjs/go/main/App";
import RightSidebar from './RightSideBar';
import Button from './Button';
import FileManager from './FileManager';

// Main application component
function App() {
    const [showCompareView, setShowCompareView] = useState(false);
    const [compareKey, setCompareKey] = useState(0);
    const [components, setComponents] = useState([]);
    const [pinnedComponents, setPinnedComponents] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);

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
            {showCompareView && <CompareViewLayout
                pinnedComponents={pinnedComponents}
                onPinToggle={handlePinToggle}
                compareKey={compareKey}
                setComponents={setComponents}
                onClose={handleCloseCompareView}
                activeWorkspace={activeWorkspace}
            />}
        </>
    );
}

// Layout component for the compare view
const CompareViewLayout = ({ pinnedComponents, onPinToggle, compareKey, setComponents, onClose, activeWorkspace }) => (
    <div className="compare-view-layout">
        <PinnedComponents
            pinnedComponents={pinnedComponents}
            onPinToggle={onPinToggle}
        />
        <RightSidebar />
        <main id="main-content" className="main-content">
            <div className="close-button-container">
                ☰ {activeWorkspace.split('/').pop()}
                <div className='close-button-spacer'></div>
                <Button onClick={onClose}>☓</Button>
            </div>
            <FileManager />
            <CompareView
                key={compareKey}
                setComponents={setComponents}
                onPinToggle={onPinToggle}
                pinnedComponents={pinnedComponents}
            />
        </main>
    </div>
);

export default App;

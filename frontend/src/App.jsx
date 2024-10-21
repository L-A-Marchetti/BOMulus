// App.js
import React, { useState } from 'react';
import './App.css';
import CompareView from './CompareView';
import PinnedComponents from './PinnedComponents';
import TopBar from './TopBar';
import WorkspaceCreator from './WorkspaceCreator';
import { MaximizeWindow } from "../wailsjs/go/main/App";

function App() {
    // State hooks for managing component visibility and data
    const [showCompareView, setShowCompareView] = useState(false);
    const [compareKey, setCompareKey] = useState(0);
    const [components, setComponents] = useState([]);
    const [pinnedComponents, setPinnedComponents] = useState([]);

    // Function to toggle the CompareView and update its key
    const handleToggleCompareView = () => {
        MaximizeWindow();
        setShowCompareView(true);
        setCompareKey(prevKey => prevKey + 1);
    };

    // Function to handle pinning/unpinning components
    const handlePinToggle = (id) => {
        setPinnedComponents(prevPinned => {
            const isAlreadyPinned = prevPinned.some(component => component.id === id);
            if (isAlreadyPinned) {
                // Remove the component if it's already pinned
                return prevPinned.filter(component => component.id !== id);
            } else {
                // Add the component to pinned list if it's not already pinned
                const componentToPin = components.find(component => component.id === id);
                return componentToPin ? [...prevPinned, { ...componentToPin }] : prevPinned;
            }
        });
    };

    return (
        <>
            {/* Render the custom title bar */}
            <TopBar />
            {!showCompareView && (
                <WorkspaceCreator handleToggleCompareView={handleToggleCompareView} />
            )}

            {/* Conditional rendering of CompareView and PinnedComponents */}
            {showCompareView && (
                <div style={{ display: 'flex' }}>
                    <PinnedComponents
                        pinnedComponents={pinnedComponents}
                        onPinToggle={handlePinToggle}
                    />
                    <main id="main-content" style={{
                flexGrow: 1,
                transition: 'margin-left 0.3s ease-in-out',
                marginLeft: '300px', // Ajustez cette valeur initiale si nécessaire
                padding: '50px',
                boxSizing: 'border-box',
                width: '100%',
                overflowX: 'hidden'
            }}>
                    <CompareView
                        key={compareKey}
                        setComponents={setComponents}
                        onPinToggle={handlePinToggle}
                        pinnedComponents={pinnedComponents}
                    />
                    </main>
                </div>
            )}
        </>
    );
}

export default App;

import React, { useState } from 'react';
import './App.css';
import Remote from './Remote';
import CompareView from './CompareView';
import PinnedComponents from './PinnedComponents';
import { MinimizeWindow, MaximizeWindow, CloseWindow } from '../wailsjs/go/main/App';
import logo from './assets/images/logo.png';

function App() {
    const [showCompareView, setShowCompareView] = useState(false);
    const [compareKey, setCompareKey] = useState(0);
    const [components, setComponents] = useState([]);
    const [pinnedComponents, setPinnedComponents] = useState([]);

    const handleToggleCompareView = () => {
        setShowCompareView(true);
        setCompareKey(prevKey => prevKey + 1);
    };

    const handlePinToggle = (id) => {
        setPinnedComponents(prevPinned => {
            const isAlreadyPinned = prevPinned.some(component => component.Id === id);
            if (isAlreadyPinned) {
                return prevPinned.filter(component => component.Id !== id);
            } else {
                const componentToPin = components.find(component => component.Id === id);
                return componentToPin ? [...prevPinned, { ...componentToPin }] : prevPinned;
            }
        });
    };

    // Barre supérieure personnalisée
    const handleMinimize = () => {
        MinimizeWindow();
    };

    const handleMaximize = () => {
        MaximizeWindow();
    };

    const handleClose = () => {
        CloseWindow();
    };
    return (
        <>
            <div className="custom-title-bar">
                <div className="drag-area" onDoubleClick={handleMaximize}>
                    <img width="20rem" height="20rem" src={logo} alt="logo" class="title-bar-logo" />
                </div>
                <div className="window-controls">
                    <button className="control-btn" onClick={handleMinimize}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                        </svg>
                    </button>
                    <button className="control-btn" onClick={handleMaximize}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        </svg>
                    </button>
                    <button className="control-btn close-btn" onClick={handleClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
            <Remote setShowCompareView={handleToggleCompareView} />

            {showCompareView && (
                <div style={{ display: 'flex' }}>
                    {pinnedComponents.length > 0 && (
                        <PinnedComponents
                            pinnedComponents={pinnedComponents}
                            onPinToggle={handlePinToggle}
                        />
                    )}
                    <CompareView
                        key={compareKey}
                        setComponents={setComponents}
                        onPinToggle={handlePinToggle}
                        pinnedComponents={pinnedComponents}
                    />
                </div>
            )}
        </>
    );
}

export default App;

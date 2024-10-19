import React from 'react';
import { MinimizeWindow, MaximizeWindow, CloseWindow } from '../wailsjs/go/main/App';
import logo from './assets/images/logo.png';

function TopBar() {
    // Function to minimize the window
    const handleMinimize = () => {
        MinimizeWindow();
    };

    // Function to maximize the window
    const handleMaximize = () => {
        MaximizeWindow();
    };

    // Function to close the window
    const handleClose = () => {
        CloseWindow();
    };

    return (
        <div className="custom-title-bar">
            <div className="drag-area" onDoubleClick={handleMaximize}>
                <img width="20rem" height="20rem" src={logo} alt="logo" className="title-bar-logo" />
            </div>
            <div className="window-controls">
                {/* Minimize button */}
                <button className="control-btn" onClick={handleMinimize}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="12" x2="20" y2="12"></line>
                    </svg>
                </button>
                {/* Maximize button */}
                <button className="control-btn" onClick={handleMaximize}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                </button>
                {/* Close button */}
                <button className="control-btn close-btn" onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default TopBar;

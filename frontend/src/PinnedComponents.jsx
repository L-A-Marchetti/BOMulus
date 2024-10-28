/*
 * PinnedComponents.jsx
 * 
 * Sidebar component for displaying pinned components and file management.
 *
 * Props:
 * pinnedComponents: Array of components that are currently pinned.
 * onPinToggle: Function to handle pinning/unpinning of components.
 *
 * States:
 * isVisible: Boolean to control the visibility of the sidebar.
 *
 * Sub-components:
 * OperatorExpander: Displays grouped components for each operator.
 * FileManager: Manages file operations within the workspace.
 * Button: Reusable button component for toggling sidebar visibility.
 */

import React, { useState, useEffect } from 'react';
import OperatorExpander from './Expander'; 
import FileManager from './FileManager';
import Button from './Button';
import './PinnedComponents.css';

// Constants
const OPERATORS = ["INSERT", "UPDATE", "DELETE", "EQUAL"];
const OP_COLORS = {
    INSERT: '#86b384',
    UPDATE: '#8e84b3',
    DELETE: '#cc7481',
    EQUAL: '#636363',
};

// Main PinnedComponents component
function PinnedComponents({ pinnedComponents, onPinToggle }) {
    const [isVisible, setIsVisible] = useState(true);

    // Toggle sidebar visibility
    const toggleVisibility = () => setIsVisible(prev => !prev);

    // Adjust main content margin based on sidebar visibility
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.marginLeft = isVisible ? '300px' : '40px';
        }
    }, [isVisible]);

    return (
        <div className={`pinned-components-sidebar ${isVisible ? 'visible' : 'hidden'}`}>
            <SidebarContent 
                isVisible={isVisible} 
                pinnedComponents={pinnedComponents} 
                onPinToggle={onPinToggle} 
            />
            <ToggleButton isVisible={isVisible} onClick={toggleVisibility} />
        </div>
    );
}

// Sidebar content component
function SidebarContent({ isVisible, pinnedComponents, onPinToggle }) {
    return (
        <div className={`sidebar-content ${isVisible ? 'visible' : 'hidden'}`}>
            <SidebarHeader />
            <PinnedComponentsList pinnedComponents={pinnedComponents} onPinToggle={onPinToggle} />
            <FileManagerSection />
        </div>
    );
}

// Sidebar header component
function SidebarHeader() {
    return (
        <div className="sidebar-header">
            <h4>Pinned Components</h4>
        </div>
    );
}

// Pinned components list component
function PinnedComponentsList({ pinnedComponents, onPinToggle }) {
    return (
        <div className="pinned-components-list">
            {OPERATORS.map((operator) => {
                const componentsForOperator = pinnedComponents.filter(comp => comp.Operator === operator);
                return componentsForOperator.length > 0 ? (
                    <OperatorExpander
                        key={operator}
                        operator={operator}
                        components={componentsForOperator}
                        color={OP_COLORS[operator]}
                        count={componentsForOperator.length}
                        onPinToggle={onPinToggle}
                        pinnedComponents={pinnedComponents}
                    />
                ) : null;
            })}
        </div>
    );
}

// File manager section component
function FileManagerSection() {
    return (
        <div className="file-manager-section">
            <FileManager />
        </div>
    );
}

// Toggle button component
function ToggleButton({ isVisible, onClick }) {
    return (
        <div className="toggle-button-container">
            <Button onClick={onClick} className="toggle-button">
                {isVisible ? '←' : '→'}
            </Button>
        </div>
    );
}

export default PinnedComponents;

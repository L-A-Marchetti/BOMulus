/*
 * Expander.jsx
 * 
 * Expandable section for displaying components grouped by operator.
 *
 * Props:
 * operator: String representing the operator type (e.g., "INSERT", "UPDATE").
 * components: Array of components associated with this operator.
 * color: Color associated with this operator.
 * count: Number of components for this operator.
 * onPinToggle: Function to handle pinning/unpinning of components.
 * pinnedComponents: Array of currently pinned components.
 *
 * States:
 * expanded: Boolean to control the expanded/collapsed state of the section.
 *
 * Sub-components:
 * ComponentRow: Renders individual component rows.
 */

import React, { useState } from 'react';
import ComponentRow from './ComponentRow';
import './Expander.css';

// OperatorExpander component
function OperatorExpander({ operator, components, color, count, onPinToggle, pinnedComponents }) {
    const [expanded, setExpanded] = useState(true);

    // Check if all components of this operator are pinned
    const allPinned = components.every(component =>
        pinnedComponents.some(pinned => pinned.id === component.id)
    );

    // Toggle expanded state
    const toggleExpanded = () => setExpanded(!expanded);

    return (
        <div className="expander">
            <ExpanderHeader
                operator={operator}
                color={color}
                count={count}
                expanded={expanded}
                onClick={toggleExpanded}
            />

            {expanded && (
                <ComponentTable
                    components={components}
                    operator={operator}
                    color={color}
                    onPinToggle={onPinToggle}
                    pinnedComponents={pinnedComponents}
                    allPinned={allPinned}
                />
            )}
        </div>
    );
}

// Header component for the expander
function ExpanderHeader({ operator, color, count, expanded, onClick }) {
    return (
        <h4 className="expander-header" onClick={onClick}>
            <span className="expander-icon">{expanded ? '▾' : '▸'}</span>
            {operator}&nbsp;&nbsp;&nbsp;&nbsp;⚐&nbsp;&nbsp;&nbsp;&nbsp;{count}
        </h4>
    );
}

// Table component for displaying components
function ComponentTable({ components, operator, color, onPinToggle, pinnedComponents, allPinned }) {
    return (
        <table className="component-table">
            <thead>
                <tr>
                    <th>∑</th>
                    <th>MPN</th>
                    {!allPinned && (
                        <>
                            <th>☸</th>
                            <th>☰</th>
                        </>
                    )}
                    <th></th>
                </tr>
            </thead>

            <tbody style={{ backgroundColor: color }}>
                {components.map((component) => (
                    <ComponentRow
                        key={component.id}
                        component={component}
                        operator={operator}
                        onPinToggle={onPinToggle}
                        pinnedComponents={pinnedComponents}
                        showExtraColumns={!allPinned}
                    />
                ))}
            </tbody>
        </table>
    );
}

export default OperatorExpander;

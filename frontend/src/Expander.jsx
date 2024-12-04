import React, { useState, memo } from 'react';
import ComponentRow from './ComponentRow';
import './Expander.css';

// OperatorExpander component
function OperatorExpander({ operator, components, color, count, onPinToggle, pinnedComponents }) {
    const [expanded, setExpanded] = useState(true);

    // Vérifie si tous les composants sont épinglés
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
        <h4
            className="expander-header"
            style={{ color }}
            onClick={onClick}
            aria-expanded={expanded}
        >
            <span className="expander-icon">{expanded ? '▾' : '▸'}</span>
            {operator} ⚐ {count}
        </h4>
    );
}

// Table component for displaying components
const ComponentTable = memo(({ components, operator, color, onPinToggle, pinnedComponents, allPinned }) => {
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
                {components.map(component => (
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
});

export default memo(OperatorExpander);

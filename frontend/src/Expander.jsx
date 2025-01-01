import React, { useState } from 'react';
import ComponentRow from './ComponentRow';
import './Expander.css';

// Couleurs associées à chaque opérateur
const OP_COLORS = {
    INSERT: '#86b384',
    UPDATE: '#8e84b3',
    DELETE: '#cc7481',
    EQUAL: '#323232',
};

// Fonction pour définir les couleurs transparentes du fond
const getOperatorBackgroundColor = (operator) => {
    switch (operator) {
        case 'INSERT':
            return '#86b38418'; // Vert clair
        case 'UPDATE':
            return '#a58ed318'; // Violet clair
        case 'DELETE':
            return '#d18e8e18'; // Rouge clair
        case 'EQUAL':
            return '#cccccc18'; // Gris clair
        default:
            return '#ffffff'; // Blanc par défaut
    }
};

// OperatorExpander component
function OperatorExpander({ operator, components, count, onPinToggle, pinnedComponents, apiPriority, activeFilters }) {
    const [expanded, setExpanded] = useState(true);

    const allPinned = components.every(component =>
        pinnedComponents.some(pinned => pinned.id === component.id)
    );

    const toggleExpanded = () => setExpanded(!expanded);

    // Couleur de fond dynamique pour l'expander
    const operatorBackgroundColor = getOperatorBackgroundColor(operator);

    return (
        <div className="expander" style={{ backgroundColor: operatorBackgroundColor }}>
            <ExpanderHeader
                operator={operator}
                count={count}
                expanded={expanded}
                onClick={toggleExpanded}
            />

            {expanded && (
                <ComponentTable
                    components={components}
                    operator={operator}
                    color={OP_COLORS[operator]} // Couleur de bordure/cellules
                    onPinToggle={onPinToggle}
                    pinnedComponents={pinnedComponents}
                    allPinned={allPinned}
                    apiPriority={apiPriority}
                    activeFilters={activeFilters}
                />
            )}
        </div>
    );
}

// Header component for the expander
function ExpanderHeader({ operator, count, expanded, onClick }) {
    return (
        <h4 className="expander-header" onClick={onClick}>
            <span className="expander-icon">{expanded ? '▾' : '▸'}</span>
            {operator}&nbsp;&nbsp;&nbsp;&nbsp;⚐&nbsp;&nbsp;&nbsp;&nbsp;{count}
        </h4>
    );
}

// Table component for displaying components
function ComponentTable({ components, operator, color, onPinToggle, pinnedComponents, allPinned, apiPriority, activeFilters }) {
    const operatorBackgroundColor = getOperatorBackgroundColor(operator);
    return (
        <table className="component-table">
            <thead>
                <tr>
                    <th></th>
                    <th >∑</th>
                    <th >MPN</th>
                    <th >☸</th>
                    <th >☰</th>
                    <th ></th>
                </tr>
            </thead>

            <tbody>
                {components.map((component) => (
                    <ComponentRow
                        key={component.id}
                        activeFilters={activeFilters}
                        component={component}
                        operator={operator}
                        onPinToggle={onPinToggle}
                        pinnedComponents={pinnedComponents}
                        showExtraColumns={!allPinned}
                        apiPriority={apiPriority}
                        color={color} // Passe la couleur au ComponentRow
                    />
                ))}
            </tbody>
        </table>
    );
}

export default OperatorExpander;

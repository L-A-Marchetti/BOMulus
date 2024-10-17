//Expander.jsx
import React, { useState } from 'react';
import ComponentRow from './ComponentRow';

function OperatorExpander({ operator, components, color, count, onPinToggle, pinnedComponents }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="expander">
            <h4
                style={{ color: color, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => setExpanded(!expanded)}
            >
                <span style={{ marginRight: '16px', paddingLeft: '5px' }}>
                    {expanded ? '▾' : '▸'}
                </span>
                {operator}&nbsp;&nbsp;&nbsp;&nbsp;⚐&nbsp;&nbsp;&nbsp;&nbsp;{count}
            </h4>

            {expanded && (
                <table className="component-table">
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Manufacturer Part Number</th>
                            <th>Designator</th>
                            <th>Description</th>
                            <th>Action</th> {/* Colonne pour les actions (épingle) */}
                        </tr>
                    </thead>

                    {/* Rendu des lignes de composants */}
                    <tbody style={{ backgroundColor: color }}>{components.map((component) => (
                        // Passer la fonction d'épinglage ici
                        <ComponentRow
                            key={component.Id} // Utiliser component.Id
                            component={component}
                            operator={operator}
                            onPinToggle={onPinToggle}
                            pinnedComponents={pinnedComponents}
                        />
                    ))}</tbody>

                </table>

            )}
        </div>
    );
}

export default OperatorExpander;

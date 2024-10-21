import React, { useState } from 'react';
import ComponentRow from './ComponentRow';

function OperatorExpander({ operator, components, color, count, onPinToggle, pinnedComponents }) {
    const [expanded, setExpanded] = useState(true);
    
    // Vérifiez si tous les composants de cet opérateur sont épinglés
    const allPinned = components.every(component => 
        pinnedComponents.some(pinned => pinned.id === component.id)
    );

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
            )}
        </div>
    );
}

export default OperatorExpander;

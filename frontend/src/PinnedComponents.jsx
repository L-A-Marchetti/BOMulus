import React from 'react';
import OperatorExpander from './Expander'; // Assurez-vous d'importer OperatorExpander
import AddFileToWorkspaceComp from './AddFileToWorkspace';

function PinnedComponents({ pinnedComponents, onPinToggle }) {
    const operators = ["INSERT", "UPDATE", "DELETE", "EQUAL"];
    const opColors = {
        INSERT: '#86b384',
        UPDATE: '#8e84b3',
        DELETE: '#cc7481',
        EQUAL: '#636363',
    };

    return (
        <div style={pinnedContainerStyle}>
            <h4>Pinned Components</h4>

            {/* Affichage des composants épinglés par opérateur */}
            {operators.map((operator) => {
                const componentsForOperator = pinnedComponents.filter(comp => comp.Operator === operator);
                return componentsForOperator.length > 0 ? (
                    <OperatorExpander
                        key={operator}
                        operator={operator}
                        components={componentsForOperator}
                        color={opColors[operator]}
                        count={componentsForOperator.length}
                        onPinToggle={onPinToggle} // Passer la fonction d'épinglage
                        pinnedComponents={pinnedComponents}
                    />
                ) : null;
            })}

            {/* Ajoutez un espace pour pousser le AddFileToWorkspaceComp vers le bas */}
            <div style={{ flexGrow: 1 }} />

            <AddFileToWorkspaceComp />
        </div>
    );
}

const pinnedContainerStyle = {
    display: 'flex',
    flexDirection: 'column', // Aligner les éléments verticalement
    position: 'sticky',
    marginTop: '30px',
    top: '10px',
    left: '0',
    width: '100%',
    backgroundColor: 'inherit',
    padding: '10px',
    height: 'calc(100vh - 80px)', // Ajustez selon vos besoins
    overflowY: 'auto',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.6rem',
    maxWidth: '20%',
};

export default PinnedComponents;

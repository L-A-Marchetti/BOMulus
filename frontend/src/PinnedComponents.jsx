import React, { useState } from 'react';
import OperatorExpander from './Expander'; 
import AddFileToWorkspaceComp from './AddFileToWorkspace';
import Button from './Button'; // Assurez-vous que Button est un composant qui accepte des styles

function PinnedComponents({ pinnedComponents, onPinToggle }) {
    const [isVisible, setIsVisible] = useState(true);
    
    const operators = ["INSERT", "UPDATE", "DELETE", "EQUAL"];
    const opColors = {
        INSERT: '#86b384',
        UPDATE: '#8e84b3',
        DELETE: '#cc7481',
        EQUAL: '#636363',
    };

    const toggleVisibility = () => {
        setIsVisible(prev => !prev); // Bascule l'état de visibilité
    };

    return (
        <div style={{ display: 'flex', position: 'sticky', top: '10px', left: '0' }}>
            {isVisible && (
                <div style={pinnedContainerStyle}>
                    <h4>Pinned Components</h4>
                    {operators.map((operator) => {
                        const componentsForOperator = pinnedComponents.filter(comp => comp.Operator === operator);
                        return componentsForOperator.length > 0 ? (
                            <OperatorExpander
                                key={operator}
                                operator={operator}
                                components={componentsForOperator}
                                color={opColors[operator]}
                                count={componentsForOperator.length}
                                onPinToggle={onPinToggle}
                                pinnedComponents={pinnedComponents}
                            />
                        ) : null;
                    })}
                    <div style={{ flexGrow: 1 }} />
                    <AddFileToWorkspaceComp />
                </div>
            )}
            <div style={{width: '40px'}}>
            <Button 
                onClick={toggleVisibility} 
                style={{ 
                    marginTop: '50px',
                    height: 'calc(100vh - 80px)',
                    position: isVisible ? 'relative' : 'absolute', // Change la position selon la visibilité
                    left: isVisible ? 'auto' : '0', // Colle le bouton à gauche quand masqué
                }}
            >
                {isVisible ? '←' : '→'} {/* Flèche vers la gauche ou vers la droite */}
            </Button>
            </div>
        </div>
    );
}

const pinnedContainerStyle = {
    display: 'flex',
    flexDirection: 'column', 
    marginTop: '10px',
    width: '300px', // Ajustez selon vos besoins
    backgroundColor: 'inherit',
    padding: '10px',
    height: 'calc(100vh - 60px)', 
    overflowY: 'auto',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.6rem',
};

export default PinnedComponents;

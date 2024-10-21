import React, { useState, useEffect } from 'react';
import OperatorExpander from './Expander'; 
import AddFileToWorkspaceComp from './AddFileToWorkspace';
import Button from './Button';

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
        setIsVisible(prev => !prev);
    };

    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.marginLeft = isVisible ? '300px' : '40px';
        }
    }, [isVisible]);

    return (
        <div style={{ 
            position: 'fixed',
            top: 40,
            left: 0,
            height: '95vh',
            width: isVisible ? '340px' : '40px',
            transition: 'width 0.3s ease-in-out',
            display: 'flex',
            backgroundColor: 'inherit',
            zIndex: 1000,
            overflow: 'hidden'
        }}>
            <div style={{
                width: '300px',
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                transition: 'transform 0.3s ease-in-out',
                transform: isVisible ? 'translateX(0)' : 'translateX(-300px)'
            }}>
                <div style={pinnedContainerStyle}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Pinned Components</h4>
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
            </div>
            <div style={{
                width: '40px',
                height: '100%',
                position: 'absolute',
                right: 0,
                top: 0
            }}>
                <Button 
                    onClick={toggleVisibility} 
                    style={{ 
                        width: '100%',
                        height: '100%',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isVisible ? '←' : '→'}
                </Button>
            </div>
        </div>
    );
}

const pinnedContainerStyle = {
    display: 'flex',
    flexDirection: 'column', 
    height: '100%', 
    width: '300px',
    padding: '10px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.6rem',
    boxSizing: 'border-box'
};

export default PinnedComponents;

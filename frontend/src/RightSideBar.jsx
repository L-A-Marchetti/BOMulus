import React, { useState, useEffect } from 'react';
import Button from './Button';
import PricingCalculator from './PricingCalculator';
import Settings from './Settings';

function RightSidebar() {
    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };

    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.marginRight = isVisible ? '300px' : '40px';
            mainContent.style.transition = 'margin-left 0.3s ease-in-out, margin-right 0.3s ease-in-out';
        }
    }, [isVisible]);

    return (
        <div style={{ 
            position: 'fixed',
            top: 40,
            right: 0,
            height: '95vh',
            width: '340px',
            display: 'flex',
            backgroundColor: 'inherit',
            zIndex: 1000,
        }}>
            <div style={{
                position: 'absolute',
                width: '40px',
                height: '100%',
                transition: 'transform 0.3s ease-in-out',
                transform: isVisible ? 'translateX(0)' : 'translateX(300px)',
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
                    {isVisible ? '→' : '←'}
                </Button>
            </div>

            <div style={{
                position: 'absolute',
                right: 0,
                width: '300px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                transform: isVisible ? 'translateX(0)' : 'translateX(300px)',
            }}>
                {/* Pricing Block */}
                <div style={{ 
                    position: 'sticky', 
                    top: 0, 
                    backgroundColor: 'rgb(39, 39, 39)', 
                    zIndex: 1,
                    padding: '10px',
                }}>
                    <h4 style={{
                        margin: 0,
                        padding: '10px',
                        fontFamily: 'Poppins, sans-serif',
                    }}>Pricing</h4>
                </div>

                {/* Pricing Content */}
                <PricingCalculator />
                
                {/* Settings Block */}
                <div style={{
                    maxHeight: '500px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingTop: '10px',
                    minHeight: '300px',
                    }}>
                    <div style={{ 
                        backgroundColor: 'rgb(39, 39, 39)',
                        padding: '10px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                        <h4 style={{
                            margin: '0 0 10px 0',
                            padding: '10px',
                            fontFamily: 'Poppins, sans-serif',
                        }}>Settings</h4>
                        {/* Add your settings content here */}
                        <Settings />
                    </div>
                </div>
            </div>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'column', 
    height: '100%', 
    width: '300px',
    padding: '10px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.6rem',
    boxSizing: 'border-box'
};

export default RightSidebar;
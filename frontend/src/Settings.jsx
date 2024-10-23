import React, { useState, useEffect } from 'react';
import Button from './Button';
import { TestMouserAPIKey, TestBOMulusAPIKey, GetSavedAPIKeys } from '../wailsjs/go/main/App';

const LoadingSpinner = () => (
    <div className="loading-bar" style={{
        display: 'inline-block',
        width: '100px',
        height: '4px',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
        marginLeft: '10px',
    }}>
        <div className="loading-bar-fill" style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '-100%',
            backgroundColor: 'white',
            animation: 'loadingBarFill 1.5s ease-in-out infinite',
        }} />
    </div>
);


function Settings() {
    const [mouserApiKey, setMouserApiKey] = useState('');
    const [bomulusApiKey, setBomulusApiKey] = useState('');
    const [mouserApiStatus, setMouserApiStatus] = useState('');
    const [bomulusApiStatus, setBomulusApiStatus] = useState('');
    const [mouserError, setMouserError] = useState('');
    const [bomulusError, setBomulusError] = useState('');
    const [isTestingMouser, setIsTestingMouser] = useState(false);
    const [isTestingBOMulus, setIsTestingBOMulus] = useState(false);

    useEffect(() => {
        loadSavedAPIKeys();
        const style = document.createElement('style');
        style.textContent = `
        @keyframes loadingBarFill {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const loadSavedAPIKeys = async () => {
        try {
            const savedKeys = await GetSavedAPIKeys();
            setMouserApiKey(savedKeys.mouser_api_key || '');
            setBomulusApiKey(savedKeys.bomulus_api_key || '');
        } catch (error) {
            console.error("Error loading saved API keys:", error);
        }
    };

    const handleMouserApiKeyChange = (e) => {
        setMouserApiKey(e.target.value);
        setMouserApiStatus('');
        setMouserError('');
    };

    const handleBomulusApiKeyChange = (e) => {
        setBomulusApiKey(e.target.value);
        setBomulusApiStatus('');
        setBomulusError('');
    };

    const testMouserApiKey = async () => {
        setIsTestingMouser(true);
        try {
            const result = await TestMouserAPIKey(mouserApiKey);
            if (result) {
                setMouserApiStatus('API key is valid');
                setMouserError('');
            } else {
                setMouserApiStatus('API key is invalid');
                setMouserError('');
            }
        } catch (error) {
            console.error("Error testing Mouser API key:", error);
            setMouserApiStatus('');
            setMouserError(error.toString());
        } finally {
            setIsTestingMouser(false);
        }
    };

    const testBomulusApiKey = async () => {
        setIsTestingBOMulus(true);
        try {
            const result = await TestBOMulusAPIKey(bomulusApiKey);
            if (result) {
                setBomulusApiStatus('API key is valid');
                setBomulusError('');
            } else {
                setBomulusApiStatus('API key is invalid');
                setBomulusError('');
            }
        } catch (error) {
            console.error("Error testing BOMulus API key:", error);
            setBomulusApiStatus('');
            setBomulusError(error.toString());
        } finally {
            setIsTestingBOMulus(false);
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            <h4 style={{
                margin: 0,
                padding: '10px',
                fontFamily: 'Poppins, sans-serif',
            }}>API Settings</h4>
            
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="mouserApiKey">Mouser API Key:</label>
                <input
                    id="mouserApiKey"
                    type="text"
                    value={mouserApiKey}
                    onChange={handleMouserApiKeyChange}
                    placeholder="Enter Mouser API Key"
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
                <Button 
                    style={{ width: '100%' }} 
                    onClick={testMouserApiKey}
                    disabled={isTestingMouser}
                >
                    {isTestingMouser ? (
                        <>Test Mouser API Key <LoadingSpinner /></>
                    ) : (
                        'Test Mouser API Key'
                    )}
                </Button>
                {mouserApiStatus && <p style={{ color: 'green' }}>{mouserApiStatus}</p>}
                {mouserError && <p style={{ color: 'red' }}>{mouserError}</p>}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="bomulusApiKey">BOMulus API Key:</label>
                <input
                    id="bomulusApiKey"
                    type="text"
                    value={bomulusApiKey}
                    onChange={handleBomulusApiKeyChange}
                    placeholder="Enter BOMulus API Key"
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
                <Button 
                    style={{ width: '100%' }} 
                    onClick={testBomulusApiKey}
                    disabled={isTestingBOMulus}
                >
                    {isTestingBOMulus ? (
                        <>Test BOMulus API Key <LoadingSpinner /></>
                    ) : (
                        'Test BOMulus API Key'
                    )}
                </Button>
                {bomulusApiStatus && <p style={{ color: 'green' }}>{bomulusApiStatus}</p>}
                {bomulusError && <p style={{ color: 'red' }}>{bomulusError}</p>}
            </div>
        </div>
    );
}

export default Settings;

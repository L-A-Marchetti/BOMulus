import React, { useState } from 'react';
import Button from './Button';
import { TestMouserAPIKey, TestBOMulusAPIKey } from '../wailsjs/go/main/App';

function Settings() {
    const [mouserApiKey, setMouserApiKey] = useState('');
    const [bomulusApiKey, setBomulusApiKey] = useState('');
    const [mouserApiStatus, setMouserApiStatus] = useState('');
    const [bomulusApiStatus, setBomulusApiStatus] = useState('');
    const [mouserError, setMouserError] = useState('');
    const [bomulusError, setBomulusError] = useState('');

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
        }
    };

    const testBomulusApiKey = async () => {
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
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
                <Button style={{ width: '100%' }} onClick={testMouserApiKey}>
                    Test Mouser API Key
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
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                    }}
                />
                <Button style={{ width: '100%' }} onClick={testBomulusApiKey}>
                    Test BOMulus API Key
                </Button>
                {bomulusApiStatus && <p style={{ color: 'green' }}>{bomulusApiStatus}</p>}
                {bomulusError && <p style={{ color: 'red' }}>{bomulusError}</p>}
            </div>
        </div>
    );
}

export default Settings;

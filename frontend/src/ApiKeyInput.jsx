/*
 * ApiKeyInput.jsx
 * 
 * Component for rendering an input field for API keys with testing functionality.
 *
 * Props:
 * id: String representing the id of the input element.
 * label: String for the label of the input field.
 * value: String representing the current value of the input field.
 * onChange: Function to handle changes to the input field.
 * onTest: Function to handle testing the API key.
 * isTesting: Boolean indicating if the API key is currently being tested.
 * status: String for displaying the status of the API key test.
 * error: String for displaying any errors related to the API key.
 */

import React from 'react';
import Button from './Button';
import './Settings.css'; // External CSS file
import LoadingSpinner from './LoadingSpinner';

const ApiKeyInput = ({
    id,
    label,
    value,
    onChange,
    onTest,
    isTesting,
    status,
    error,
    isCredentials = false, // Indicate credentials configuration
    clientSecret,          // Optionnal for credentials
    onClientSecretChange   // Client secret callback
}) => (
    <div className="api-key-input">
        <label htmlFor={id}>{label}:</label>
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${label} ${isCredentials ? 'Client ID' : ''}`}
            className="input-field"
        />
        {isCredentials && (
            <input
                type="password"
                value={clientSecret}
                onChange={onClientSecretChange}
                placeholder="Enter Client Secret"
                className="input-field"
            />
        )}
        <Button
            className="test-button"
            onClick={onTest}
            disabled={isTesting}
        >
            {isTesting ? (
                <>
                    Test {label} <LoadingSpinner />
                </>
            ) : (
                `Test ${label}`
            )}
        </Button>
        {status && <p className="status-message success">{status}</p>}
        {error && <p className="status-message error">{error}</p>}
    </div>
);

export default ApiKeyInput;


/*
import React from 'react';
import Button from './Button';
import './Settings.css'; // External CSS file
import LoadingSpinner from './LoadingSpinner';

const ApiKeyInput = ({ id, label, value, onChange, onTest, isTesting, status, error }) => (
    <div className="api-key-input">
        <label htmlFor={id}>{label}:</label>
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${label}`}
            className="input-field"
        />
        <Button 
            className="test-button" 
            onClick={onTest}
            disabled={isTesting}
        >
            {isTesting ? (
                <>Test {label} <LoadingSpinner /></>
            ) : (
                `Test ${label}`
            )}
        </Button>
        {status && <p className="status-message success">{status}</p>}
        {error && <p className="status-message error">{error}</p>}
    </div>
);

export default ApiKeyInput;
*/
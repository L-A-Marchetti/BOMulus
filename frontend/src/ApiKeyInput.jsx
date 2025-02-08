import React, { useState, useEffect } from "react";
import "./Settings.css";

const ApiKeyInput = ({
    id,
    label,
    value,
    onChange,
    onTest,
    isTesting,
    status,
    error,
    isCredentials = false,
    clientSecret,
    onClientSecretChange,
}) => {
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!isTesting) {
            if (status && status.toLowerCase().includes("valid")) {
                setResult("success");
            } else if ((status && status.toLowerCase().includes("invalid")) || error) {
                setResult("error");
            } else {
                setResult(null);
            }
        } else {
            setResult(null);
        }
    }, [isTesting, status, error]);

    let buttonClass = "verify-button dark";
    if (isTesting) {
        buttonClass += " in-progress";
    } else if (result === "success") {
        buttonClass = "verify-button success";
    } else if (result === "error") {
        buttonClass = "verify-button error";
    }

    // Credentials: deux champs (clientID, clientSecret)
    if (isCredentials) {
        return (
            <div className="api-key-input">
                <label className="api-key-label" htmlFor={id}>{label}:</label>
                <div className="input-group-credentials">
                    <input
                        id={id}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter Client ID"
                        className="input-field"
                    />
                    <input
                        type="password"
                        value={clientSecret}
                        onChange={onClientSecretChange}
                        placeholder="Enter Client Secret"
                        className="input-field"
                    />
                </div>
                <button className={buttonClass} onClick={onTest} disabled={isTesting}>
                    {isTesting ? "Verifying..." : "Verify Key"}
                </button>
                {error ? (
                    <p className="status-message error">{error}</p>
                ) : (
                    status && <p className="status-message">{status}</p>
                )}
            </div>
        );
    } else {
        // Single-line (Mouser, BOMulus)
        return (
            <div className="api-key-input">
                <label className="api-key-label" htmlFor={id}>{label}:</label>
                <div className="input-group-vertical">
                    <input
                        id={id}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder={`Enter ${label}`}
                        className="input-field"
                    />
                    <button className={buttonClass} onClick={onTest} disabled={isTesting}>
                        {isTesting ? "Verifying..." : "Verify Key"}
                    </button>
                </div>
                {error ? (
                    <p className="status-message error">{error}</p>
                ) : (
                    status && <p className="status-message">{status}</p>
                )}
            </div>
        );
    }
};

export default ApiKeyInput;

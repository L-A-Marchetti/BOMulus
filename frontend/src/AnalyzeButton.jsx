/*
 * AnalyzeButton.jsx
 * 
 * Controls the analysis process, displays progress, and handles errors.
 * Allows users to start analysis and view its status.
 *
 * Props:
 * onComponentAnalyzed: Function called when a component is analyzed.
 *
 * Sub-components:
 * ProgressBar: Displays the current progress of the analysis.
 * Button: Reusable button for starting analysis and error retry.
 *
 * States:
 * status: Current state of analysis ('idle', 'running', 'completed', 'error').
 * progress: Percentage of analysis completion.
 * lastAnalyzedComponent: Most recently analyzed component.
 * error: Error message if analysis fails.
 *
 * Backend Dependencies:
 * GetAnalysisState: Retrieves current state of the analysis.
 * RunAnalysis: Initiates the analysis process.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GetAnalysisState, RunAnalysis } from "../wailsjs/go/main/App";
import Button from './Button';
import ProgressBar from './ProgressBar';
import './AnalyzeButton.css';

// Main component for analysis control and status display
export default function AnalyzeButton({ onComponentAnalyzed }) {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [lastAnalyzedComponent, setLastAnalyzedComponent] = useState(null);
    const [error, setError] = useState(null);

    // Fetches and updates the current analysis state
    const updateProgress = useCallback(async () => {
        try {
            const state = await GetAnalysisState();
            setProgress(state.Progress);
            setLastAnalyzedComponent(state.Current);
            if (state.Completed) {
                setStatus('completed');
            }
        } catch (error) {
            console.error("Error fetching analysis state:", error);
            setError(error.toString());
            setStatus('error');
        }
    }, []);

    // Sets up intervals for progress updates and component analysis
    useEffect(() => {
        let progressInterval;
        let componentInterval;

        if (status === 'running') {
            progressInterval = setInterval(updateProgress, 300);
            componentInterval = setInterval(() => {
                if (lastAnalyzedComponent !== null) {
                    onComponentAnalyzed(lastAnalyzedComponent);
                    setLastAnalyzedComponent(null);
                }
            }, 1000);
        }

        return () => {
            clearInterval(progressInterval);
            clearInterval(componentInterval);
        };
    }, [status, updateProgress, onComponentAnalyzed, lastAnalyzedComponent]);

    // Handles button click based on current status
    const handleClick = async () => {
        if (status === 'idle' || status === 'error' || status === 'completed') {
            setStatus('running');
            setError(null);
            setProgress(0);
            try {
                await RunAnalysis();
            } catch (error) {
                console.error("Error starting analysis:", error);
                setStatus('error');
                setError(error.toString());
            }
        }
    };

    // Renders the appropriate button or progress bar based on status
    const renderContent = () => {
        switch (status) {
            case 'idle':
            case 'completed':
                return <Button onClick={handleClick}>Analyze ↝</Button>;
            case 'running':
                return <ProgressBar progress={progress} />;
            case 'error':
                return (
                    <div className="error-container">
                        <Button onClick={handleClick} className="error-button">
                            Error: Retry Analysis
                        </Button>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="analyze-button-container">
            {renderContent()}
        </div>
    );
}

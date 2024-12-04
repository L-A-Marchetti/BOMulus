import React, { useState, useEffect, useCallback } from 'react';
import { GetAnalysisState, RunAnalysis } from "../wailsjs/go/main/App";
import ProgressBar from './ProgressBar';
import './AnalyzeButton.css';
import AnalysisIcon from "./assets/images/analysis.svg";

export default function AnalyzeButton({ onComponentAnalyzed }) {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [lastAnalyzedComponent, setLastAnalyzedComponent] = useState(null);
    const [error, setError] = useState(null);

    // Fonction pour mettre à jour l'état de l'analyse
    const updateProgress = useCallback(async () => {
        try {
            const state = await GetAnalysisState();
            setProgress(state.Progress);
            if (state.Current) {
                onComponentAnalyzed(state.Current);
            }
            if (state.Completed) {
                setTimeout(() => setStatus('completed'), 500);
            }
        } catch (err) {
            console.error("Error fetching analysis state:", err);
            setError(err.toString());
            setStatus('error');
        }
    }, [onComponentAnalyzed]);

    // Gère les mises à jour continues lorsque l'analyse est en cours
    useEffect(() => {
        if (status !== 'running') return;

        const interval = setInterval(updateProgress, 100);
        return () => clearInterval(interval);
    }, [status, updateProgress]);

    // Démarre l'analyse
    const handleClick = async () => {
        if (status === 'idle' || status === 'error' || status === 'completed') {
            setStatus('running');
            setError(null);
            setProgress(0);
            try {
                await RunAnalysis();
            } catch (err) {
                console.error("Erreur lors du démarrage de l'analyse :", err);
                setStatus('error');
                setError(err.toString());
            }
        }
    };

    // Rend l'interface en fonction de l'état
    const renderContent = () => {
        switch (status) {
            case 'idle':
                return (
                    <button className="analyze-button" onClick={handleClick}>
                        <img src={AnalysisIcon} alt="Start Analysis" />
                    </button>
                );
            case 'completed':
                return (
                    <button className="analyze-button" onClick={handleClick}>
                        <div className="progress-bar-container">
                            <ProgressBar progress={100} />
                            <img src={AnalysisIcon} alt="Restart Analysis" className="analyze-icon-overlay" />
                        </div>
                    </button>
                );
            case 'running':
                return (
                    <div className="progress-bar-container">
                        <ProgressBar progress={progress} />
                        <img src={AnalysisIcon} alt="Analysis in Progress" className="analyze-icon-overlay pulsating-icon" />
                    </div>
                );
            case 'error':
                return (
                    <div className="error-container">
                        <button onClick={handleClick} className="analyze-button error-button">
                            Retry Analysis
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="analyze-button-container" role="region" aria-live="polite">
            {renderContent()}
        </div>
    );
}

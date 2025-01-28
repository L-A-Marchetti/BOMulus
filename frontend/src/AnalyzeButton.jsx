import React, { useState, useEffect, useCallback } from 'react';
import { GetAnalysisState, RunAnalysis, GetApiCount } from "../wailsjs/go/main/App";
import ProgressBar from './ProgressBar';
import './AnalyzeButton.css';
import AnalysisIcon from "./assets/images/analysis.svg";

export default function AnalyzeButton({
    onComponentAnalyzed,
    onAnalysisCompleted,   // <-- ajout de cette prop
    onStatusChange
}) {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [lastAnalyzedComponent, setLastAnalyzedComponent] = useState(null);
    const [error, setError] = useState(null);
    const [apiCount, setApiCount] = useState(0);

    // Récupère le nombre total d’items à analyser
    useEffect(() => {
        handleApiCount();
    }, []);

    // Signale tout changement de `status` à l’extérieur
    useEffect(() => {
        if (onStatusChange) {
            onStatusChange(status);
        }
        // Si l’analyse vient de se terminer, on appelle onAnalysisCompleted
        if (status === 'completed' && onAnalysisCompleted) {
            onAnalysisCompleted();
        }
    }, [status, onStatusChange, onAnalysisCompleted]);

    const handleApiCount = async () => {
        try {
            const count = await GetApiCount();
            setApiCount(count);
        } catch (error) {
            console.error("Erreur lors du count", error);
        }
    };

    // Met à jour la progression (appelé par un setInterval ci-dessous)
    const updateProgress = useCallback(async () => {
        try {
            const state = await GetAnalysisState();

            // Proportion de composants déjà analysés
            setProgress(state.Progress / apiCount);

            // On détecte le composant qui vient d’être analysé
            setLastAnalyzedComponent(state.Current);

            // Gestion d’erreurs éventuelles
            if (state.MouserErr !== "") {
                setError(state.MouserErr);
            }
            if (state.DigikeyErr !== "") {
                setError(state.DigikeyErr);
            }

            // Si terminé, on set 100% puis on passe en "completed"
            if (state.Completed) {
                setProgress(100);
                // On attend un peu pour que la barre se voie remplir
                setTimeout(() => {
                    setStatus('completed');
                }, 500);
            }
        } catch (error) {
            console.error("Error fetching analysis state:", error);
            setError(error.toString());
            setStatus('error');
        }
    }, [apiCount]);

    // Lance la surveillance (progressInterval) si on est en "running"
    useEffect(() => {
        let progressInterval;
        let componentInterval;

        if (status === 'running') {
            // Met à jour la progression toutes les 100 ms
            progressInterval = setInterval(updateProgress, 100);

            // Vérifie toutes les 100 ms si un nouveau composant a été analysé
            componentInterval = setInterval(() => {
                if (lastAnalyzedComponent !== null) {
                    // On appelle le callback onComponentAnalyzed si défini
                    onComponentAnalyzed && onComponentAnalyzed(lastAnalyzedComponent);
                    setLastAnalyzedComponent(null);
                }
            }, 100);
        }

        return () => {
            clearInterval(progressInterval);
            clearInterval(componentInterval);
        };
    }, [status, updateProgress, onComponentAnalyzed, lastAnalyzedComponent]);

    // Clic sur le bouton
    const handleClick = async () => {
        // On ne relance pas si on est déjà en "running"
        if (status === 'idle' || status === 'error' || status === 'completed') {
            setStatus('running');
            setError(null);
            setProgress(0);
            try {
                await RunAnalysis();
            } catch (error) {
                console.error("Erreur lors du démarrage de l'analyse :", error);
                setStatus('error');
                setError(error.toString());
            }
        }
    };

    // Rend le contenu du bouton/analyse
    const renderContent = () => {
        switch (status) {
            case 'idle':
                return (
                    <div className="analyze-button-grid">
                        <button className="analyze-button" onClick={handleClick}>
                            <img src={AnalysisIcon} alt="Analyze" />
                        </button>
                    </div>
                );
            case 'completed':
                return (
                    <div className="analyze-button-grid">
                        <button className="analyze-button" onClick={handleClick}>
                            <div className="progress-bar-container">
                                <ProgressBar progress={100} />
                                <img
                                    src={AnalysisIcon}
                                    alt="Analyze"
                                    className="analyze-icon-overlay"
                                />
                            </div>
                        </button>
                    </div>
                );
            case 'running':
                return (
                    <div className="analyze-button-grid">
                        <div className="progress-bar-container">
                            <ProgressBar progress={progress} />
                            <img
                                src={AnalysisIcon}
                                alt="Analyze"
                                className="analyze-icon-overlay pulsating-icon"
                            />
                        </div>
                        {error && <p className="dyn-error-message">{error}</p>}
                    </div>
                );
            case 'error':
                return (
                    <div className="analyze-button-grid">
                        <div className="error-container">
                            <button onClick={handleClick} className="analyze-button error-button">
                                Erreur : Réessayer l'analyse
                            </button>
                            {error && <p className="error-message">{error}</p>}
                        </div>
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

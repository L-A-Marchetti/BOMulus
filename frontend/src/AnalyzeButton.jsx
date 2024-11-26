/*
 * AnalyzeButton.jsx
 * 
 * Contrôle le processus d'analyse, affiche la progression et gère les erreurs.
 * Permet aux utilisateurs de démarrer l'analyse et de voir son statut.
 *
 * Props:
 * onComponentAnalyzed: Fonction appelée lorsqu'un composant est analysé.
 *
 * Sous-composants:
 * ProgressBar: Affiche la progression actuelle de l'analyse.
 *
 * États:
 * status: État actuel de l'analyse ('idle', 'running', 'completed', 'error').
 * progress: Pourcentage d'achèvement de l'analyse.
 * lastAnalyzedComponent: Dernier composant analysé.
 * error: Message d'erreur si l'analyse échoue.
 *
 * Dépendances Backend:
 * GetAnalysisState: Récupère l'état actuel de l'analyse.
 * RunAnalysis: Démarre le processus d'analyse.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GetAnalysisState, RunAnalysis } from "../wailsjs/go/main/App";
import ProgressBar from './ProgressBar'; // Assurez-vous que ce chemin est correct
import './AnalyzeButton.css';
import AnalysisIcon from "./assets/images/analysis.svg";

// Composant principal pour le contrôle de l'analyse et l'affichage du statut
export default function AnalyzeButton({ onComponentAnalyzed }) {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [lastAnalyzedComponent, setLastAnalyzedComponent] = useState(null);
    const [error, setError] = useState(null);

    // Récupère et met à jour l'état actuel de l'analyse
    const updateProgress = useCallback(async () => {
        try {
            const state = await GetAnalysisState();
            setProgress(state.Progress);
            setLastAnalyzedComponent(state.Current);
            if (state.Completed) {
                setProgress(100); // Assurez-vous que la progression est à 100%
                // Retarder le changement d'état pour permettre l'affichage du dernier remplissage
                setTimeout(() => {
                    setStatus('completed');
                }, 500); // Délai de 500 ms
            }
        } catch (error) {
            console.error("Error fetching analysis state:", error);
            setError(error.toString());
            setStatus('error');
        }
    }, [setProgress, setLastAnalyzedComponent, setStatus, setError]);

    // Configure les intervalles pour les mises à jour de progression et l'analyse des composants
    useEffect(() => {
        let progressInterval;
        let componentInterval;

        if (status === 'running') {
            progressInterval = setInterval(updateProgress, 100);
            componentInterval = setInterval(() => {
                if (lastAnalyzedComponent !== null) {
                    onComponentAnalyzed(lastAnalyzedComponent);
                    setLastAnalyzedComponent(null);
                }
            }, 100);
        }

        return () => {
            clearInterval(progressInterval);
            clearInterval(componentInterval);
        };
    }, [status, updateProgress, onComponentAnalyzed, lastAnalyzedComponent]);

    // Gère le clic sur le bouton en fonction de l'état actuel
    const handleClick = async () => {
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

    // Rend le bouton approprié ou la barre de progression en fonction de l'état
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
                    </div>
                );
            case 'error':
                // ... gestion des erreurs ...
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

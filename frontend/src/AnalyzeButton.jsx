import React, { useState, useEffect, useCallback } from 'react';
import { GetAnalysisState, RunAnalysis } from "../wailsjs/go/main/App";
import Button from './Button';

export default function AnalyzeButton({ onComponentAnalyzed }) {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [lastAnalyzedComponent, setLastAnalyzedComponent] = useState(null);

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
        }
    }, []);

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

    const handleClick = async () => {
        if (status === 'idle') {
            setStatus('running');
            try {
                await RunAnalysis();
            } catch (error) {
                console.error("Error starting analysis:", error);
                setStatus('idle');
            }
        } else if (status === 'completed') {
            console.log('Displaying report');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {status === 'idle' && (
                <Button onClick={handleClick}>Analyze ↝</Button>
            )}
            {status === 'running' && (
                <div style={{ width: '100px', maxWidth: '300px' }}>
                    <div style={progressBarContainerStyle}>
                        <div style={{ ...progressBarStyle, width: `${progress}%` }}></div>
                    </div>
                </div>
            )}
            {status === 'completed' && (
                <Button onClick={handleClick}>Show Report ↝</Button>
            )}
        </div>
    );
}

const progressBarContainerStyle = {
    width: '100%',
    backgroundColor: '#303030',
    borderRadius: '5px',
    overflow: 'hidden',
};

const progressBarStyle = {
    height: '10px',
    backgroundColor: '#575757',
    transition: 'width 0.5s ease-in-out',
};

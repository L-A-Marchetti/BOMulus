// RecentWorkspaces.js
import React, { useState, useEffect } from 'react';
import { GetRecentWorkspaces, SetActiveWorkspace } from '../wailsjs/go/main/App'; // Assurez-vous d'importer SetActiveWorkspace
import Button from './Button';

function RecentWorkspaces({ handleToggleCompareView }) {
    const [recentWorkspaces, setRecentWorkspaces] = useState([]);

    useEffect(() => {
        loadRecentWorkspaces();
    }, []);

    const loadRecentWorkspaces = async () => {
        try {
            const workspaces = await GetRecentWorkspaces();
            setRecentWorkspaces(workspaces);
        } catch (error) {
            console.error("Failed to load recent workspaces:", error);
        }
    };

    const handleWorkspaceClick = async (workspace) => {
        try {
            // Définir le workspace actif dans la variable globale
            await SetActiveWorkspace(workspace.workspace_infos.path);
            // Appeler la fonction pour afficher la CompareView
            handleToggleCompareView();
        } catch (error) {
            console.error("Error setting active workspace:", error);
        }
    };

    return (
        <div>
            {recentWorkspaces.map((workspace, index) => (
                <Button key={index} onClick={() => handleWorkspaceClick(workspace)}>
                    ☰ {workspace.workspace_infos.name}
                </Button>
            ))}
        </div>
    );
}

export default RecentWorkspaces;

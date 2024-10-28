/*
 * RecentWorkspaces.jsx
 * 
 * Component for displaying and managing recent workspaces.
 *
 * Props:
 * handleToggleCompareView: Function to toggle the CompareView when a workspace is selected.
 *
 * States:
 * recentWorkspaces: Array of recent workspace objects.
 *
 * Backend Dependencies:
 * GetRecentWorkspaces: Fetches the list of recent workspaces.
 * SetActiveWorkspace: Sets the active workspace in the backend.
 */

import React, { useState, useEffect } from 'react';
import { GetRecentWorkspaces, SetActiveWorkspace } from '../wailsjs/go/main/App';
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
            await SetActiveWorkspace(workspace.workspace_infos.path);
            handleToggleCompareView();
        } catch (error) {
            console.error("Error setting active workspace:", error);
        }
    };

    return (
        <div>
            {recentWorkspaces.map((workspace, index) => (
                <Button 
                    key={index} 
                    onClick={() => handleWorkspaceClick(workspace)}
                >
                    ☰ {workspace.workspace_infos.name}
                </Button>
            ))}
        </div>
    );
}

export default RecentWorkspaces;

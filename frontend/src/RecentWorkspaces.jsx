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
import { GetRecentWorkspaces, SetActiveWorkspace, DeleteWorkspace } from '../wailsjs/go/main/App';
import Button from './Button';

// Main RecentWorkspaces component
function RecentWorkspaces({ handleToggleCompareView }) {
    const [recentWorkspaces, setRecentWorkspaces] = useState([]);

    // Effect to load recent workspaces on component mount
    useEffect(() => {
        loadRecentWorkspaces();
    }, []);

    // Function to fetch and set recent workspaces
    const loadRecentWorkspaces = async () => {
        try {
            const workspaces = await GetRecentWorkspaces();
            setRecentWorkspaces(workspaces);
        } catch (error) {
            console.error("Failed to load recent workspaces:", error);
        }
    };

    // Function to handle click on a workspace button
    const handleWorkspaceClick = async (workspace) => {
        try {
            await SetActiveWorkspace(workspace.workspace_infos.path);
            handleToggleCompareView();
        } catch (error) {
            console.error("Error setting active workspace:", error);
        }
    };

    // Function to handle click on delete workspace button
    const handleWorkspaceDelete = async (workspace) => {
        try {
            await DeleteWorkspace(workspace.workspace_infos.path);
        } catch (error) {
            console.error("Error deleting workspace:", error);
        }
        loadRecentWorkspaces();
    };

    return (
        <div>
            {recentWorkspaces.map((workspace, index) => (
                <>
                    <Button 
                        key={index} 
                        onClick={() => handleWorkspaceClick(workspace)}
                    >
                        ☰ {workspace.workspace_infos.name}
                    </Button>
                    <Button
                        key={index}
                        onClick={() => handleWorkspaceDelete(workspace)}
                    >
                    ⌫
                    </Button>
                </>
            ))}
        </div>
    );
}

export default RecentWorkspaces;

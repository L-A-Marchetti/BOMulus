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

import React, { useState, useEffect } from "react";
import { GetRecentWorkspaces, SetActiveWorkspace, DeleteWorkspace } from "../wailsjs/go/main/App";
import ListIcon from "./assets/images/list.svg";
import TrashIcon from "./assets/images/trash.svg";

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

    // Function to handle click on a workspace
    const handleWorkspaceClick = async (workspace) => {
        try {
            await SetActiveWorkspace(workspace.workspace_infos.path);
            handleToggleCompareView();
        } catch (error) {
            console.error("Error setting active workspace:", error);
        }
    };

    // Function to handle deletion of a workspace
    const handleWorkspaceDelete = async (workspace) => {
        try {
            await DeleteWorkspace(workspace.workspace_infos.path);
        } catch (error) {
            console.error("Error deleting workspace:", error);
        }
        loadRecentWorkspaces();
    };

    return recentWorkspaces.map((workspace, index) => (
        <div
            key={index}
            className="workspace-item light"
            onClick={() => handleWorkspaceClick(workspace)}
        >
            {/* Bouton de suppression */}
            <button
                className="delete-button"
                onClick={(e) => {
                    e.stopPropagation(); // Empêche de déclencher le clic du bouton principal
                    handleWorkspaceDelete(workspace);
                }}
            >
                x
            </button>
            {/* Icône et nom */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <div className="icon"><img src={ListIcon} alt="List Icon" className="icon" /></div>
                <span style={{ textAlign: "center", wordBreak: "break-word" }}>{workspace.workspace_infos.name}</span>
            </div>

        </div>
    ));

}

export default RecentWorkspaces;

/*
 * WorkspaceCreator.jsx
 * 
 * Manages the creation of new workspaces and displays recent workspaces.
 * Provides a wizard interface for users to select a directory and name for the workspace.
 *
 * Props:
 * handleToggleCompareView: Function to toggle the compare view.
 *
 * States:
 * isWizardOpen: Boolean indicating if the workspace creation wizard is open.
 * workspacePath: String representing the selected directory for the workspace.
 * workspaceName: String representing the name of the workspace to be created.
 *
 * Sub-components:
 * RecentWorkspaces: Displays a list of recently used workspaces.
 *
 * Backend Dependencies:
 * CreateWorkspace: Function to create a new workspace in the specified directory.
 * OpenDirectoryDialog: Function to open a dialog for selecting a directory.
 */

import React, { useState } from "react";
import { CreateWorkspace, OpenDirectoryDialog } from "../wailsjs/go/main/App";
import "./WorkspaceCreator.css"; // Importing the external CSS file
import RecentWorkspaces from "./RecentWorkspaces";
import AddCircleIcon from "./assets/images/add_circle.svg";
import ImportIcon from "./assets/images/import_folder.svg";
import WsName from "./assets/images/ws_name.svg";
import WsPath from "./assets/images/ws_path.svg";

function WorkspaceCreator({ handleToggleCompareView }) {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [workspacePath, setWorkspacePath] = useState("");
    const [workspaceName, setWorkspaceName] = useState("");

    // Opens the workspace creation wizard
    const openWizard = () => {
        setIsWizardOpen(true);
    };

    // Closes the wizard and resets the state
    const closeWizard = () => {
        setIsWizardOpen(false);
        setWorkspacePath("");
        setWorkspaceName("");
    };

    // Opens a directory dialog to select a workspace path
    const chooseDirectory = async () => {
        const selectedPath = await OpenDirectoryDialog();
        setWorkspacePath(selectedPath);
    };

    // Creates a new workspace with the specified path and name
    const createWorkspace = async () => {
        if (!workspacePath || !workspaceName) {
            alert("Please select a directory and enter a workspace name.");
            return;
        }

        try {
            await CreateWorkspace(workspacePath, workspaceName);
            alert("Workspace created successfully!");
            closeWizard();
        } catch (error) {
            alert(`Error creating workspace: ${error}`);
        }
    };

    return (
        <div className="container">
            {!isWizardOpen ? (
                <>
                    {/* Colonne gauche avec les boutons fixes */}
                    <div className="container">
                        <div className="content-wrapper">
                            {/* Colonne des boutons fixes */}
                            <div className="fixed-buttons">
                                <div className="workspace-item" onClick={openWizard}>
                                    <span className="icon">
                                        <img src={AddCircleIcon} alt="Add workspace" className="icon" />
                                    </span>
                                </div>
                                <div className="workspace-item" onClick={chooseDirectory}>
                                    <span className="icon">
                                        <img src={ImportIcon} alt="Open directory" className="icon" />
                                    </span>
                                </div>
                            </div>

                            {/* Grille des projets récents */}
                            <div className="workspace-grid">
                                <RecentWorkspaces handleToggleCompareView={handleToggleCompareView} />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="wizard-content">
                    <div className="input-container">
                        <span className="input-icon">
                            <img src={WsName} alt="ws name" />
                        </span>
                        <input
                            className="wizard-input"
                            type="text"
                            placeholder="Workspace Name"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                        />
                    </div>
                    <div className="input-container" onClick={chooseDirectory}>
                        <span className="input-icon">
                            <img src={WsPath} alt="ws path" />
                        </span>
                        <span className="input-wspath-text">
                            {workspacePath && workspacePath.length > 30
                                ? `...${workspacePath.slice(-30)}` // Affiche les 15 derniers caractères précédés de "..."
                                : workspacePath || "Select Workspace Path"}
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                        <div className="workspace-item" onClick={closeWizard} style={{ width: '183px' }}>
                            CANCEL
                        </div>
                        <div className="workspace-item" onClick={createWorkspace} style={{ width: '183px' }}>
                            CREATE
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default WorkspaceCreator;

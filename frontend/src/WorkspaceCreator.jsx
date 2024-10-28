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

import React, { useState } from 'react';
import { CreateWorkspace, OpenDirectoryDialog } from '../wailsjs/go/main/App';
import Button from './Button';
import './WorkspaceCreator.css'; // Importing the external CSS file
import RecentWorkspaces from './RecentWorkspaces';

// Main WorkspaceCreator component
function WorkspaceCreator({ handleToggleCompareView }) {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [workspacePath, setWorkspacePath] = useState('');
    const [workspaceName, setWorkspaceName] = useState('');

    // Opens the workspace creation wizard
    const openWizard = () => {
        setIsWizardOpen(true);
    };

    // Closes the wizard and resets the state
    const closeWizard = () => {
        setIsWizardOpen(false);
        setWorkspacePath('');
        setWorkspaceName('');
    };

    // Opens a directory dialog to select a workspace path
    const chooseDirectory = async () => {
        const selectedPath = await OpenDirectoryDialog();
        setWorkspacePath(selectedPath);
    };

    // Creates a new workspace with the specified path and name
    const createWorkspace = async () => {
        if (!workspacePath || !workspaceName) {
            alert('Please select a directory and enter a workspace name.');
            return;
        }

        try {
            await CreateWorkspace(workspacePath, workspaceName);
            alert('Workspace created successfully!');
            closeWizard();
        } catch (error) {
            alert(`Error creating workspace: ${error}`);
        }
    };

    return (
        <div className='container'>
            {!isWizardOpen ? (
                <>
                    <Button onClick={openWizard}>+ Workspace</Button>
                    <RecentWorkspaces handleToggleCompareView={handleToggleCompareView} />
                </>
            ) : (
                <div className="wizard-content">
                    <Button onClick={chooseDirectory}>Workspace Directory {workspacePath}</Button>
                    <input 
                        type="text" 
                        placeholder="Workspace Name"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                    />
                    <div>
                        <Button onClick={closeWizard}>Cancel</Button>
                        <Button onClick={createWorkspace}>Create Workspace</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkspaceCreator;

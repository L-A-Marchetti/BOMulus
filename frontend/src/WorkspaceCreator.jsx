// WorkspaceCreator.js
import React, { useState } from 'react';
import { CreateWorkspace, OpenDirectoryDialog } from '../wailsjs/go/main/App';
import Button from './Button';
import './WorkspaceCreator.css';
import RecentWorkspaces from './RecentWorkspaces';

function WorkspaceCreator() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [workspacePath, setWorkspacePath] = useState('');
    const [workspaceName, setWorkspaceName] = useState('');

    const openWizard = () => {
        setIsWizardOpen(true);
    };

    const closeWizard = () => {
        setIsWizardOpen(false);
        setWorkspacePath('');
        setWorkspaceName('');
    };

    const chooseDirectory = async () => {
        const selectedPath = await OpenDirectoryDialog();
        setWorkspacePath(selectedPath);
    };

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
                    <RecentWorkspaces />
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

// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';

export function WSCreator(): React.JSX.Element {
  const WSCreator = WSCreatorStore();

  return WSCreator.isVisible ? (
    <div>
      <input
        placeholder="Workspace name"
        value={WSCreator.workspaceName}
        onChange={(e) => WSCreator.setWorkspaceName(e.target.value)}
      />
      <p onClick={WSCreator.chooseDirectory}>
        {WSCreator.workspacePath !== ''
          ? WSCreator.workspacePath.length > 30
            ? WSCreator.workspacePath.slice(-30)
            : WSCreator.workspacePath
          : 'Select a workspace path'}
      </p>
      {WSCreator.chooseDirectoryMonitor.isLoading ? (
        <p>Directory chooser is loading...</p>
      ) : WSCreator.createWorkspaceMonitor.isLoading ? (
        <p>The workspace is being created...</p>
      ) : (
        <></>
      )}
      {WSCreator.chooseDirectoryMonitor.error != '' ? (
        <p>{WSCreator.chooseDirectoryMonitor.error}</p>
      ) : WSCreator.createWorkspaceMonitor.error != '' ? (
        <p>{WSCreator.createWorkspaceMonitor.error}</p>
      ) : (
        <></>
      )}
      <p onClick={WSCreator.toggleVisibility}>Cancel</p>
      <p onClick={WSCreator.createWorkspace}>Create</p>
    </div>
  ) : (
    <div>
      <h1 onClick={WSCreator.toggleVisibility}>Add a workspace</h1>
    </div>
  );
}

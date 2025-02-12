// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';

export function WSCreator(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();

  return WSCreator.isVisible ? (
    <div>
      <input
        placeholder="Workspace name"
        value={WSCreator.workspaceName || ''}
        onChange={(e) => WSCreator.setWorkspaceName(e.target.value)}
      />
      <p onClick={WSCreator.chooseDirectory}>
        {WSCreator.workspacePath
          ? WSCreator.workspacePath.length > 30
            ? WSCreator.workspacePath.slice(-30)
            : WSCreator.workspacePath
          : 'Select a workspace path'}
      </p>
      {WSCreator.monitor.isLoading ? (
        <p>Workspace creator module is loading...</p>
      ) : (
        <></>
      )}
      {WSCreator.monitor.error ? <p>{WSCreator.monitor.error}</p> : <></>}
      <p onClick={WSCreator.toggleVisibility}>Cancel</p>
      <p onClick={WSCreator.createWorkspace}>Create</p>
    </div>
  ) : WSChooser.isVisible ? (
    <div>
      <h1 onClick={WSCreator.toggleVisibility}>Add a workspace</h1>
    </div>
  ) : (
    <></>
  );
}

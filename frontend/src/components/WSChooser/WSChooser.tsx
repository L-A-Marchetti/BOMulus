// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { WSChooserStore } from '../../store/GlobalStore';

export function DisplayWSChooser(): React.JSX.Element {
  const isVisible = WSChooserStore((state) => state.isVisible);
  return isVisible ? <WSChooser /> : <></>;
}

export function WSChooser(): React.JSX.Element {
  const loadWorkspaces = WSChooserStore((state) => state.loadWorkspaces);
  const workspaces = WSChooserStore((state) => state.workspaces);
  const isWorkspacesLoading = WSChooserStore(
    (state) => state.workspacesMonitor.isLoading,
  );
  const workspacesLoadingError = WSChooserStore(
    (state) => state.workspacesMonitor.error,
  );

  const setActiveWorkspace = WSChooserStore(
    (state) => state.setActiveWorkspace,
  );

  const isActiveWorkspaceLoading = WSChooserStore(
    (state) => state.activeWorkspaceMonitor.isLoading,
  );
  const activeWorkspaceLoadingError = WSChooserStore(
    (state) => state.activeWorkspaceMonitor.error,
  );

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  return (
    <div>
      <h1>Choose a workspace</h1>
      {isWorkspacesLoading || isActiveWorkspaceLoading ? (
        <p>Loading workspace{isActiveWorkspaceLoading ? '' : 's'}...</p>
      ) : workspacesLoadingError || activeWorkspaceLoadingError ? (
        <p>
          Error:{' '}
          {activeWorkspaceLoadingError
            ? activeWorkspaceLoadingError
            : workspacesLoadingError}
        </p>
      ) : workspaces.length === 0 ? (
        <p>No workspaces available.</p>
      ) : (
        <ul>
          {workspaces.map((ws) => (
            <li
              key={ws.workspace_infos.name}
              onClick={() => setActiveWorkspace(ws.workspace_infos.path)}
            >
              {ws.workspace_infos.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

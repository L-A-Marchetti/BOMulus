// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { WSChooserStore } from '../../store/GlobalStore';

export function DisplayWSChooser(): React.JSX.Element {
  const isVisible = WSChooserStore((state) => state.isVisible);
  return isVisible ? <WSChooser /> : <></>;
}

export function WSChooser(): React.JSX.Element {
  const loadWorkspaces = WSChooserStore((state) => state.loadWorkspaces);
  const setActiveWorkspace = WSChooserStore(
    (state) => state.setActiveWorkspace,
  );

  const workspaces = WSChooserStore((state) => state.workspaces);
  const workspacesMonitor = WSChooserStore((state) => state.workspacesMonitor);
  const activeWorkspaceMonitor = WSChooserStore(
    (state) => state.activeWorkspaceMonitor,
  );

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  return (
    <div>
      <h1>Choose a workspace</h1>
      {workspacesMonitor.isLoading || activeWorkspaceMonitor.isLoading ? (
        <p>Loading workspace{activeWorkspaceMonitor.isLoading ? '' : 's'}...</p>
      ) : workspacesMonitor.error || activeWorkspaceMonitor.error ? (
        <p>
          Error:{' '}
          {activeWorkspaceMonitor.error
            ? activeWorkspaceMonitor.error
            : workspacesMonitor.error}
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

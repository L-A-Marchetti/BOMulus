// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { WSChooserStore } from '../../store/WSChooserStore';

export function WSChooser(): React.JSX.Element {
  const WSChooser = WSChooserStore();

  useEffect(() => {
    WSChooser.loadWorkspaces();
  }, []);

  return WSChooser.isVisible ? (
    <div>
      <h1>Choose a workspace</h1>
      {WSChooser.workspacesMonitor.isLoading ||
      WSChooser.activeWorkspaceMonitor.isLoading ? (
        <p>
          Loading workspace
          {WSChooser.activeWorkspaceMonitor.isLoading ? '' : 's'}...
        </p>
      ) : WSChooser.workspacesMonitor.error ||
        WSChooser.activeWorkspaceMonitor.error ? (
        <p>
          Error:{' '}
          {WSChooser.activeWorkspaceMonitor.error
            ? WSChooser.activeWorkspaceMonitor.error
            : WSChooser.workspacesMonitor.error}
        </p>
      ) : WSChooser.workspaces.length === 0 ? (
        <p>No workspaces available.</p>
      ) : (
        <ul>
          {WSChooser.workspaces.map((ws) => (
            <li
              key={ws.workspace_infos.name}
              onClick={() =>
                WSChooser.setActiveWorkspace(ws.workspace_infos.path)
              }
            >
              {ws.workspace_infos.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : (
    <></>
  );
}

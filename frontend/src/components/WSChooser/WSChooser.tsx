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
  const isLoading = WSChooserStore((state) => state.isLoading);
  const error = WSChooserStore((state) => state.error);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  return (
    <div>
      <h1>Choose a workspace</h1>
      {isLoading ? (
        <p>Loading workspaces...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : workspaces.length === 0 ? (
        <p>No workspaces available.</p>
      ) : (
        <ul>
          {workspaces.map((ws) => (
            <li key={ws.workspace_infos.name}>{ws.workspace_infos.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

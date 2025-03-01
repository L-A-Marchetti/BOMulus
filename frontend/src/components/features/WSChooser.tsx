// src/components/WSChooser/tsx
import React, { useEffect } from 'react';
import { WSChooserStore } from '../../store/WSChooserStore';
import WorkspaceCard from '../shared/WorkspaceCard';
import WorkspaceSkeleton from '../shared/WorkspaceSkeleton';
import { useShallow } from 'zustand/react/shallow';
import { WSDelete } from './WSDelete';

export function WSChooser(): React.JSX.Element {
  const { isVisible, workspaces, setActiveWorkspace, setWorkspaceToDelete } =
    WSChooserStore(
      useShallow((state) => ({
        isVisible: state.isVisible,
        workspaces: state.workspaces,
        setActiveWorkspace: state.setActiveWorkspace,
        setWorkspaceToDelete: state.setWorkspaceToDelete,
      })),
    );

  const skeletons = Math.max(6 - (workspaces?.length || 0), 0);

  useEffect(() => {
    console.log('WSChooser', workspaces);
  }, []);

  return (
    <div className={`workspace_chooser ${isVisible ? '' : 'hidden'}`}>
      {workspaces?.map((ws) => (
        <WorkspaceCard
          key={ws.ID}
          workspaceName={ws.workspace_infos.name}
          openWs={() => setActiveWorkspace(ws)}
          deleteWs={() => setWorkspaceToDelete(ws)}
        />
      ))}
      {Array.from({ length: skeletons }, (_, i) => (
        <WorkspaceSkeleton key={`skeleton-${i}`} />
      ))}
      <WSDelete />
    </div>
  );
}

// src/components/WSChooser/WSChooser.tsx
import React, { useEffect, useState } from 'react';
import { WSChooserStore } from '../../store/WSChooserStore';
import Modal from '../shared/Modal';
import WorkspaceCard from '../shared/WorkspaceCard';
import { WSCreator } from './WSCreator';
import Spinner from '../shared/Spinner';
import WorkspaceSkeleton from '../shared/WorkspaceSkeleton';
import Error from '../shared/Error';

export function WSChooser(): React.JSX.Element {
  const WSChooser = WSChooserStore();
  const skeletons = Math.max(6 - (WSChooser.workspaces?.length || 0), 0);

  useEffect(() => {
    WSChooser.loadWorkspaces();
  }, []);

  return WSChooser.isVisible ? (
    <div
      className={`flex items-center justify-start w-full h-full gap-8 flex-wrap max-w-212`}
    >
      {WSChooser.workspaces?.map((ws) => (
        <WorkspaceCard
          key={ws.ID}
          workspaceName={ws.workspace_infos.name}
          openWs={() => WSChooser.setActiveWorkspace(ws)}
          deleteWs={() => WSChooser.setWorkspaceToDelete(ws)}
        />
      ))}
      {Array.from({ length: skeletons }, (_, i) => (
        <WorkspaceSkeleton key={`skeleton-${i}`} />
      ))}
      {WSChooser.workspaceToDelete ? (
        <Modal
          title={`Delete ${WSChooser.workspaceToDelete?.workspace_infos.name}?`}
          text={`Are you sure you want to delete the workspace ${WSChooser.workspaceToDelete?.workspace_infos.name}? This action is irreversible and will permanently remove all associated data. Proceed with caution.`}
          onCancel={() => {
            WSChooser.setWorkspaceToDelete(null);
          }}
          onConfirm={() => {
            WSChooser.deleteWorkspace();
          }}
        />
      ) : (
        <></>
      )}
      {WSChooser.monitor.isLoading ? (
        <Spinner text="Workspace module is loading..." />
      ) : (
        <></>
      )}
      {WSChooser.monitor.error ? (
        <Error
          title="Error"
          text={WSChooser.monitor.error}
          onCancel={() => {
            WSChooser.resetMonitor();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
}

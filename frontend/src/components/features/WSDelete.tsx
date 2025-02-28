// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSChooserStore } from '../../store/WSChooserStore';
import { useShallow } from 'zustand/react/shallow';
import Modal from '../shared/Modal';

export function WSDelete(): React.JSX.Element {
  const { setWorkspaceToDelete, workspaceToDelete, deleteWorkspace } =
    WSChooserStore(
      useShallow((state) => ({
        setWorkspaceToDelete: state.setWorkspaceToDelete,
        workspaceToDelete: state.workspaceToDelete,
        deleteWorkspace: state.deleteWorkspace,
      })),
    );

  return (
    <>
      {workspaceToDelete ? (
        <Modal
          title={`Delete ${workspaceToDelete?.workspace_infos.name}?`}
          text={`Are you sure you want to delete the workspace ${workspaceToDelete?.workspace_infos.name}? This action is irreversible and will permanently remove all associated data. Proceed with caution.`}
          onCancel={() => {
            setWorkspaceToDelete(null);
          }}
          onConfirm={() => {
            deleteWorkspace();
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}

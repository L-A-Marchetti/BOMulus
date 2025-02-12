// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import { FileManagerStore } from '../../store/FileManagerStore';

export function WSCurrent(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();
  const FileManager = FileManagerStore();

  return !WSCreator.isVisible && !WSChooser.isVisible ? (
    <div>
      <p>
        Current Workspace {WSChooser.activeWorkspace?.workspace_infos.name}{' '}
        <span
          onClick={() => {
            WSChooser.loadWorkspaces();
            WSChooser.toggleVisibility();
            {
              FileManager.isVisible ? FileManager.toggleVisibility() : {};
            }
          }}
        >
          x
        </span>
      </p>
    </div>
  ) : (
    <></>
  );
}

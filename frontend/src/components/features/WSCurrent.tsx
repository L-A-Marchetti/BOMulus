// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import { FileManagerStore } from '../../store/FileManagerStore';
import { CompareViewStore } from '../../store/CompareViewStore';

export function WSCurrent(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();
  const FileManager = FileManagerStore();
  const CompareView = CompareViewStore();

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
              CompareView.isVisible ? CompareView.toggleVisibility() : {};
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

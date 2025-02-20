// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import { FileManagerStore } from '../../store/FileManagerStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Banner from '../shared/Banner';
import { SettingsStore } from '../../store/SettingsStore';

export function WSCurrent(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();
  const FileManager = FileManagerStore();
  const CompareView = CompareViewStore();
  const Settings = SettingsStore();

  return !WSCreator.isVisible &&
    !WSChooser.isVisible &&
    !FileManager.isVisible &&
    !Settings.isVisible ? (
    <div className="flex items-center justify-center w-full mt-8 px-8">
      <Banner
        text={`Current Workspace ${WSChooser.activeWorkspace?.workspace_infos.name}`}
        onClick={() => {
          WSChooser.loadWorkspaces();
          WSChooser.toggleVisibility();
          {
            FileManager.isVisible ? FileManager.toggleVisibility() : {};
            CompareView.isVisible ? CompareView.toggleVisibility() : {};
          }
        }}
      />
    </div>
  ) : (
    <></>
  );
}

// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import { useEffect } from 'react';
import { FileManagerStore } from '../../store/FileManagerStore';
import Button from '../shared/Button';
import ValidationTable from '../shared/ValidationTable';
import { CompareViewStore } from '../../store/CompareViewStore';
import { SettingsStore } from '../../store/SettingsStore';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';
import { useShallow } from 'zustand/react/shallow';
import { FilesList } from './FilesList';

export function FileManager(): React.JSX.Element {
  console.log('FileManager');
  const { isVisible: isWSCreatorVisible } = WSCreatorStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
    })),
  );

  const { isVisible: isWSChooserVisible, activeWorkspace } = WSChooserStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      activeWorkspace: state.activeWorkspace,
    })),
  );

  const {
    isVisible: isFileManagerVisible,
    filesToValidate,
    toggleVisibility: toggleFMVisibility,
    loadFiles,
  } = FileManagerStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      filesToValidate: state.filesToValidate,
      toggleVisibility: state.toggleVisibility,
      loadFiles: state.loadFiles,
    })),
  );

  const {
    isVisible: isCompareViewVisible,
    toggleVisibility: toggleCVVisibility,
  } = CompareViewStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      toggleVisibility: state.toggleVisibility,
    })),
  );

  const { isVisible: isSettingsVisible } = SettingsStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
    })),
  );

  const { isVisible: isFunctionManagerVisible } = FunctionManagerStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
    })),
  );

  useEffect(() => {
    loadFiles();
  }, [activeWorkspace]);

  return !isWSCreatorVisible &&
    !isWSChooserVisible &&
    !isSettingsVisible &&
    !isFunctionManagerVisible ? (
    <div className="flex flex-col gap-8 w-full">
      {isFileManagerVisible ? (
        filesToValidate ? (
          <ValidationTable />
        ) : (
          <FilesList />
        )
      ) : (
        <div className="px-8">
          <Button
            onClick={() => {
              toggleFMVisibility();
              if (isCompareViewVisible) toggleCVVisibility();
            }}
            text="File Manager"
            bg="bg-neutral-700"
            bgHover="hover:bg-neutral-900"
            txtColor="text-neutral-400"
            h="h-15"
            img={null}
          />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

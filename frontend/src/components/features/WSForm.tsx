// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import Input from '../shared/Input';
import InputFile from '../shared/InputFile';
import Button from '../shared/Button';

export function WSForm(): React.JSX.Element {
  const {
    setWorkspaceName,
    workspaceName,
    chooseDirectory,
    workspacePath,
    toggleVisibility,
    createWorkspace,
  } = WSCreatorStore(
    useShallow((state) => ({
      setWorkspaceName: state.setWorkspaceName,
      workspaceName: state.workspaceName,
      chooseDirectory: state.chooseDirectory,
      workspacePath: state.workspacePath,
      toggleVisibility: state.toggleVisibility,
      createWorkspace: state.createWorkspace,
    })),
  );

  return (
    <div className="w-full flex flex-col gap-8">
      <Input
        placeHolder="Workspace name"
        type="text"
        onChange={setWorkspaceName}
        value={workspaceName || ''}
        h="h-15"
      />
      <InputFile
        onClick={chooseDirectory}
        h="h-15"
        value={
          workspacePath
            ? workspacePath.length > 30
              ? workspacePath.slice(-30)
              : workspacePath
            : ''
        }
        placeHolder="Select a workspace path"
      />
      <div className="flex gap-8">
        <Button
          onClick={toggleVisibility}
          text="Cancel"
          bg="bg-neutral-700"
          bgHover="hover:bg-neutral-900"
          txtColor="text-neutral-400"
          h="h-15"
          img={null}
        />
        <Button
          onClick={createWorkspace}
          text="Create"
          bg="bg-emerald-700"
          bgHover="hover:bg-emerald-900"
          txtColor="text-white"
          h="h-15"
          img={null}
        />
      </div>
    </div>
  );
}

// src/components/WSChooser/WSChooser.tsx
import React, { useState } from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import DarkCard from '../shared/DarkCard';
import Input from '../shared/Input';
import InputFile from '../shared/InputFile';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Error from '../shared/Error';

export function WSCreator(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();

  return WSCreator.isVisible ? (
    <div className="w-full flex flex-col gap-8">
      <Input
        placeHolder="Workspace name"
        type="text"
        onChange={WSCreator.setWorkspaceName}
        value={WSCreator.workspaceName || ''}
        h="h-15"
      />
      <InputFile
        onClick={WSCreator.chooseDirectory}
        h="h-15"
        value={
          WSCreator.workspacePath
            ? WSCreator.workspacePath.length > 30
              ? WSCreator.workspacePath.slice(-30)
              : WSCreator.workspacePath
            : ''
        }
        placeHolder="Select a workspace path"
      />
      {WSCreator.monitor.isLoading ? (
        <Spinner text="Workspace creator module is loading..." />
      ) : (
        <></>
      )}
      {WSCreator.monitor.error ? (
        <Error
          title="Error"
          text={WSCreator.monitor.error}
          onCancel={() => {
            WSCreator.resetMonitor();
          }}
        />
      ) : (
        <></>
      )}
      <div className="flex gap-8">
        <Button
          onClick={WSCreator.toggleVisibility}
          text="Cancel"
          bg="bg-neutral-700"
          bgHover="hover:bg-neutral-900"
          txtColor="text-neutral-400"
          h="h-15"
          img={null}
        />
        <Button
          onClick={WSCreator.createWorkspace}
          text="Create"
          bg="bg-emerald-700"
          bgHover="hover:bg-emerald-900"
          txtColor="text-white"
          h="h-15"
          img={null}
        />
      </div>
    </div>
  ) : WSChooser.isVisible ? (
    <div className="mr-8">
      <DarkCard addWs={WSCreator.toggleVisibility} importWs={() => {}} />
    </div>
  ) : (
    <></>
  );
}

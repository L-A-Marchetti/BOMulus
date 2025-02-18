// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import DarkCard from '../shared/DarkCard';
import Input from '../shared/Input';
import InputFile from '../shared/InputFile';
import Button from '../shared/Button';

export function WSCreator(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();

  return WSCreator.isVisible ? (
    <div className="w-full flex flex-col gap-3">
      <Input
        placeHolder="Workspace name"
        type="text"
        onChange={WSCreator.setWorkspaceName}
        value={WSCreator.workspaceName || ''}
      />
      <InputFile
        onClick={WSCreator.chooseDirectory}
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
        <p>Workspace creator module is loading...</p>
      ) : (
        <></>
      )}
      {WSCreator.monitor.error ? <p>{WSCreator.monitor.error}</p> : <></>}
      <div className='flex gap-3'>
      <Button onClick={WSCreator.toggleVisibility} text="Cancel" bg='bg-neutral-700' bgHover='hover:bg-neutral-900' txtColor='text-neutral-400'/>
      <Button onClick={WSCreator.createWorkspace} text="Create" bg='bg-emerald-700' bgHover='hover:bg-emerald-900' txtColor='text-white'/>
      </div>
    </div>
  ) : WSChooser.isVisible ? (
    <div className='mr-8'>
      <DarkCard addWs={WSCreator.toggleVisibility} importWs={() => {}} />
    </div>
  ) : (
    <></>
  );
}

// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import { useEffect } from 'react';
import { FileManagerStore } from '../../store/FileManagerStore';
import UploadValidation from '../shared/UploadValidation';

export function FileManager(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();
  const FileManager = FileManagerStore();

  useEffect(() => {
    FileManager.loadFiles();
  }, [WSChooser.activeWorkspace]);

  return !WSCreator.isVisible && !WSChooser.isVisible ? (
    <div>
      <p onClick={() => FileManager.toggleVisibility()}>File Manager</p>
      {FileManager.isVisible ? (
        <>
          <p onClick={() => FileManager.uploadFiles()}>Import files</p>
          {FileManager.monitor.isLoading ? (
            <p>File Manager is loading...</p>
          ) : FileManager.monitor.error ? (
            FileManager.monitor.error
          ) : (
            <>
              <ul>
                {FileManager.files?.map((file) => (
                  <li key={file.version_tag}>
                    v{file.version_tag}{' '}
                    <span
                      onClick={() => {
                        FileManager.selectFile(file);
                      }}
                    >
                      {file.name}
                    </span>{' '}
                    <span
                      onClick={() => {
                        FileManager.moveFile('-', file);
                      }}
                    >
                      ▴
                    </span>{' '}
                    <span
                      onClick={() => {
                        FileManager.moveFile('+', file);
                      }}
                    >
                      ▾
                    </span>{' '}
                    <span onClick={() => FileManager.deleteFile(file)}>x</span>
                    {FileManager.selectedFiles[0] === file ? (
                      <span> 1</span>
                    ) : FileManager.selectedFiles[1] === file ? (
                      <span> 2</span>
                    ) : (
                      <></>
                    )}
                  </li>
                ))}
              </ul>
              {FileManager.filesToValidate ? <UploadValidation /> : <></>}
            </>
          )}
          {FileManager.compareMonitor.isLoading ? (
            <p>Comparison module is loading...</p>
          ) : (
            <p
              onClick={() => {
                FileManager.compare();
              }}
            >
              Compare
            </p>
          )}
          {FileManager.compareMonitor.error ? (
            <p>{FileManager.compareMonitor.error}</p>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
}

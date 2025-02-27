// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import { useEffect } from 'react';
import { FileManagerStore } from '../../store/FileManagerStore';
import Button from '../shared/Button';
import Files from '../shared/Files';
import Spinner from '../shared/Spinner';
import navigate_next from '/src/assets/images/navigate_next.svg';
import ValidationTable from '../shared/ValidationTable';
import { AnalysisStore } from '../../store/AnalysisStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import { SettingsStore } from '../../store/SettingsStore';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';

export function FileManager(): React.JSX.Element {
  const WSCreator = WSCreatorStore();
  const WSChooser = WSChooserStore();
  const FileManager = FileManagerStore();
  const CompareView = CompareViewStore();
  const Settings = SettingsStore();
  const FunctionManager = FunctionManagerStore();

  useEffect(() => {
    FileManager.loadFiles();
  }, [WSChooser.activeWorkspace]);

  return !WSCreator.isVisible &&
    !WSChooser.isVisible &&
    !Settings.isVisible &&
    !FunctionManager.isVisible ? (
    <div className=" flex flex-col gap-8 w-full">
      {FileManager.isVisible ? (
        FileManager.filesToValidate ? (
          <ValidationTable />
        ) : (
          <>
            <div className="flex gap-8">
              <Button
                onClick={() => {
                  FileManager.toggleVisibility();
                  CompareView.toggleVisibility();
                }}
                text="Back"
                bg="bg-neutral-700"
                bgHover="hover:bg-neutral-900"
                txtColor="text-neutral-400"
                h="h-20"
                img={null}
              />
              <Button
                onClick={FileManager.uploadFiles}
                text="Import files"
                bg="bg-neutral-700"
                bgHover="hover:bg-neutral-900"
                txtColor="text-neutral-400"
                h="h-20"
                img={null}
              />
            </div>
            {FileManager.monitor.error ? (
              FileManager.monitor.error
            ) : (
              <>
                {FileManager.monitor.isLoading ? (
                  <Spinner text="File Manager is loading..." />
                ) : (
                  <></>
                )}
                <div className="flex flex-col gap-4">
                  {FileManager.files?.map((file) =>
                    FileManager.selectedFiles[0] === file ||
                    FileManager.selectedFiles[1] === file ? (
                      <div className="w-full h-15 border-3 border-neutral-600 bg-neutral-700 rounded-lg animate-pulse"></div>
                    ) : (
                      <Files file={file} key={file.ID} />
                    ),
                  )}
                  <hr className="my-4 text-neutral-600" />
                  <div className="flex gap-3">
                    {FileManager.selectedFiles[0] ? (
                      <Files file={FileManager.selectedFiles[0]} />
                    ) : (
                      <div className="w-full h-15 border-3 border-neutral-600 bg-neutral-700 rounded-lg animate-pulse"></div>
                    )}
                    <div className="flex w-20 justify-center items-center">
                      <img src={navigate_next} />
                    </div>
                    {FileManager.selectedFiles[1] ? (
                      <Files file={FileManager.selectedFiles[1]} />
                    ) : (
                      <div className="w-full h-15 border-3 border-neutral-600 bg-neutral-700 rounded-lg animate-pulse"></div>
                    )}
                  </div>
                </div>
              </>
            )}
            {FileManager.compareMonitor.isLoading ? (
              <Spinner text="Comparison module is loading..." />
            ) : (
              <Button
                onClick={FileManager.compare}
                text="Compare"
                bg="bg-neutral-700"
                bgHover="hover:bg-neutral-900"
                txtColor="text-neutral-400"
                h="h-20"
                img={null}
              />
            )}
            {FileManager.compareMonitor.error ? (
              <p>{FileManager.compareMonitor.error}</p>
            ) : (
              <></>
            )}
          </>
        )
      ) : (
        <Button
          onClick={() => {
            FileManager.toggleVisibility();
            if (CompareView.isVisible) CompareView.toggleVisibility();
          }}
          text="File Manager"
          bg="bg-neutral-700"
          bgHover="hover:bg-neutral-900"
          txtColor="text-neutral-400"
          h="h-20"
          img={null}
        />
      )}
    </div>
  ) : (
    <></>
  );
}

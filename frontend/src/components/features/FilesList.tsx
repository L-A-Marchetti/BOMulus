// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSChooserStore } from '../../store/WSChooserStore';
import { useShallow } from 'zustand/react/shallow';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Files from '../shared/Files';
import navigate_next from '/src/assets/images/navigate_next.svg';
import { FileManagerStore } from '../../store/FileManagerStore';
import { CompareViewStore } from '../../store/CompareViewStore';

export function FilesList(): React.JSX.Element {
  const {
    files,
    selectedFiles,
    toggleVisibility: toggleFMVisibility,
    uploadFiles,
    compare,
  } = FileManagerStore(
    useShallow((state) => ({
      files: state.files,
      selectedFiles: state.selectedFiles,
      toggleVisibility: state.toggleVisibility,
      uploadFiles: state.uploadFiles,
      compare: state.compare,
    })),
  );

  const {
    isVisible: isCompareViewVisible,
    components,
    toggleVisibility: toggleCVVisibility,
  } = CompareViewStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      components: state.components,
      toggleVisibility: state.toggleVisibility,
    })),
  );

  return (
    <div className="px-8 flex flex-col gap-8">
      <div className="flex gap-8">
        <Button
          onClick={() => {
            toggleFMVisibility();
            if (components && !isCompareViewVisible) toggleCVVisibility();
          }}
          text="Back"
          bg="bg-neutral-700"
          bgHover="hover:bg-neutral-900"
          txtColor="text-neutral-400"
          h="h-15"
          img={null}
        />
        <Button
          onClick={uploadFiles}
          text="Import files"
          bg="bg-neutral-700"
          bgHover="hover:bg-neutral-900"
          txtColor="text-neutral-400"
          h="h-15"
          img={null}
        />
      </div>
      <div className="flex flex-col gap-4">
        {files?.map((file) =>
          selectedFiles[0] === file || selectedFiles[1] === file ? (
            <div
              key={file.ID}
              className="w-full h-15 border-3 border-neutral-600 bg-neutral-700 rounded-lg animate-pulse"
            ></div>
          ) : (
            <Files file={file} key={file.ID} />
          ),
        )}
        <hr className="my-4 text-neutral-600" />
        <div className="flex gap-3">
          {selectedFiles[0] ? (
            <Files key={selectedFiles[0].ID} file={selectedFiles[0]} />
          ) : (
            <div className="w-full h-15 border-3 border-neutral-600 bg-neutral-700 rounded-lg animate-pulse"></div>
          )}
          <div className="flex w-20 justify-center items-center">
            <img src={navigate_next} />
          </div>
          {selectedFiles[1] ? (
            <Files key={selectedFiles[1].ID} file={selectedFiles[1]} />
          ) : (
            <div className="w-full h-15 border-3 border-neutral-600 bg-neutral-700 rounded-lg animate-pulse"></div>
          )}
        </div>
      </div>
      <Button
        onClick={compare}
        text="Compare"
        bg="bg-neutral-700"
        bgHover="hover:bg-neutral-900"
        txtColor="text-neutral-400"
        h="h-15"
        img={null}
      />
    </div>
  );
}

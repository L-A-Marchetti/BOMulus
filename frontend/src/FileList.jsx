import React from 'react';
import Button from './Button';
import './FileManager.css';

// Renders a list of files with selection functionality
const FileList = ({ files, selectedFiles, onSelectFile }) => {
  const getFileName = (filePath) => filePath.split('/').pop().split('\\').pop();

  return (
    <>
      {files.map((file) => (
        <Button 
          key={file.path} 
          onClick={() => onSelectFile(file)} 
          className={`file-button ${selectedFiles.includes(file) ? 'selected' : ''}`}
        >
          {selectedFiles.includes(file) 
            ? `${selectedFiles.length === 1 ? "single" : selectedFiles.indexOf(file) === 0 ? "v1" : "v2"} ${getFileName(file.path)}`
            : getFileName(file.path)}
        </Button>
      ))}
    </>
  );
};

export default FileList;

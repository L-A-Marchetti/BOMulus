/*
 * FileList.jsx
 * 
 * Renders a list of files with selection functionality.
 * Allows users to select files and displays their names.
 *
 * Props:
 * files: Array of file objects to display.
 * selectedFiles: Array of currently selected file objects.
 * onSelectFile: Function called when a file is selected.
 */

import React from 'react';
import Button from './Button';
import './FileManager.css'; // Importing the external CSS file

// Renders a list of files with selection functionality
const FileList = ({ files, selectedFiles, onSelectFile }) => {
    // Extracts the file name from the file path
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

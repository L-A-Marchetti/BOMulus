/*
 * FileManager.jsx
 * 
 * Manages file operations within the workspace, allowing users to view,
 * add, and select files for comparison.
 *
 * Props: None
 *
 * Sub-components:
 * FileList: Displays existing files and handles selection.
 * Button: Reusable button for actions.
 *
 * States:
 * selectedFile: The file currently selected for addition.
 * existingFiles: List of files currently in the workspace.
 * selectedFiles: Up to two files selected for comparison.
 *
 * Backend Dependencies:
 * OpenFileDialog: Opens a file selection dialog.
 * AddFileToWorkspace: Adds a file to the workspace.
 * GetFilesInWorkspaceInfo: Retrieves existing files info.
 * BtnCompare: Compares selected files.
 */

import React, { useState, useEffect } from 'react';
import { OpenFileDialog, AddFileToWorkspace, GetFilesInWorkspaceInfo, BtnCompare } from '../wailsjs/go/main/App';
import Button from './Button';
import FileList from './FileList';
import './FileManager.css';

// Main component for managing files in the workspace
function FileManager() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load existing files on component mount
  useEffect(() => {
    loadExistingFiles();
  }, []);

  // Fetch and set existing files from the workspace
  const loadExistingFiles = async () => {
    try {
      const files = await GetFilesInWorkspaceInfo();
      setExistingFiles(files || []);
    } catch (error) {
      console.error("Failed to load existing files:", error);
      setExistingFiles([]);
    }
  };

  // Handle file selection using the OpenFileDialog
  const handleFileSelection = async () => {
    try {
      const filePath = await OpenFileDialog();
      if (filePath) setSelectedFile(filePath);
    } catch (error) {
      console.error("Error selecting file:", error);
      alert("Failed to select file");
    }
  };

  // Add the selected file to the workspace
  const handleAddFile = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    try {
      await AddFileToWorkspace(selectedFile);
      alert("File added successfully");
      setSelectedFile(null);
      loadExistingFiles();
    } catch (error) {
      console.error("Error adding file to workspace:", error);
      alert("Failed to add file to workspace");
    }
  };

  // Toggle file selection for comparison
  const handleSelectFile = (file) => {
    setSelectedFiles(prevSelected => {
      if (prevSelected.includes(file)) {
        return prevSelected.filter(f => f !== file);
      } else if (prevSelected.length < 2) {
        return [...prevSelected, file];
      }
      return prevSelected;
    });
  };

  // Initiate file comparison
  const handleCompare = async () => {
    if (selectedFiles.length === 1) {
      await BtnCompare(selectedFiles[0].components, null);
    } else if (selectedFiles.length === 2) {
      await BtnCompare(selectedFiles[0].components, selectedFiles[1].components);
    } else {
      alert("Please select 1 or 2 files for comparison.");
    }
  };

  return (
    <div className='file-manager'>
      <h4 className='file-manager-header'>File Manager</h4>
      <div className='file-list-container'>
        {existingFiles.length > 0 ? (
          <FileList 
            files={existingFiles} 
            selectedFiles={selectedFiles} 
            onSelectFile={handleSelectFile} 
            loadExistingFiles={loadExistingFiles}
          />
        ) : (
          <p>No files found in the workspace.</p>
        )}
        <Button onClick={handleFileSelection} className='full-width-button'>
          {selectedFile ? selectedFile.split('/').pop().split('\\').pop() : "+ BOM"}
        </Button>
        {selectedFile && (
          <Button onClick={handleAddFile} className='full-width-button'>Add to Workspace</Button>
        )}
        <Button 
          onClick={handleCompare} 
          disabled={selectedFiles.length === 0} 
          className='full-width-button'
        >
          Compare Selected Files
        </Button>
      </div>
    </div>
  );
}

export default FileManager;
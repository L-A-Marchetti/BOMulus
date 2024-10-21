import React, { useState, useEffect } from 'react';
import { OpenFileDialog, AddFileToWorkspace, GetFilesInWorkspaceInfo, BtnCompare } from '../wailsjs/go/main/App';
import Button from './Button';
import './AddFileToWorkspace.css';

function AddFileToWorkspaceComp() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingFiles, setExistingFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        loadExistingFiles();
    }, []);

    const loadExistingFiles = async () => {
        try {
            const files = await GetFilesInWorkspaceInfo();
            setExistingFiles(files || []);
        } catch (error) {
            console.error("Failed to load existing files:", error);
            setExistingFiles([]);
        }
    };

    const handleFileSelection = async () => {
        try {
            const filePath = await OpenFileDialog();
            if (filePath) {
                setSelectedFile(filePath);
            }
        } catch (error) {
            console.error("Error selecting file:", error);
            alert("Failed to select file");
        }
    };

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

    const handleSelectFile = (file) => {
        if (selectedFiles.includes(file)) {
            setSelectedFiles(selectedFiles.filter(f => f !== file));
        } else {
            if (selectedFiles.length < 2) {
                setSelectedFiles([...selectedFiles, file]);
            }
        }
    };

    const handleCompare = async () => {
        if (selectedFiles.length >= 1 && selectedFiles.length <= 2) {
            if (selectedFiles.length === 2) {
                await BtnCompare(selectedFiles[0].components, selectedFiles[1].components);
            } else if (selectedFiles.length === 1) {
                await BtnCompare(selectedFiles[0].components, null);
            }
        } else {
            alert("Please select 1 or 2 files for comparison.");
        }
    };

    const getFileName = (filePath) => {
        return filePath.split('/').pop().split('\\').pop();
    };

    return (
        <div className='file-manager' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h4 style={{
                padding: '20px',
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: 'rgb(39, 39, 39)',
                margin: 0,
                position: 'sticky',
                top: 0,
                zIndex: 1
            }}>
                File Manager
            </h4>
            <div style={{ overflowY: 'auto', flexGrow: 1, padding: '10px' }}>
                {existingFiles && existingFiles.length > 0 ? (
                    <>
                        {existingFiles.map((file) => (
                            <Button 
                                key={file.path} 
                                onClick={() => handleSelectFile(file)} 
                                style={{ 
                                    backgroundColor: selectedFiles.includes(file) ? 'blue' : 'transparent',
                                    width: '100%',
                                    textAlign: 'left',
                                    marginBottom: '5px'
                                }}
                            >
                                {selectedFiles.includes(file) ? 
                                    (selectedFiles.length === 1 ? "single" : selectedFiles.indexOf(file) === 0 ? "v1" : "v2") + " " + getFileName(file.path)
                                    : getFileName(file.path)}
                            </Button>
                        ))}
                    </>
                ) : (
                    <p>No files found in the workspace.</p>
                )}
                <Button onClick={handleFileSelection} style={{ width: '100%', marginBottom: '5px' }}>
                    {selectedFile ? getFileName(selectedFile) : "+ BOM"}
                </Button>
                {selectedFile && (
                    <Button onClick={handleAddFile} style={{ width: '100%', marginBottom: '5px' }}>Add to Workspace</Button>
                )}
                <Button onClick={handleCompare} disabled={selectedFiles.length === 0} style={{ width: '100%', marginBottom: '5px' }}>
                    Compare Selected Files
                </Button>
            </div>
        </div>
    );
}

export default AddFileToWorkspaceComp;
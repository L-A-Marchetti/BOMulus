// AddFileToWorkspaceComponent.js
import React, { useState, useEffect } from 'react';
import { OpenFileDialog, AddFileToWorkspace, GetFilesInWorkspaceInfo } from '../wailsjs/go/main/App';
import Button from './Button';
import './AddFileToWorkspace.css';

function AddFileToWorkspaceComp() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingFiles, setExistingFiles] = useState([]); // Initialisé comme un tableau vide

    // Charger les fichiers existants lors du montage du composant
    useEffect(() => {
        loadExistingFiles();
    }, []);

    const loadExistingFiles = async () => {
        try {
            const files = await GetFilesInWorkspaceInfo();
            setExistingFiles(files || []); // Assurez-vous que c'est un tableau
        } catch (error) {
            console.error("Failed to load existing files:", error);
            setExistingFiles([]); // Réinitialiser en cas d'erreur
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
            loadExistingFiles(); // Recharger les fichiers existants après ajout
        } catch (error) {
            console.error("Error adding file to workspace:", error);
            alert("Failed to add file to workspace");
        }
    };

    // Fonction pour extraire le nom du fichier à partir du chemin complet
    const getFileName = (filePath) => {
        return filePath.split('/').pop().split('\\').pop(); // Gérer à la fois les chemins Unix et Windows
    };

    return (
        <div className='file-manager'>
            <h4>File Manager</h4>
            {existingFiles && existingFiles.length > 0 ? (
                <>
                    {existingFiles.map((file) => (
                        <Button>{file.name}</Button> // Assurez-vous que `file` a une propriété `name`
                    ))}
                </>
            ) : (
                <p>No files found in the workspace.</p>
            )}
            <Button onClick={handleFileSelection}>
                {selectedFile ? getFileName(selectedFile) : "+ BOM"}
            </Button>
            {selectedFile && (
                <Button onClick={handleAddFile}>Add to Workspace</Button>
            )}
        </div>
    );
}

export default AddFileToWorkspaceComp;

/*
 * FileManager.jsx
 *
 * Gère les opérations de fichiers dans l'espace de travail, permettant aux utilisateurs de sélectionner des fichiers pour la comparaison.
 *
 * Props: Aucune
 *
 * États:
 * existingFiles: Liste des fichiers actuellement dans l'espace de travail.
 * selectedFiles: Jusqu'à deux fichiers sélectionnés pour la comparaison.
 *
 * Dépendances Backend:
 * OpenFileDialog: Ouvre une boîte de dialogue de sélection de fichier.
 * AddFileToWorkspace: Ajoute un fichier à l'espace de travail.
 * GetFilesInWorkspaceInfo: Récupère les informations des fichiers existants.
 * BtnCompare: Compare les fichiers sélectionnés.
 */

import React, { useState, useEffect } from "react";
import {
  OpenFileDialog,
  AddFileToWorkspace,
  GetFilesInWorkspaceInfo,
  BtnCompare,
} from "../wailsjs/go/main/App";
import "./FileManager.css";
import AddBom from "./assets/images/add_bom.svg";

function FileManager() {
  const [existingFiles, setExistingFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([null, null]); // [v1, v2]

  // Charger les fichiers existants au montage du composant
  useEffect(() => {
    loadExistingFiles();
  }, []);

  const loadExistingFiles = async () => {
    try {
      const files = await GetFilesInWorkspaceInfo();
      setExistingFiles(files || []);
    } catch (error) {
      console.error("Échec du chargement des fichiers existants :", error);
      setExistingFiles([]);
    }
  };

  const handleFileSelection = async () => {
    try {
      const filePath = await OpenFileDialog();
      if (filePath) {
        await AddFileToWorkspace(filePath);
        alert("Fichier ajouté avec succès");
        loadExistingFiles();
      }
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier :", error);
      alert("Échec de la sélection du fichier");
    }
  };

  const handleCompare = async () => {
    if (!selectedFiles[0] && !selectedFiles[1]) {
      alert("Veuillez sélectionner au moins un fichier pour la comparaison.");
      return;
    }

    try {
      if (selectedFiles[0] && !selectedFiles[1]) {
        await BtnCompare(selectedFiles[0].components, null);
      } else {
        await BtnCompare(selectedFiles[0].components, selectedFiles[1].components);
      }
    } catch (error) {
      console.error("La comparaison a échoué :", error);
      alert(`La comparaison a échoué : ${error.message || "Erreur inconnue"}`);
    }
  };



  const handleSelectBom = (index, fileName) => {
    const file = existingFiles.find((f) => f.name === fileName);
    if (file) {
      const updatedSelectedFiles = [...selectedFiles];
      updatedSelectedFiles[index] = file;
      setSelectedFiles(updatedSelectedFiles);
    } else {
      alert("Fichier non trouvé dans l'espace de travail.");
    }
  };


  return (
    <div className="file-manager">
      <div className="file-manager-grid">
        {/* Bouton Ajouter BOM */}
        <button onClick={handleFileSelection} className="button">
          <img src={AddBom} alt="Ajouter BOM" style={{ width: "20px", height: "20px" }} />
        </button>

        {/* Dropdown V1 */}
        <div className="file-version v1">
          <div className="file-version-row">
            <p className="version-label">v1</p>
            <select
              className="file-select-dropdown"
              value={selectedFiles[0]?.name || ""}
              onChange={(e) => handleSelectBom(0, e.target.value)}
            >
              <option value="" disabled>
                Sélectionnez le premier BOM
              </option>
              {existingFiles.map((file, index) => (
                <option key={index} value={file.name}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropdown V2 */}
        <div className="file-version v2">
          <div className="file-version-row">
            <p className="version-label">v2</p>
            <select
              className="file-select-dropdown"
              value={selectedFiles[1]?.name || ""}
              onChange={(e) => handleSelectBom(1, e.target.value)}
            >
              <option value="" disabled>
                Sélectionnez le second BOM
              </option>
              {existingFiles.map((file, index) => (
                <option key={index} value={file.name}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton OK */}
        <button onClick={handleCompare} className="button">
          OK
        </button>


      </div>
    </div>
  );
}

export default FileManager;

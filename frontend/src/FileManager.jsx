import React, { useState, useEffect } from "react";
import {
  OpenFileDialog,
  AddFileToWorkspace,
  GetFilesInWorkspaceInfo,
  BtnCompare,
  GetComponents,
} from "../wailsjs/go/main/App";
import "./FileManager.css";
import AddBom from "./assets/images/add_bom.svg";

function FileManager({ onCompare }) {
  const [existingFiles, setExistingFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([null, null]); // [v1, v2]

  // Vérifie que la prop onCompare est une fonction
  if (typeof onCompare !== "function") {
    console.error("FileManager.jsx - onCompare n'est pas une fonction valide.");
    return null;
  }
  console.log("FileManager.jsx - onCompare:", onCompare);

  // Charger les fichiers existants au montage du composant
  useEffect(() => {
    loadExistingFiles();
  }, []);

  const loadExistingFiles = async () => {
    try {
      const files = await GetFilesInWorkspaceInfo();
      setExistingFiles(files || []); // Vérifie que les fichiers sont bien un tableau
    } catch (error) {
      console.error("Échec du chargement des fichiers existants :", error);
      setExistingFiles([]); // Réinitialise en cas d'erreur
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
    console.log("FileManager.jsx - handleCompare called with selectedFiles:", selectedFiles);

    const file1 = selectedFiles[0];
    const file2 = selectedFiles[1];

    if (!file1 && !file2) {
      alert("Veuillez sélectionner au moins un fichier pour la comparaison.");
      return;
    }

    try {
      if (file1 && file2) {
        // Deux fichiers sélectionnés
        console.log("FileManager.jsx - Comparing two files:", file1, file2);
        await BtnCompare(file1.components, file2.components);
      } else {
        // Un seul fichier sélectionné
        const fileToCompare = file1 || file2;
        console.log("FileManager.jsx - Comparing single file to itself:", fileToCompare);
        await BtnCompare(fileToCompare.components, null);
      }

      // Après la comparaison, récupérer les composants mis à jour depuis le backend
      const comparisonResult = await GetComponents();
      console.log("FileManager.jsx - comparisonResult:", comparisonResult);

      if (comparisonResult && comparisonResult.length > 0) {
        onCompare(comparisonResult); // Transmettre les résultats au parent
      } else {
        alert("Aucune donnée disponible après la comparaison.");
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
                > Select first BOM...
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
                > Select second BOM...
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

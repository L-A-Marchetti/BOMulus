import React, { useState, useEffect, useRef } from "react";
import {
  OpenFileDialog,
  UpdateVersionTags,
  UpdateLastComparison,
  GetLastComparison,
  OpenMultipleFilesDialog,
  AddFileToWorkspace,
  HeaderFiltersFileValidation,
  GetFilesInWorkspaceInfo,
  BtnCompare,
  GetComponents,
  DeleteBOMFile,
} from "../wailsjs/go/main/App";
import Modal from "./Modal"; // Import du composant Modal
import Button from "./Button"; // Import du composant Button
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./FileManager.css";
import AddBom from "./assets/images/add_bom.svg";

const ItemTypes = {
  FILE: "file",
};

const DraggableFile = ({ file, moveFile, onDelete }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const [, drag] = useDrag({
    type: ItemTypes.FILE,
    item: { id: file.version_tag },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.FILE,
    hover: (draggedItem) => {
      if (draggedItem.id !== file.version_tag) {
        moveFile(draggedItem.id, file.version_tag);
        draggedItem.id = file.version_tag;
      }
    },
  });

  const handleDeleteClick = () => setIsConfirming(true);
  const handleCancel = () => setIsConfirming(false);
  const handleConfirm = () => {
    onDelete(file.path);
    setIsConfirming(false);
  };

  return (
    <li ref={(node) => drag(drop(node))} className="draggable-file">
      {isConfirming ? (
        <div className="confirm-delete" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Delete?</span>
          <Button className="confirm-button" onClick={handleConfirm}>
            Yes
          </Button>
          <Button className="cancel-button" onClick={handleCancel}>
            No
          </Button>
        </div>
      ) : (
        <>
          <button className="delete-button" onClick={handleDeleteClick}>×</button>
          <span className="file-name">V{file.version_tag} | {file.name}</span>
        </>
      )}
    </li>
  );
};


function FileManager({ onCompare }) {
  const [existingFiles, setExistingFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([null, null]); // [v1, v2]
  const [isModalOpen, setIsModalOpen] = useState(false); // Contrôle de l'ouverture du modal
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationFile, setValidationFile] = useState();
  const [validationCallback, setValidationCallback] = useState(null);

  useEffect(() => {
    loadExistingFiles();
  }, []);

  const loadExistingFiles = async () => {
    try {
      const files = await GetFilesInWorkspaceInfo();
      if (files && files.length > 0) {
        const sortedFiles = files.sort((a, b) => a.version_tag - b.version_tag); // Trier par version_tag
        setExistingFiles(sortedFiles);

        try {
          const lastComparison = await GetLastComparison();
          console.log("Last Comparison:", lastComparison);
          let file1 = null;
          let file2 = null;

          for (const file of sortedFiles) {
            console.log("Last Comparison loop:", file);
            if (file.path === lastComparison.v1) {
              file1 = file;
            } else if (file.path === lastComparison.v2) {
              file2 = file;
            }
          }

          if (file1 || file2) {
            setSelectedFiles([file1, file2]);
            try {
              if (file1 && file2) {
                await BtnCompare(file1.components, file2.components);
              } else {
                const fileToCompare = file1 || file2;
                await BtnCompare(fileToCompare.components, null);
              }
              const comparisonResult = await GetComponents();
              if (comparisonResult && comparisonResult.length > 0) {
                onCompare(comparisonResult);
              } else {
                alert("Aucune donnée disponible après la comparaison.");
              }
            } catch (error) {
              console.error("La comparaison a échoué :", error);
              alert(`La comparaison a échoué : ${error.message || "Erreur inconnue"}`);
            }
          } else {
            setSelectedFiles([]);
          }
        } catch (error) {
          console.error("Échec du chargement des last comparisons :", error);
          setSelectedFiles([]);
        }
      } else {
        setExistingFiles([]);
      }
    } catch (error) {
      console.error("Échec du chargement des fichiers existants :", error);
      setExistingFiles([]);
    }
  };

  const validationFileRef = useRef(null);

  useEffect(() => {
    validationFileRef.current = validationFile;
  }, [validationFile]);

  const handleFileSelection = async (filePath) => {
    try {
      if (filePath) {
        const initialFile = await HeaderFiltersFileValidation(filePath);
        setValidationFile(initialFile);
        validationFileRef.current = initialFile;
        setIsValidationModalOpen(true);

        await new Promise((resolve) => {
          const onValidationComplete = () => {
            setIsValidationModalOpen(false);
            resolve();
          };
          setValidationCallback(() => onValidationComplete);
        });

        if (validationFileRef.current) {
          await AddFileToWorkspace(filePath, validationFileRef.current);
          await loadExistingFiles();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier :", error);
      alert("Échec de la sélection du fichier");
    }
  };




  const handleManualUpload = async () => {
    try {
      const filePaths = await OpenMultipleFilesDialog(); // Nouvelle fonction pour la sélection multiple
      if (filePaths && filePaths.length > 0) {
        for (const filePath of filePaths) {
          await handleFileSelection(filePath); // Ajoute chaque fichier
        }
      } else {
        console.log("Aucun fichier sélectionné");
      }
    } catch (error) {
      console.error("Erreur lors de l'upload manuel :", error);
      alert("Erreur lors de l'upload manuel.");
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

  const handleCompare = async () => {
    const file1 = selectedFiles[0];
    const file2 = selectedFiles[1];

    if (!file1 && !file2) {
      alert("Veuillez sélectionner au moins un fichier pour la comparaison.");
      return;
    }

    try {
      if (file1 && file2) {
        await BtnCompare(file1.components, file2.components);
        await UpdateLastComparison(file1.path, file2.path);
      } else {
        const fileToCompare = file1 || file2;
        await BtnCompare(fileToCompare.components, null);
        await UpdateLastComparison(file1.path, "");
      }

      const comparisonResult = await GetComponents();
      if (comparisonResult && comparisonResult.length > 0) {
        onCompare(comparisonResult);
      } else {
        alert("Aucune donnée disponible après la comparaison.");
      }
    } catch (error) {
      console.error("La comparaison a échoué :", error);
      alert(`La comparaison a échoué : ${error.message || "Erreur inconnue"}`);
    }
  };

  const moveFile = (fromTag, toTag) => {
    const fromIndex = existingFiles.findIndex(file => file.version_tag === fromTag);
    const toIndex = existingFiles.findIndex(file => file.version_tag === toTag);

    if (fromIndex !== -1 && toIndex !== -1) {
      const updatedFiles = Array.from(existingFiles);
      const [movedFile] = updatedFiles.splice(fromIndex, 1);
      updatedFiles.splice(toIndex, 0, movedFile);
      updatedFiles.forEach((file, index) => {
        file.version_tag = index + 1; // Assigner des tags consécutifs
      });

      setExistingFiles(updatedFiles);

      // Appeler le backend pour mettre à jour les version_tag
      syncVersionTagsWithBackend(updatedFiles);
    }
  };

  const syncVersionTagsWithBackend = async (files) => {
    try {
      const updatedTags = files.map(file => ({
        path: file.path,
        version_tag: file.version_tag,
      }));
      await UpdateVersionTags(updatedTags); // Fonction backend à implémenter
      console.log("Version tags synchronisés avec succès !");
    } catch (error) {
      console.error("Erreur lors de la synchronisation des version tags :", error);
    }
  };


  const handleDeleteFile = async (filePath) => {
    try {
      await DeleteBOMFile(filePath);
      loadExistingFiles();
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier :", error);
    }
  };

  return (
    <div className="file-manager">
      <div className="file-manager-grid">
        <button onClick={() => setIsModalOpen(true)} className="button">
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
              {existingFiles.map((file) => (
                <option key={file.version_tag} value={file.name}>
                  V{file.version_tag} | {file.name}
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
              {existingFiles.map((file) => (
                <option key={file.version_tag} value={file.name}>
                  V{file.version_tag} | {file.name}
                </option>
              ))}

            </select>
          </div>
        </div>

        <button onClick={handleCompare} className="button">
          OK
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3>File Manager</h3>

          <Button onClick={handleManualUpload}>Import files...</Button>
          <h4>Existing Files</h4>
          <DndProvider backend={HTML5Backend}>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {existingFiles.map((file, index) => (
                <DraggableFile
                  key={file.name}
                  file={file}
                  index={index}
                  moveFile={moveFile}
                  onDelete={handleDeleteFile}
                />
              ))}
            </ul>
          </DndProvider>
        </Modal>
      )}

      {/* Validation Modal */}
      {isValidationModalOpen && validationFile && (
        <Modal onClose={() => setIsValidationModalOpen(false)}>
          <h3>Header & Filters Validation</h3>
          <Button onClick={validationCallback}>Validate</Button>
          {/* Spin Button pour modifier le header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ marginRight: "10px", fontSize: "12px" }}>Header Row:</span>
            <button
              style={{
                fontSize: "12px",
                padding: "2px 6px",
                cursor: "pointer",
                marginRight: "5px",
              }}
              onClick={() =>
                setValidationFile((prev) => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    header: Math.max(prev.filters.header - 1, 0), // Empêche de descendre sous 0
                  },
                }))
              }
            >
              −
            </button>
            <span style={{ fontSize: "12px", marginRight: "5px" }}>
              {validationFile.filters.header}
            </span>
            <button
              style={{
                fontSize: "12px",
                padding: "2px 6px",
                cursor: "pointer",
              }}
              onClick={() =>
                setValidationFile((prev) => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    header: prev.filters.header + 1,
                  },
                }))
              }
            >
              +
            </button>
          </div>

          {/* Tableau */}
          <table>
            <thead style={{ fontSize: "10px" }}>
              <tr>
                {["Quantity", "MPN", "Description", "Designator", "Manufacturer"].map((column, index) => (
                  <th key={index} style={{ position: "relative" }}>
                    {column}
                    <div
                      style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "4px" }}
                    >
                      <button
                        style={{
                          fontSize: "10px",
                          padding: "2px 4px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setValidationFile((prev) => ({
                            ...prev,
                            filters: {
                              ...prev.filters,
                              [column.toLowerCase()]: Math.max(
                                prev.filters[column.toLowerCase()] - 1,
                                0
                              ),
                            },
                          }))
                        }
                      >
                        −
                      </button>
                      <button
                        style={{
                          fontSize: "10px",
                          padding: "2px 4px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setValidationFile((prev) => ({
                            ...prev,
                            filters: {
                              ...prev.filters,
                              [column.toLowerCase()]: prev.filters[column.toLowerCase()] + 1,
                            },
                          }))
                        }
                      >
                        +
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: "10px" }}>
              {validationFile.content
                .slice(validationFile.filters.header)
                .map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{row[validationFile.filters.quantity] || "N/A"}</td>
                    <td>{row[validationFile.filters.mpn] || "N/A"}</td>
                    <td>{row[validationFile.filters.description] || "N/A"}</td>
                    <td>{row[validationFile.filters.designator] || "N/A"}</td>
                    <td>{row[validationFile.filters.manufacturer] || "N/A"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Modal>
      )}



    </div>
  );
}

export default FileManager;

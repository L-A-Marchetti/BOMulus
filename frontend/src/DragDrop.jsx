import React, { useState } from 'react';
import { DisplayFileName, UploadFile } from "../wailsjs/go/main/App";
import './DragDrop.css';

function DragDrop({ idx, setIsValid }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [dropColor, setDropColor] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDropActive(true);
      const droppedFile = e.dataTransfer.files[0];

      DisplayFileName(droppedFile.name).then((struct) => {
        setFile(struct.File);
        setDropColor(struct.Color);

        if (struct.Color !== "invalid") {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target.result.split(',')[1];
            UploadFile(droppedFile.name, base64, idx);
          };
          reader.readAsDataURL(droppedFile);

          // Le fichier est valide, mettre à jour l'état
          setIsValid(true);
        } else {
          // Le fichier est invalide, mettre à jour l'état
          setIsValid(false);
        }
      });
    }
  };

  return (
    <div
      className={`drop-zone ${dragActive ? "drag-active" : dropActive ? "drop-active" : ""} ${dropColor === "invalid" ? "invalid" : "valid"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {file ? (
        <p>{file}</p>
      ) : (
        <p>Drag & drop a file</p>
      )}
    </div>
  );
}

export default DragDrop;

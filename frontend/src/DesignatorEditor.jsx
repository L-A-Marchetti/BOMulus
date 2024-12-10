import React, { useState } from "react";
import { UpdateDesignator } from "../wailsjs/go/main/App"; // Import de la fonction backend

const DesignatorEditor = () => {
  const [designators, setDesignators] = useState([
    { designator: "C1", label: "" },
    { designator: "C2", label: "" },
    { designator: "C3", label: "" },
  ]);

  const handleInputChange = (index, newLabel) => {
    const updatedDesignators = [...designators];
    updatedDesignators[index].label = newLabel;
    setDesignators(updatedDesignators);
  };

  const handleSubmit = async () => {
    for (const d of designators) {
      try {
        // Appel de la fonction backend via Wails
        await UpdateDesignator(d.designator, d.label);
        console.log(`${d.designator} updated successfully`);
      } catch (error) {
        console.error(`Failed to update ${d.designator}:`, error);
      }
    }
    alert("Designators updated successfully!");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Designator Editor</h2>
      {designators.map((d, index) => (
        <div key={d.designator} style={{ marginBottom: "15px" }}>
          <label>
            {d.designator} Label:
            <input
              type="text"
              value={d.label}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </label>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 15px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Update Designators
      </button>
    </div>
  );
};

export default DesignatorEditor;

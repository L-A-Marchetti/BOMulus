// Switch.jsx
import React, { useState } from 'react';
import './Switch.css';

const Switch = ({ onToggle, btnCompare, isValid1, isValid2 }) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onToggle(newState);
  };

  return (
    <div className="switch-container">
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
        />
        <span className="slider round">
          <span className="switch-text left">I</span>
          <span className="switch-text middle">II</span>
          <span
            className="switch-text right"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Empêche le clic de modifier la checkbox
              if (isChecked && isValid1 && isValid2) {
                btnCompare();
              } else if (isValid1 && !isChecked) {
                btnCompare();
              }
            }}
          >
            GO
          </span>
          <span className="switch-indicator">
            <span className="indicator-text">{isChecked ? 'II' : 'I'}</span>
          </span>
        </span>
      </label>
    </div>

  );
};

export default Switch;

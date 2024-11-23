/*
 * Button.jsx
 * 
 * A reusable button component with hover effects and theme variants.
 *
 * Props:
 * children: Content to be rendered inside the button.
 * onClick: Function to be called when the button is clicked.
 * style: Additional inline styles to be applied to the button.
 * className: Additional CSS classes to be applied to the button.
 * variant: "dark" | "light" - Controls the background theme of the button.
 *
 * States:
 * isHovered: Boolean indicating whether the button is being hovered over.
 */

import React, { useState } from "react";
import "./Button.css";

// Reusable button component with hover effects
function Button({ children, onClick, style, className, variant = "dark" }) {
    const [isHovered, setIsHovered] = useState(false);

    // Handles button click, preventing default behavior
    const handleClick = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`custom-button ${variant} ${isHovered ? 'hovered' : ''} ${className || ''}`}
            style={style}
        >
            {children}
        </button>
    );
}

export default Button;

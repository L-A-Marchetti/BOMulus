import React, { useState } from "react";

function Button({ children, onClick, style, className }) {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyle = {
        normal: {
            textDecoration: "none",
            color: "inherit",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "300",
            boxShadow: "6px 6px 0px -4px rgba(0, 0, 0, 0.2)",
            padding: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            backgroundColor: "rgba(68, 68, 68, 0.1)",
        },
        hovered: {
            textDecoration: "none",
            color: "inherit",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "400",
            boxShadow: "7px 7px 0px -4px rgba(0, 0, 0, 0.2)",
            padding: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            backgroundColor: "rgba(68, 68, 68, 0.2)", // Change légèrement la couleur au survol
        }
    };

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
            style={{ ...buttonStyle.normal, ...(isHovered ? buttonStyle.hovered : {}), ...style }} // Applique les styles passés en props
            className={className}
        >
            {children}
        </button>
    );
}

export default Button;

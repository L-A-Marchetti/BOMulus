import React, { useState } from "react";

function ButtonAction({ children, onClick }) {
    const [isHovered, setIsHovered] = useState(false);
    const buttonStyle = {
        normal: {
            textDecoration: "none",
            color: "inherit",
            fontFamily: "Poppins, sans-serif",
            fontWeight: "300",
            padding: "1rem",
            background: "none",
            cursor: "pointer",
            border: "none",
            boxShadow: "6px 6px 0px -4px rgba(0, 0, 0, 0.2)",
        },
        hovered: {
            textDecoration: "none",
            color: "inherit",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "7px 7px 0px -4px rgba(0, 0, 0, 0.2)",
            fontWeight: "400",
            padding: "1rem",
            background: "none",
            cursor: "pointer",
            border: "none",
        }
    }

    const handleClick = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    }

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={isHovered ? buttonStyle.hovered : buttonStyle.normal}
        >
            {children}
        </button>
    );
}

export default ButtonAction;

import React, { useEffect, useState } from "react";
import "./WarningToolTip.css";

function WarningToolTip({ totalWarnings }) {
    const [displayedWarnings, setDisplayedWarnings] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (displayedWarnings === totalWarnings) return;

        setIsUpdating(true); // Active la classe "updating"
        const increment = totalWarnings > displayedWarnings ? 1 : -1;
        const duration = 300; // Durée totale de l'animation
        const stepTime = Math.max(Math.abs(Math.floor(duration / (totalWarnings - displayedWarnings))), 20);

        const timer = setInterval(() => {
            setDisplayedWarnings((prev) => {
                const nextValue = prev + increment;
                if (nextValue === totalWarnings) {
                    clearInterval(timer);
                    setTimeout(() => setIsUpdating(false), 200); // Désactiver "updating" après l'animation
                }
                return nextValue;
            });
        }, stepTime);

        return () => clearInterval(timer); // Nettoyage si le composant est démonté
    }, [totalWarnings, displayedWarnings]);

    return (
        <div
            className={`warning-tooltip ${isUpdating ? "updating" : ""}`}
            aria-label={`Total warnings: ${totalWarnings}`}
        >
            {displayedWarnings}
        </div>
    );
}

export default WarningToolTip;

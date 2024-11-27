import React, { useEffect, useState } from "react";
import "./WarningToolTip.css";

function WarningToolTip({ totalWarnings }) {
    const [displayedWarnings, setDisplayedWarnings] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        let start = displayedWarnings;
        const end = totalWarnings;

        if (start === end) return;

        setIsUpdating(true); // Active la classe "updating"
        const increment = end > start ? 1 : -1;
        const duration = 300;
        const stepTime = Math.abs(Math.floor(duration / Math.abs(end - start)));

        const timer = setInterval(() => {
            start += increment;
            setDisplayedWarnings(start);

            if (start === end) {
                clearInterval(timer);
                setTimeout(() => {
                    setIsUpdating(false); // Retarde la désactivation pour permettre l'animation
                }, 200); // Délai supplémentaire (en ms)
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [totalWarnings, displayedWarnings]);

    return (
        <div className={`warning-tooltip ${isUpdating ? "updating" : ""}`}>
            {displayedWarnings}
        </div>
    );
}

export default WarningToolTip;

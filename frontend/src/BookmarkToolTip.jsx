import React, { useEffect, useState } from "react";
import "./BookmarkToolTip.css";

function BookmarkToolTip({ totalBookmarks }) {
    const [displayedBookmarks, setDisplayedBookmarks] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    console.log("BookmarkToolTip rendered with totalBookmarks:", totalBookmarks);

    useEffect(() => {
        if (displayedBookmarks === totalBookmarks) return;

        setIsUpdating(true); // Active la classe "updating"
        let animationFrameId;
        let start = displayedBookmarks;
        const end = totalBookmarks;

        const updateCount = () => {
            if (start !== end) {
                const increment = end > start ? 1 : -1;
                start += increment;
                setDisplayedBookmarks(start);
                animationFrameId = requestAnimationFrame(updateCount);
            } else {
                setTimeout(() => {
                    setIsUpdating(false); // Retarde la désactivation pour permettre l'animation
                }, 200); // Délai supplémentaire (en ms)
            }
        };

        animationFrameId = requestAnimationFrame(updateCount);

        return () => cancelAnimationFrame(animationFrameId);
    }, [totalBookmarks, displayedBookmarks]);

    return (
        <div className={`bookmark-tooltip ${isUpdating ? "updating" : ""}`}>
            {displayedBookmarks}
        </div>
    );
}

export default BookmarkToolTip;

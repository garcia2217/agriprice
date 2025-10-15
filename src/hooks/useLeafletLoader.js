import { useEffect } from "react";

export const useLeafletLoader = () => {
    useEffect(() => {
        // Load CSS
        const leafletCSS = document.createElement("link");
        leafletCSS.rel = "stylesheet";
        leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        leafletCSS.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        leafletCSS.crossOrigin = "";
        document.head.appendChild(leafletCSS);

        // Load JS
        const leafletJS = document.createElement("script");
        leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        leafletJS.integrity =
            "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        leafletJS.crossOrigin = "";
        document.body.appendChild(leafletJS);

        return () => {
            document.head.removeChild(leafletCSS);
            if (document.body.contains(leafletJS)) {
                document.body.removeChild(leafletJS);
            }
        };
    }, []);
};

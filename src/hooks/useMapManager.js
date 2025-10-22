import { useEffect, useRef } from "react";

export const useMapManager = (data) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayer = useRef(null);

    useEffect(() => {
        const checkLeaflet = () => {
            if (window.L && mapRef.current) {
                if (!mapInstance.current) {
                    mapInstance.current = window.L.map(mapRef.current).setView(
                        [-2.5, 110.0],
                        5
                    );
                    window.L.tileLayer(
                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        {
                            attribution:
                                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        }
                    ).addTo(mapInstance.current);
                }

                if (!markersLayer.current) {
                    markersLayer.current = window.L.layerGroup().addTo(
                        mapInstance.current
                    );
                }

                markersLayer.current.clearLayers();

                const cities = data?.cities || [];
                const clusters = data?.clusters || [];

                cities.forEach((city) => {
                    const cluster = data.clusters.find(
                        (c) => c.id === city.clusterId
                    );
                    if (cluster) {
                        window.L.circleMarker([city.lat, city.lon], {
                            color: cluster.hexColor,
                            fillColor: cluster.hexColor,
                            fillOpacity: 0.8,
                            radius: 8,
                        })
                            .bindPopup(
                                `<b>${city.name}</b><br />${cluster.name}`
                            )
                            .addTo(markersLayer.current);
                    }
                });
            }
        };

        const intervalId = setInterval(() => {
            if (window.L) {
                clearInterval(intervalId);
                checkLeaflet();
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, [data]);

    return { mapRef };
};

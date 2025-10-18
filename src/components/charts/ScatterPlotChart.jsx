import React, { useEffect, useRef, useState } from "react";
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(
    ScatterController,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
    zoomPlugin
);

const ScatterPlotChart = ({ pcaData, clusters }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const [isZoomed, setIsZoomed] = useState(false);

    // feature_contributions is no longer needed
    const { components, transformed_data, description } = pcaData;

    // Create cluster color mapping
    const clusterColors = {};
    clusters.forEach((cluster) => {
        clusterColors[cluster.id] = cluster.hexColor;
    });

    // Prepare datasets for each cluster
    const datasets = clusters.map((cluster) => {
        const clusterData = transformed_data.filter(
            (point) => point.clusterId === cluster.id
        );
        return {
            label: cluster.name,
            data: clusterData,
            backgroundColor: cluster.hexColor,
            borderColor: cluster.hexColor,
            pointRadius: 8,
            pointHoverRadius: 12,
            pointBorderWidth: 2,
            pointBorderColor: "#ffffff",
        };
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        const ctx = canvasRef.current.getContext("2d");

        chartRef.current = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: true,
                        position: "top",
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 14,
                                weight: "600",
                            },
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        titleColor: "#1f2937",
                        bodyColor: "#4b5563",
                        borderColor: "#e5e7eb",
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            title: (context) => {
                                const point = context[0].raw;
                                return point.cityName;
                            },
                            label: (context) => {
                                const point = context.raw;
                                const cluster = clusters.find(
                                    (c) => c.id === point.clusterId
                                );
                                return [
                                    `Klaster: ${cluster.name}`,
                                    `PC1: ${point.x.toFixed(3)}`,
                                    `PC2: ${point.y.toFixed(3)}`,
                                ];
                            },
                        },
                    },
                    zoom: {
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: "xy",
                        },
                        pan: {
                            enabled: true,
                            mode: "xy",
                        },
                    },
                },
                scales: {
                    x: {
                        type: "linear",
                        title: {
                            display: true,
                            text: `PC1 (${(
                                components.pc1.explained_variance_ratio * 100
                            ).toFixed(1)}% variance)`,
                            font: {
                                size: 14,
                                weight: "bold",
                            },
                            color: "#374151",
                        },
                        grid: {
                            color: "#e5e7eb",
                        },
                        ticks: {
                            color: "#6b7280",
                        },
                    },
                    y: {
                        type: "linear",
                        title: {
                            display: true,
                            text: `PC2 (${(
                                components.pc2.explained_variance_ratio * 100
                            ).toFixed(1)}% variance)`,
                            font: {
                                size: 14,
                                weight: "bold",
                            },
                            color: "#374151",
                        },
                        grid: {
                            color: "#e5e7eb",
                        },
                        ticks: {
                            color: "#6b7280",
                        },
                    },
                },
                onZoom: () => {
                    setIsZoomed(true);
                },
                onPan: () => {
                    setIsZoomed(true);
                },
            },
            // The biplotPlugin is no longer passed here
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [transformed_data, clusters, components]);

    const resetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
            setIsZoomed(false);
        }
    };

    // Calculate statistics
    const totalVariance =
        components.pc1.explained_variance_ratio +
        components.pc2.explained_variance_ratio;
    const clusterCount = clusters.length;
    const pointCount = transformed_data.length;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Analisis Komponen Utama (PCA)
                </h2>
                <p className="text-gray-600 text-lg">{description}</p>
            </div>

            {/* Chart Container */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-8">
                    {/* Zoom Controls */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Interaksi:</span>{" "}
                            Scroll untuk zoom, drag untuk pan
                        </div>
                        {isZoomed && (
                            <button
                                onClick={resetZoom}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                                Reset Zoom
                            </button>
                        )}
                    </div>

                    <div style={{ height: 500 }}>
                        <canvas ref={canvasRef} />
                    </div>
                </div>

                {/* Biplot Legend section has been removed */}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="text-sm font-medium text-indigo-800 mb-1">
                        Total Variance Explained
                    </div>
                    <div className="text-2xl font-bold text-indigo-900">
                        {(totalVariance * 100).toFixed(1)}%
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="text-sm font-medium text-purple-800 mb-1">
                        Jumlah Klaster
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                        {clusterCount}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-1">
                        Jumlah Kota
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                        {pointCount}
                    </div>
                </div>
            </div>

            {/* Interpretation Guide */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Panduan Interpretasi PCA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                Titik-titik:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Mewakili kota dalam ruang 2D yang direduksi
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                Warna:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Menunjukkan keanggotaan klaster
                            </span>
                        </div>
                    </div>
                    {/* Removed Biplot Guide */}
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                Zoom/Pan:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Scroll untuk zoom, drag untuk pan, reset untuk
                                kembali
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ScatterPlotChart);

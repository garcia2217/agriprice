import React, { useEffect, useRef, useState, useMemo } from "react";
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

// Register Chart.js components and plugins once
Chart.register(
    ScatterController,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
    zoomPlugin
);

const ScatterPlotChart = ({ pcaData, clusters, commodityCount }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const [isZoomed, setIsZoomed] = useState(false);

    // Destructure data with safety checks
    const { components, transformed_data, description, features } =
        pcaData || {};

    // Determine the chart mode
    const isTrivialPCA = commodityCount === 2;

    // 1. Prepare datasets (Memoized for performance)
    const datasets = useMemo(() => {
        return clusters.map((cluster) => {
            const clusterData = (transformed_data || []).filter(
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
                borderWidth: 0, // Remove dataset border
            };
        });
    }, [transformed_data, clusters]);

    // 2. Dynamic Axis Title Calculation (Memoized)
    const getAxisTitle = (axis) => {
        if (isTrivialPCA) {
            // Use original feature names for the trivial (2-commodity) case
            const featureName =
                axis === "x" ? features?.x_axis : features?.y_axis;
            return featureName || (axis === "x" ? "Feature 1" : "Feature 2");
        } else {
            // Use PC labels and explained variance ratio for true PCA (> 2 commodities)
            const pc = axis === "x" ? components?.pc1 : components?.pc2;
            const variance = pc?.explained_variance_ratio || 0;
            const pcLabel = axis === "x" ? "PC1" : "PC2";
            return `${pcLabel} (${(variance * 100).toFixed(1)}% variance)`;
        }
    };

    // 3. Chart Initialization and Update Effect
    useEffect(() => {
        if (!canvasRef.current) return;

        // Cleanup previous chart instance
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        const ctx = canvasRef.current.getContext("2d");

        const newChart = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // Optional: Disable animation for complex charts
                plugins: {
                    title: { display: false },
                    legend: {
                        display: true,
                        position: "top",
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 14, weight: "600" },
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
                            title: (context) => context[0].raw.cityName,
                            label: (context) => {
                                const point = context.raw;
                                const cluster = clusters.find(
                                    (c) => c.id === point.clusterId
                                );

                                return [
                                    `Klaster: ${cluster?.name || "N/A"}`,
                                    `${
                                        getAxisTitle("x").split(" ")[0]
                                    }: ${point.x.toFixed(3)}`,
                                    `${
                                        getAxisTitle("y").split(" ")[0]
                                    }: ${point.y.toFixed(3)}`,
                                ];
                            },
                        },
                    },
                    zoom: {
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: "xy",
                        },
                        pan: { enabled: true, mode: "xy" },
                        onZoom: () => setIsZoomed(true),
                        onPan: () => setIsZoomed(true),
                    },
                },
                scales: {
                    x: {
                        type: "linear",
                        title: {
                            display: true,
                            text: getAxisTitle("x"), // Dynamic X-axis title
                            font: { size: 14, weight: "bold" },
                            color: "#374151",
                        },
                        grid: { color: "#e5e7eb" },
                        ticks: { color: "#6b7280" },
                    },
                    y: {
                        type: "linear",
                        title: {
                            display: true,
                            text: getAxisTitle("y"), // Dynamic Y-axis title
                            font: { size: 14, weight: "bold" },
                            color: "#374151",
                        },
                        grid: { color: "#e5e7eb" },
                        ticks: { color: "#6b7280" },
                    },
                },
            },
        });

        chartRef.current = newChart;

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [
        transformed_data,
        clusters,
        components,
        datasets,
        isTrivialPCA,
        features,
    ]); // Added dependencies

    // Error handling (Excellent existing logic)
    if (!pcaData || commodityCount < 2) {
        // ... (Your existing, well-designed empty state JSX is used here) ...
        return (
            <div className="w-full max-w-6xl mx-auto space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Analisis Komponen Utama (PCA)
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Visualisasi 2D dari data clustering
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {commodityCount < 2
                                ? "PCA Tidak Dapat Dihasilkan"
                                : "Data PCA Tidak Tersedia"}
                        </h3>
                        <p className="text-gray-600 mb-4 max-w-md mx-auto">
                            {commodityCount < 2
                                ? `Analisis PCA memerlukan minimal 2 komoditas untuk menghitung komponen utama. Saat ini hanya ${commodityCount} komoditas yang dianalisis.`
                                : `Server tidak dapat menghasilkan data PCA karena jumlah komoditas tidak mencukupi.`}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
                            <p className="text-sm text-blue-800">
                                <strong>Solusi:</strong> Pilih minimal 2
                                komoditas dalam konfigurasi analisis untuk
                                melihat visualisasi PCA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Chart Interaction Logic
    const resetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
            setIsZoomed(false);
        }
    };

    // Calculate statistics
    const totalVariance =
        (components?.pc1?.explained_variance_ratio || 0) +
        (components?.pc2?.explained_variance_ratio || 0);
    const clusterCount = clusters.length;
    const pointCount = (transformed_data || []).length;

    // --- Render Component ---
    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isTrivialPCA
                        ? "Analisis Harga 2 Komoditas"
                        : "Analisis Komponen Utama (PCA)"}
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
                                <span className="mr-1">🔄</span> Reset Zoom
                            </button>
                        )}
                    </div>

                    {/* Canvas */}
                    <div style={{ height: 500 }}>
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 🟥 Conditional Card: Total Variance Explained */}
                {!isTrivialPCA && (
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                        <div className="text-sm font-medium text-indigo-800 mb-1">
                            Total Variance Explained (PC1 + PC2)
                        </div>
                        <div className="text-2xl font-bold text-indigo-900">
                            {(totalVariance * 100).toFixed(1)}%
                        </div>
                    </div>
                )}

                {/* Adjusting the grid columns based on the conditional card */}
                <div
                    className={`
                    ${isTrivialPCA ? "col-span-1" : "col-span-1"} 
                    bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200
                `}
                >
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
                    Panduan Interpretasi {isTrivialPCA ? "Scatter Plot" : "PCA"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {/* ... (Interpretation Guide items - kept simple for brevity) ... */}
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
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                Aksi Interaktif:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Scroll untuk zoom, drag untuk pan, reset untuk
                                kembali
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                Interpretasi Jarak:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Jarak antar titik mengindikasikan
                                kemiripan/perbedaan profil harga.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ScatterPlotChart);

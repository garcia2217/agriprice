import React, { useEffect, useMemo, useRef } from "react";
import {
    Chart,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import {
    BoxPlotController,
    BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";

Chart.register(
    BoxPlotController,
    BoxAndWiskers,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title
);

const BoxPlotChart = ({
    boxPlotData,
    clusters,
    selectedCommodity,
    onCommodityChange,
}) => {
    const { commodities, years, statistics, clusterColors } = boxPlotData;
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const labels = years;

    const datasets = useMemo(() => {
        if (!selectedCommodity) return [];
        return clusters.map((cluster) => {
            const clusterId = cluster.id.toString();
            const dataForCluster = years.map((year) => {
                const s = statistics[selectedCommodity]?.[year]?.[clusterId];
                if (!s) return null;
                return {
                    min: s.min,
                    q1: s.q1,
                    median: s.median,
                    q3: s.q3,
                    max: s.max,
                    outliers: s.outliers || [], // Include outliers if available
                };
            });
            return {
                type: "boxplot",
                label: cluster.name,
                backgroundColor: clusterColors[clusterId] + "40", // Better opacity
                borderColor: clusterColors[clusterId],
                borderWidth: 2,
                outlierBackgroundColor: clusterColors[clusterId],
                outlierBorderColor: clusterColors[clusterId],
                outlierBorderWidth: 1.5,
                outlierRadius: 4,
                itemRadius: 0,
                itemStyle: "circle",
                itemBackgroundColor: clusterColors[clusterId],
                itemBorderColor: clusterColors[clusterId],
                padding: 10,
                data: dataForCluster,
            };
        });
    }, [clusters, years, statistics, clusterColors, selectedCommodity]);

    useEffect(() => {
        if (!canvasRef.current) return;

        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        const ctx = canvasRef.current.getContext("2d");

        chartRef.current = new Chart(ctx, {
            type: "boxplot",
            data: {
                labels,
                datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Distribusi Harga ${selectedCommodity}`,
                        font: {
                            size: 18,
                            weight: "600",
                            family: "'Inter', 'Segoe UI', sans-serif",
                        },
                        color: "#111827",
                        padding: {
                            top: 10,
                            bottom: 20,
                        },
                    },
                    legend: {
                        position: "top",
                        align: "center",
                        labels: {
                            usePointStyle: true,
                            pointStyle: "rectRounded",
                            padding: 15,
                            font: {
                                size: 13,
                                weight: "500",
                            },
                            color: "#374151",
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        titleColor: "#111827",
                        bodyColor: "#374151",
                        borderColor: "#e5e7eb",
                        borderWidth: 1,
                        padding: 12,
                        bodySpacing: 6,
                        titleFont: {
                            size: 14,
                            weight: "600",
                        },
                        bodyFont: {
                            size: 13,
                        },
                        displayColors: true,
                        callbacks: {
                            title: (items) => {
                                if (items.length > 0) {
                                    const datasetLabel = items[0].dataset.label;
                                    const year = items[0].label;
                                    return `${datasetLabel} - ${year}`;
                                }
                                return "";
                            },
                            label: (ctx) => {
                                const v = ctx.raw;
                                if (!v) return "";
                                const format = (val) =>
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(val);

                                const lines = [
                                    `Maksimum: ${format(v.max)}`,
                                    `Q3 (75%): ${format(v.q3)}`,
                                    `Median: ${format(v.median)}`,
                                    `Q1 (25%): ${format(v.q1)}`,
                                    `Minimum: ${format(v.min)}`,
                                ];

                                // Show IQR
                                const iqr = v.q3 - v.q1;
                                lines.push(`IQR: ${format(iqr)}`);

                                // Show outliers count if available
                                if (v.outliers && v.outliers.length > 0) {
                                    lines.push(
                                        `Outliers: ${v.outliers.length} titik`
                                    );
                                }

                                return lines;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Tahun",
                            font: {
                                size: 14,
                                weight: "600",
                            },
                            color: "#374151",
                        },
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                size: 12,
                            },
                            color: "#6b7280",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Harga (Rp)",
                            font: {
                                size: 14,
                                weight: "600",
                            },
                            color: "#374151",
                        },
                        grid: {
                            color: "#f3f4f6",
                            drawBorder: false,
                        },
                        ticks: {
                            font: {
                                size: 12,
                            },
                            color: "#6b7280",
                            callback: (v) =>
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                    notation: "compact",
                                    compactDisplay: "short",
                                }).format(v),
                        },
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [labels, datasets, selectedCommodity]);

    return (
        <div className="space-y-6">
            {/* Commodity Selector */}
            <div className="flex justify-center">
                <div className="inline-flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <label className="text-sm font-semibold text-gray-700">
                        Komoditas:
                    </label>
                    <select
                        value={selectedCommodity}
                        onChange={(e) => onCommodityChange(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 cursor-pointer"
                    >
                        {commodities.map((commodity) => (
                            <option key={commodity} value={commodity}>
                                {commodity}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chart Container */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md">
                <div style={{ height: 480 }}>
                    <canvas ref={canvasRef} />
                </div>
            </div>

            {/* Legend and Info */}
            <div className="space-y-4">
                {/* Cluster Legend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Klaster:
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        {clusters.map((cluster) => (
                            <div
                                key={cluster.id}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg"
                            >
                                <div
                                    className="w-4 h-4 rounded shadow-sm"
                                    style={{
                                        backgroundColor:
                                            clusterColors[
                                                cluster.id.toString()
                                            ],
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {cluster.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Box Plot Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h5 className="text-sm font-semibold text-blue-900 mb-2">
                                Cara Membaca Box Plot:
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>
                                    • <strong>Box:</strong> Menunjukkan 50% data
                                    tengah (Q1 ke Q3)
                                </li>
                                <li>
                                    • <strong>Garis tengah:</strong> Median
                                    (nilai tengah)
                                </li>
                                <li>
                                    • <strong>Whisker:</strong> Menunjukkan
                                    rentang data (min-max)
                                </li>
                                <li>
                                    • <strong>Titik warna:</strong> Outliers
                                    (data yang sangat berbeda)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(BoxPlotChart);

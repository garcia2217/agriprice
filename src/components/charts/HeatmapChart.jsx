import React, { useEffect, useRef } from "react";
import {
    Chart,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

Chart.register(
    MatrixController,
    MatrixElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title
);

const HeatmapChart = ({ correlationData }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const { commodities, matrix, pValues, method, description } =
        correlationData;

    useEffect(() => {
        if (!canvasRef.current) return;

        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        const ctx = canvasRef.current.getContext("2d");

        const dataPoints = matrix.flatMap((row, i) =>
            row.map((value, j) => ({
                x: commodities[j],
                y: commodities[i],
                v: value,
                pValue: pValues[i][j],
            }))
        );

        const getColor = (value) => {
            const correlation = Math.max(-1, Math.min(1, value));

            if (correlation >= 0) {
                const intensity = correlation;
                const red = 239;
                const green = Math.round(68 + 187 * (1 - intensity));
                const blue = Math.round(68 + 187 * (1 - intensity));
                return `rgb(${red}, ${green}, ${blue})`;
            } else {
                const intensity = Math.abs(correlation);
                const red = Math.round(59 + 196 * (1 - intensity));
                const green = Math.round(130 + 125 * (1 - intensity));
                const blue = 246;
                return `rgb(${red}, ${green}, ${blue})`;
            }
        };

        const getTextColor = (value) => {
            const absValue = Math.abs(value);
            return absValue > 0.5 ? "#ffffff" : "#1f2937";
        };

        // Plugin to draw text on matrix cells
        const matrixTextPlugin = {
            id: "matrixText",
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                const meta = chart.getDatasetMeta(0);

                ctx.save();
                ctx.font = "bold 20px Roboto, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                meta.data.forEach((element, index) => {
                    const dataPoint = dataPoints[index];
                    const value = dataPoint.v;

                    // Get the dimensions of the cell
                    const { width, height } = element;

                    // Calculate the center coordinates
                    const x = element.x + width / 2;
                    const y = element.y + height / 2;

                    ctx.fillStyle = getTextColor(value);

                    // Draw the text at the calculated center
                    ctx.fillText(value.toFixed(2), x, y);
                });

                ctx.restore();
            },
        };

        chartRef.current = new Chart(ctx, {
            type: "matrix",
            data: {
                datasets: [
                    {
                        label: "Correlation",
                        data: dataPoints,
                        backgroundColor: (context) => {
                            if (!context.raw) return "#000";
                            const value = context.raw.v;
                            return getColor(value);
                        },
                        borderColor: "#e5e7eb",
                        borderWidth: 2,
                        width: ({ chart }) => {
                            return (
                                (chart.chartArea || {}).width /
                                    commodities.length -
                                2
                            );
                        },
                        height: ({ chart }) => {
                            return (
                                (chart.chartArea || {}).height /
                                    commodities.length -
                                2
                            );
                        },
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false,
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
                                return `${point.y} ↔ ${point.x}`;
                            },
                            label: (context) => {
                                const raw = context.raw;
                                const significance =
                                    raw.pValue < 0.05
                                        ? "(Signifikan)"
                                        : "(Tidak Signifikan)";
                                return [
                                    `Korelasi: ${raw.v.toFixed(3)}`,
                                    `P-value: ${raw.pValue.toFixed(
                                        4
                                    )} ${significance}`,
                                    `Metode: ${
                                        method.charAt(0).toUpperCase() +
                                        method.slice(1)
                                    }`,
                                ];
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        type: "category",
                        labels: commodities,
                        title: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                size: 13,
                                weight: "600",
                            },
                            color: "#374151",
                        },
                        grid: {
                            display: false,
                        },
                        offset: true,
                    },
                    y: {
                        type: "category",
                        labels: commodities,
                        title: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                size: 13,
                                weight: "600",
                            },
                            color: "#374151",
                        },
                        grid: {
                            display: false,
                        },
                        offset: true,
                        reverse: true,
                    },
                },
            },
            plugins: [matrixTextPlugin],
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [commodities, matrix, pValues, method]);

    // Calculate statistics
    const avgCorrelation = (
        matrix
            .flat()
            .filter((v, i) => i % (commodities.length + 1) !== 0)
            .reduce((sum, val) => sum + val, 0) /
        (commodities.length * (commodities.length - 1))
    ).toFixed(3);

    const strongCorrelations = matrix
        .flat()
        .filter((v, i) => i % (commodities.length + 1) !== 0)
        .filter((v) => Math.abs(v) > 0.5).length;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Matriks Korelasi Harga Komoditas
                </h2>
                <p className="text-gray-600 text-lg">{description}</p>
            </div>

            {/* Main Chart Container */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-8">
                    <div style={{ height: 550 }}>
                        <canvas ref={canvasRef} />
                    </div>
                </div>

                {/* Color Legend */}
                <div className="bg-gradient-to-r from-blue-50 to-red-50 px-8 py-6 border-t border-gray-200">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                                style={{ backgroundColor: "rgb(59, 130, 246)" }}
                            ></div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-gray-900">
                                    -1.00
                                </div>
                                <div className="text-xs text-gray-600">
                                    Negatif Kuat
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 mx-6">
                            <div
                                className="h-8 rounded-lg shadow-sm border border-gray-200"
                                style={{
                                    background:
                                        "linear-gradient(to right, rgb(59, 130, 246), rgb(255, 255, 255), rgb(239, 68, 68))",
                                }}
                            ></div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                    +1.00
                                </div>
                                <div className="text-xs text-gray-600">
                                    Positif Kuat
                                </div>
                            </div>
                            <div
                                className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
                                style={{ backgroundColor: "rgb(239, 68, 68)" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="text-sm font-medium text-blue-800 mb-1">
                        Metode Analisis
                    </div>
                    <div className="text-2xl font-bold text-blue-900 capitalize">
                        {method}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="text-sm font-medium text-purple-800 mb-1">
                        Korelasi Rata-rata
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                        {avgCorrelation}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-1">
                        Korelasi Kuat (|r| &gt; 0.5)
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                        {strongCorrelations} dari{" "}
                        {(commodities.length * (commodities.length - 1)) / 2}
                    </div>
                </div>
            </div>

            {/* Interpretation Guide */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Panduan Interpretasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                0.7 - 1.0:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Korelasi positif sangat kuat
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                0.4 - 0.7:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Korelasi positif moderat
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                -0.4 - 0.4:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Korelasi lemah atau tidak ada
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                        <div>
                            <span className="font-semibold text-gray-900">
                                -0.7 - -0.4:
                            </span>
                            <span className="text-gray-600">
                                {" "}
                                Korelasi negatif moderat hingga kuat
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(HeatmapChart);

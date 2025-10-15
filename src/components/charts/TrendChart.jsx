import React, { useMemo } from "react";

const TrendChart = ({ commodityData, clusters, years }) => {
    const chartConfig = useMemo(
        () => ({
            width: 800,
            height: 300,
            padding: 60,
        }),
        []
    );

    const { chartData, scales } = useMemo(() => {
        if (!commodityData || commodityData.length === 0) {
            return { chartData: null, scales: null };
        }

        const allValues = commodityData.flatMap((d) => d.data);
        const minY = Math.min(...allValues) * 0.95;
        const maxY = Math.max(...allValues) * 1.05;

        // Monthly points across the entire span; x-axis labeled by years only
        const totalMonths = years.length * 12 - 1; // zero-based index
        const xScale = (index) =>
            chartConfig.padding +
            (index / totalMonths) *
                (chartConfig.width - 2 * chartConfig.padding);

        const yScale = (value) =>
            chartConfig.height -
            chartConfig.padding -
            ((value - minY) / (maxY - minY)) *
                (chartConfig.height - 2 * chartConfig.padding);

        return {
            chartData: { minY, maxY, allValues },
            scales: { xScale, yScale },
        };
    }, [commodityData, years.length, chartConfig]);

    const formatCurrency = useMemo(
        () => (value) =>
            new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(value),
        []
    );

    if (!chartData) {
        return <p>Data tidak tersedia.</p>;
    }

    const { minY, maxY } = chartData;
    const { xScale, yScale } = scales;

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
                className="w-full h-auto"
            >
                {/* Y-Axis */}
                {[...Array(5)].map((_, i) => {
                    const value = minY + (i / 4) * (maxY - minY);
                    return (
                        <g key={i}>
                            <line
                                x1={chartConfig.padding}
                                y1={yScale(value)}
                                x2={chartConfig.width - chartConfig.padding}
                                y2={yScale(value)}
                                stroke="#E5E7EB"
                            />
                            <text
                                x={chartConfig.padding - 10}
                                y={yScale(value) + 5}
                                textAnchor="end"
                                fontSize="10"
                                fill="#6B7280"
                            >
                                {formatCurrency(value)}
                            </text>
                        </g>
                    );
                })}

                {/* X-Axis with yearly ticks while data points are monthly */}
                {years.map((year, i) => (
                    <text
                        key={i}
                        x={xScale(i * 12)}
                        y={chartConfig.height - chartConfig.padding + 20}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6B7280"
                    >
                        {year}
                    </text>
                ))}

                {/* Lines */}
                {commodityData.map(({ clusterId, data }) => {
                    const cluster = clusters.find((c) => c.id === clusterId);
                    if (!cluster) return null;

                    const pathData = data
                        .map(
                            (d, i) =>
                                `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(
                                    d
                                )}`
                        )
                        .join(" ");

                    return (
                        <path
                            key={clusterId}
                            d={pathData}
                            fill="none"
                            stroke={cluster.hexColor}
                            strokeWidth="3"
                        />
                    );
                })}
            </svg>
            <div className="flex justify-center space-x-4 mt-2">
                {clusters.map((cluster) => (
                    <div key={cluster.id} className="flex items-center text-sm">
                        <span
                            className={`w-3 h-3 rounded-full mr-2 ${cluster.bgColor}`}
                        ></span>
                        <span className="text-gray-600">{cluster.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(TrendChart);

import React, { useState, useMemo } from "react";

const RadarChart = ({ data, clusters }) => {
    const [selectedCluster, setSelectedCluster] = useState(0);
    const [showAllClusters, setShowAllClusters] = useState(false);

    // Get cluster features from backend
    const clusterFeatures = useMemo(() => {
        return data.radarFeatures || {};
    }, [data]);

    // Chart configuration
    const chartSize = 300;
    const centerX = chartSize / 2;
    const centerY = chartSize / 2;
    const radius = 100;

    // Dynamic axes configuration based on commodities
    const axes = useMemo(() => {
        if (!clusterFeatures || Object.keys(clusterFeatures).length === 0)
            return [];

        // Get commodities from the first cluster's features
        const firstClusterId = Object.keys(clusterFeatures)[0];
        const commodities = Object.keys(clusterFeatures[firstClusterId] || {});

        return commodities.map((commodity) => ({
            key: commodity,
            label: commodity,
            icon: "🌾", // Default icon, could be customized per commodity
            description: `Harga rata-rata ${commodity}`,
        }));
    }, [clusterFeatures]);

    // Calculate polygon points for a cluster
    const getPolygonPoints = (clusterData) => {
        return axes
            .map((axis, index) => {
                const angle = (index * 2 * Math.PI) / axes.length - Math.PI / 2;
                const value = clusterData[axis.key] || 0;
                const x = centerX + Math.cos(angle) * radius * value;
                const y = centerY + Math.sin(angle) * radius * value;
                return `${x},${y}`;
            })
            .join(" ");
    };

    // Calculate axis line endpoints
    const getAxisPoints = () => {
        return axes.map((axis, index) => {
            const angle = (index * 2 * Math.PI) / axes.length - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            return { x, y, angle, ...axis };
        });
    };

    const axisPoints = getAxisPoints();

    // Generate concentric circles for scale
    const scaleRings = [0.2, 0.4, 0.6, 0.8, 1.0];

    // Format normalized values for tooltips (0-1 scale)
    const formatValue = (key, normalizedValue) => {
        // Convert normalized value (0-1) to percentage for display
        return `${(normalizedValue * 100).toFixed(0)}%`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                        <span className="text-white text-lg">🕷️</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            DNA Klaster
                        </h3>
                        <p className="text-sm text-gray-500">
                            Profil karakteristik unik setiap klaster
                        </p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowAllClusters(!showAllClusters)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            showAllClusters
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {showAllClusters ? "Satu per Satu" : "Tampilkan Semua"}
                    </button>
                </div>
            </div>

            {/* Cluster Selector (when not showing all) */}
            {!showAllClusters && (
                <div className="flex justify-center mb-6">
                    <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                        {clusters.map((cluster) => (
                            <button
                                key={cluster.id}
                                onClick={() => setSelectedCluster(cluster.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedCluster === cluster.id
                                        ? `bg-white shadow-md transform scale-105 ${cluster.color}`
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${cluster.bgColor}`}
                                    ></div>
                                    <span>Klaster {cluster.id}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chart Container */}
            <div className="flex justify-center">
                <div className="relative">
                    <svg
                        width={chartSize}
                        height={chartSize}
                        className="overflow-visible"
                    >
                        {/* Background grid */}
                        <defs>
                            <pattern
                                id="grid"
                                width="20"
                                height="20"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 20 0 L 0 0 0 20"
                                    fill="none"
                                    stroke="#f3f4f6"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>

                        {/* Concentric circles for scale */}
                        {scaleRings.map((scale, index) => (
                            <circle
                                key={index}
                                cx={centerX}
                                cy={centerY}
                                r={radius * scale}
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                                opacity={0.5}
                            />
                        ))}

                        {/* Axis lines */}
                        {axisPoints.map((point, index) => (
                            <g key={index}>
                                <line
                                    x1={centerX}
                                    y1={centerY}
                                    x2={point.x}
                                    y2={point.y}
                                    stroke="#9ca3af"
                                    strokeWidth="1"
                                />

                                {/* Axis labels */}
                                <text
                                    x={point.x + Math.cos(point.angle) * 20}
                                    y={point.y + Math.sin(point.angle) * 20}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="text-xs font-medium fill-gray-700"
                                >
                                    <tspan
                                        x={point.x + Math.cos(point.angle) * 20}
                                        dy="-0.5em"
                                    >
                                        {point.icon}
                                    </tspan>
                                    <tspan
                                        x={point.x + Math.cos(point.angle) * 20}
                                        dy="1.2em"
                                    >
                                        {point.label}
                                    </tspan>
                                </text>
                            </g>
                        ))}

                        {/* Data polygons */}
                        {showAllClusters
                            ? // Show all clusters
                              clusters.map((cluster) => {
                                  const clusterData =
                                      clusterFeatures[cluster.id];
                                  if (!clusterData) return null;

                                  return (
                                      <g key={cluster.id}>
                                          <polygon
                                              points={getPolygonPoints(
                                                  clusterData
                                              )}
                                              fill={cluster.hexColor}
                                              fillOpacity="0.2"
                                              stroke={cluster.hexColor}
                                              strokeWidth="2"
                                              className="hover:fillOpacity-0.3 transition-all"
                                          />
                                          {/* Data points */}
                                          {axisPoints.map(
                                              (axisPoint, index) => {
                                                  const angle =
                                                      (index * 2 * Math.PI) /
                                                          axes.length -
                                                      Math.PI / 2;
                                                  const value =
                                                      clusterData[
                                                          axes[index].key
                                                      ] || 0;
                                                  const x =
                                                      centerX +
                                                      Math.cos(angle) *
                                                          radius *
                                                          value;
                                                  const y =
                                                      centerY +
                                                      Math.sin(angle) *
                                                          radius *
                                                          value;

                                                  return (
                                                      <circle
                                                          key={index}
                                                          cx={x}
                                                          cy={y}
                                                          r="4"
                                                          fill={
                                                              cluster.hexColor
                                                          }
                                                          stroke="white"
                                                          strokeWidth="2"
                                                          className="hover:r-6 transition-all"
                                                      >
                                                          <title>
                                                              {`${
                                                                  cluster.name
                                                              }\n${
                                                                  axisPoint.label
                                                              }: ${formatValue(
                                                                  axes[index]
                                                                      .key,
                                                                  clusterData[
                                                                      axes[
                                                                          index
                                                                      ].key
                                                                  ]
                                                              )}`}
                                                          </title>
                                                      </circle>
                                                  );
                                              }
                                          )}
                                      </g>
                                  );
                              })
                            : // Show selected cluster only
                              (() => {
                                  const cluster = clusters.find(
                                      (c) => c.id === selectedCluster
                                  );
                                  const clusterData =
                                      clusterFeatures[selectedCluster];
                                  if (!cluster || !clusterData) return null;

                                  return (
                                      <g>
                                          <polygon
                                              points={getPolygonPoints(
                                                  clusterData
                                              )}
                                              fill={cluster.hexColor}
                                              fillOpacity="0.3"
                                              stroke={cluster.hexColor}
                                              strokeWidth="3"
                                          />
                                          {/* Data points */}
                                          {axisPoints.map(
                                              (axisPoint, index) => {
                                                  const angle =
                                                      (index * 2 * Math.PI) /
                                                          axes.length -
                                                      Math.PI / 2;
                                                  const value =
                                                      clusterData[
                                                          axes[index].key
                                                      ] || 0;
                                                  const x =
                                                      centerX +
                                                      Math.cos(angle) *
                                                          radius *
                                                          value;
                                                  const y =
                                                      centerY +
                                                      Math.sin(angle) *
                                                          radius *
                                                          value;

                                                  return (
                                                      <circle
                                                          key={index}
                                                          cx={x}
                                                          cy={y}
                                                          r="5"
                                                          fill={
                                                              cluster.hexColor
                                                          }
                                                          stroke="white"
                                                          strokeWidth="2"
                                                          className="hover:r-7 transition-all cursor-pointer"
                                                      >
                                                          <title>
                                                              {`${
                                                                  axisPoint.label
                                                              }: ${formatValue(
                                                                  axes[index]
                                                                      .key,
                                                                  clusterData[
                                                                      axes[
                                                                          index
                                                                      ].key
                                                                  ]
                                                              )}`}
                                                          </title>
                                                      </circle>
                                                  );
                                              }
                                          )}
                                      </g>
                                  );
                              })()}

                        {/* Center point */}
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r="3"
                            fill="#6b7280"
                            opacity="0.5"
                        />
                    </svg>
                </div>
            </div>

            {/* Legend and Stats */}
            {!showAllClusters && (
                <div className="mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">
                                {
                                    clusters.find(
                                        (c) => c.id === selectedCluster
                                    )?.name
                                }
                            </h4>
                            <div className="flex items-center space-x-2">
                                <div
                                    className={`w-4 h-4 rounded-full ${
                                        clusters.find(
                                            (c) => c.id === selectedCluster
                                        )?.bgColor
                                    }`}
                                ></div>
                            </div>
                        </div>
                        <div
                            className={`grid gap-4 ${
                                axes.length <= 3
                                    ? "grid-cols-3"
                                    : axes.length <= 5
                                    ? "grid-cols-5"
                                    : "grid-cols-6"
                            }`}
                        >
                            {axes.map((axis) => {
                                const clusterData =
                                    clusterFeatures[selectedCluster];
                                const normalizedValue =
                                    clusterData?.[axis.key] || 0;

                                return (
                                    <div key={axis.key} className="text-center">
                                        <div className="text-2xl mb-1">
                                            {axis.icon}
                                        </div>
                                        <div className="text-xs text-gray-600 mb-1">
                                            {axis.label}
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {formatValue(
                                                axis.key,
                                                normalizedValue
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {(normalizedValue * 100).toFixed(0)}
                                            % dari maksimum
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Legend for all clusters view */}
            {showAllClusters && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {clusters.map((cluster) => (
                        <div
                            key={cluster.id}
                            className="bg-gray-50 rounded-lg p-3"
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${cluster.bgColor}`}
                                ></div>
                                <span className="font-medium text-sm text-gray-900">
                                    {cluster.name}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {axes.map((axis) => {
                                    const clusterData =
                                        clusterFeatures[cluster.id];
                                    const normalizedValue =
                                        clusterData?.[axis.key] || 0;

                                    return (
                                        <div
                                            key={axis.key}
                                            className="flex justify-between text-xs"
                                        >
                                            <span className="text-gray-600">
                                                {axis.icon} {axis.label}:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {formatValue(
                                                    axis.key,
                                                    normalizedValue
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(RadarChart);

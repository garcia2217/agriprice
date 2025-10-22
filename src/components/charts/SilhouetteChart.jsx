import React, { useEffect, useRef, useMemo } from "react";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const SilhouetteChart = ({ clusteringMetrics, citySilhouettes, clusters }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const { overall_silhouette, davies_bouldin, quality_assessment } =
    clusteringMetrics;

  // Create cluster color mapping
  const clusterColors = useMemo(() => {
    const colors = {};
    clusters.forEach((cluster) => {
      colors[cluster.id] = cluster.hexColor;
    });
    return colors;
  }, [clusters]);

  // Prepare data for the bar chart
  const chartData = useMemo(
    () => ({
      labels: citySilhouettes.map((city) => city.city),
      datasets: [
        {
          label: "Silhouette Score",
          data: citySilhouettes.map((city) => city.silhouette),
          backgroundColor: citySilhouettes.map(
            (city) => clusterColors[city.clusterId]
          ),
          borderColor: citySilhouettes.map(
            (city) => clusterColors[city.clusterId]
          ),
          borderWidth: 1,
        },
      ],
    }),
    [citySilhouettes, clusterColors]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
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
                const city = citySilhouettes[context[0].dataIndex];
                return city.city;
              },
              label: (context) => {
                const city = citySilhouettes[context.dataIndex];
                return [
                  `Silhouette Score: ${city.silhouette.toFixed(3)}`,
                  `Cluster: ${city.clusterName}`,
                  `Quality: ${
                    city.silhouette > 0.5
                      ? "Good"
                      : city.silhouette > 0.0
                      ? "Fair"
                      : "Poor"
                  }`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            type: "category",
            title: {
              display: true,
              text: "Cities (sorted by silhouette score)",
              font: {
                size: 14,
                weight: "bold",
              },
              color: "#374151",
            },
            grid: {
              display: false,
            },
            ticks: {
              color: "#6b7280",
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Silhouette Score",
              font: {
                size: 14,
                weight: "bold",
              },
              color: "#374151",
            },
            min: -1,
            max: 1,
            grid: {
              color: "#e5e7eb",
            },
            ticks: {
              color: "#6b7280",
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
  }, [citySilhouettes, overall_silhouette, clusterColors, chartData]);

  // Group cities by cluster for the members table
  const clusterMembers = clusters.map((cluster) => {
    const members = citySilhouettes.filter(
      (city) => city.clusterId === cluster.id
    );
    return {
      ...cluster,
      members: members,
      avgSilhouette:
        members.reduce((sum, city) => sum + city.silhouette, 0) /
        members.length,
    };
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Analisis Silhouette Clustering
        </h2>
        <p className="text-gray-600 text-lg">
          Evaluasi kualitas pengelompokan berdasarkan silhouette score
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="text-sm font-medium text-green-800 mb-1">
            Overall Silhouette Score
          </div>
          <div className="text-2xl font-bold text-green-900">
            {overall_silhouette.toFixed(3)}
          </div>
          <div className="text-xs text-green-700 mt-1">
            -1 to 1 (Higher is better)
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-sm font-medium text-blue-800 mb-1">
            Davies-Bouldin Index
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {davies_bouldin.toFixed(3)}
          </div>
          <div className="text-xs text-blue-700 mt-1">Lower is better</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="text-sm font-medium text-purple-800 mb-1">
            Total Cities
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {citySilhouettes.length}
          </div>
          <div className="text-xs text-purple-700 mt-1">
            Across {clusters.length} clusters
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Silhouette Scores by City
            </h3>
            <p className="text-sm text-gray-600">
              Bar colors represent cluster membership. Higher scores indicate
              better clustering.
            </p>
          </div>

          <div style={{ height: 400 }}>
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      {/* Cluster Members Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Cluster Members
          </h3>

          <div className="space-y-6">
            {clusterMembers.map((cluster) => (
              <div
                key={cluster.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: cluster.hexColor,
                      }}
                    ></div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {cluster.name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      ({cluster.members.length} cities)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg Silhouette: {cluster.avgSilhouette.toFixed(3)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {cluster.members.map((city) => (
                    <div
                      key={city.city}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <span className="font-medium text-gray-900">
                        {city.city}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          city.silhouette > 0.5
                            ? "bg-green-100 text-green-800"
                            : city.silhouette > 0.0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {city.silhouette.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Panduan Interpretasi Silhouette
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
            <div>
              <span className="font-semibold text-gray-900">0.5 - 1.0:</span>
              <span className="text-gray-600">
                {" "}
                Clustering sangat baik (well-clustered)
              </span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
            <div>
              <span className="font-semibold text-gray-900">0.0 - 0.5:</span>
              <span className="text-gray-600">
                {" "}
                Clustering sedang (borderline)
              </span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5"></div>
            <div>
              <span className="font-semibold text-gray-900">-1.0 - 0.0:</span>
              <span className="text-gray-600">
                {" "}
                Clustering buruk (poorly clustered)
              </span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
            <div>
              <span className="font-semibold text-gray-900">
                Davies-Bouldin:
              </span>
              <span className="text-gray-600">
                {" "}
                Semakin rendah semakin baik (lower is better)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SilhouetteChart);

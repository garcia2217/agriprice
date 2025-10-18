import React, { useState, useMemo } from "react";
import TrendChart from "./TrendChart";
import RadarChart from "./RadarChart";
import BoxPlotChart from "./BoxPlotChart";
import HeatmapChart from "./HeatmapChart";

const ChartContainer = ({ data }) => {
    const [selectedCommodity, setSelectedCommodity] = useState("Beras");
    const [chartType, setChartType] = useState("trend"); // 'trend', 'radar', 'boxplot', or 'heatmap'

    const commodities = useMemo(() => Object.keys(data.trends), [data.trends]);

    return (
        <div className="space-y-6">
            {/* Chart Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {chartType === "trend"
                            ? "Tren Harga per Klaster"
                            : chartType === "radar"
                            ? "DNA Klaster - Profil Karakteristik"
                            : chartType === "boxplot"
                            ? "Distribusi Harga per Komoditas"
                            : "Korelasi Harga Komoditas"}
                    </h3>
                    <p className="text-gray-600">
                        {chartType === "trend"
                            ? `Analisis perbandingan harga ${selectedCommodity.toLowerCase()} antar klaster`
                            : chartType === "radar"
                            ? "Visualisasi radar menampilkan profil unik setiap klaster berdasarkan harga, volatilitas, dan tren"
                            : chartType === "boxplot"
                            ? "Box plot menunjukkan distribusi harga setiap komoditas berdasarkan tahun dan klaster"
                            : "Heatmap menunjukkan korelasi harga antar komoditas"}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Chart Type Toggle */}
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                            Jenis Chart:
                        </label>
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setChartType("trend")}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                    chartType === "trend"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                📈 Tren
                            </button>
                            <button
                                onClick={() => setChartType("radar")}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                    chartType === "radar"
                                        ? "bg-white text-purple-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                🕷️ DNA
                            </button>
                            <button
                                onClick={() => setChartType("boxplot")}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                    chartType === "boxplot"
                                        ? "bg-white text-orange-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                📦 Distribusi
                            </button>
                            <button
                                onClick={() => setChartType("heatmap")}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                    chartType === "heatmap"
                                        ? "bg-white text-red-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                🔥 Korelasi
                            </button>
                        </div>
                    </div>

                    {/* Commodity Selector (for trend and boxplot charts) */}
                    {chartType === "trend" && (
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">
                                Komoditas:
                            </label>
                            <select
                                value={selectedCommodity}
                                onChange={(e) =>
                                    setSelectedCommodity(e.target.value)
                                }
                                className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            >
                                {commodities.map((commodity) => (
                                    <option key={commodity} value={commodity}>
                                        {commodity}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Chart Stats (only for trend chart) */}
            {chartType === "trend" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {data.trends[selectedCommodity]?.map(
                        ({ clusterId, data: priceData }) => {
                            const cluster = data.clusters.find(
                                (c) => c.id === clusterId
                            );
                            const avgPrice =
                                priceData.reduce(
                                    (sum, price) => sum + price,
                                    0
                                ) / priceData.length;
                            const trend =
                                priceData[priceData.length - 1] - priceData[0];
                            const trendPercent = (
                                (trend / priceData[0]) *
                                100
                            ).toFixed(1);

                            return (
                                <div
                                    key={clusterId}
                                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div
                                            className={`w-4 h-4 rounded-full ${cluster?.bgColor}`}
                                            style={{
                                                backgroundColor:
                                                    cluster?.hexColor,
                                            }}
                                        ></div>
                                        <span className="font-semibold text-gray-900">
                                            Klaster {clusterId + 1}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Rata-rata
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                    }
                                                ).format(avgPrice)}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    trend >= 0
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {trend >= 0 ? "📈" : "📉"}{" "}
                                                {trendPercent}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            )}

            {/* Chart Container */}
            <div
                className={
                    chartType === "radar"
                        ? ""
                        : "bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                }
            >
                {chartType === "trend" ? (
                    <TrendChart
                        commodityData={data.trends[selectedCommodity]}
                        clusters={data.clusters}
                        years={data.years}
                    />
                ) : chartType === "radar" ? (
                    <RadarChart data={data} clusters={data.clusters} />
                ) : chartType === "boxplot" ? (
                    <BoxPlotChart
                        boxPlotData={data.boxPlotData}
                        clusters={data.clusters}
                        selectedCommodity={selectedCommodity}
                        onCommodityChange={setSelectedCommodity}
                    />
                ) : (
                    <HeatmapChart correlationData={data.correlationMatrix} />
                )}
            </div>

            {/* Chart Insights */}
            <div
                className={`p-6 rounded-xl border ${
                    chartType === "radar"
                        ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
                        : chartType === "boxplot"
                        ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
                        : chartType === "heatmap"
                        ? "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
                        : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
                }`}
            >
                <div className="flex items-start space-x-3">
                    <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0 ${
                            chartType === "radar"
                                ? "bg-purple-500"
                                : chartType === "boxplot"
                                ? "bg-orange-500"
                                : chartType === "heatmap"
                                ? "bg-red-500"
                                : "bg-indigo-500"
                        }`}
                    >
                        {chartType === "radar"
                            ? "🕷️"
                            : chartType === "boxplot"
                            ? "📦"
                            : chartType === "heatmap"
                            ? "🔥"
                            : "💡"}
                    </div>
                    <div>
                        <h4
                            className={`font-semibold mb-2 ${
                                chartType === "radar"
                                    ? "text-purple-900"
                                    : chartType === "boxplot"
                                    ? "text-orange-900"
                                    : chartType === "heatmap"
                                    ? "text-red-900"
                                    : "text-indigo-900"
                            }`}
                        >
                            {chartType === "radar"
                                ? "Cara Membaca DNA Klaster"
                                : chartType === "boxplot"
                                ? "Cara Membaca Box Plot"
                                : chartType === "heatmap"
                                ? "Cara Membaca Heatmap Korelasi"
                                : "Insight Analisis"}
                        </h4>
                        <div
                            className={`text-sm space-y-1 ${
                                chartType === "radar"
                                    ? "text-purple-800"
                                    : chartType === "boxplot"
                                    ? "text-orange-800"
                                    : chartType === "heatmap"
                                    ? "text-red-800"
                                    : "text-indigo-800"
                            }`}
                        >
                            {chartType === "radar" ? (
                                <>
                                    <p>
                                        • <strong>Setiap Sumbu:</strong>{" "}
                                        Mewakili satu komoditas dengan nilai
                                        ter-normalisasi (0-100%)
                                    </p>
                                    <p>
                                        • <strong>Nilai Tinggi:</strong>{" "}
                                        Menunjukkan klaster dengan harga
                                        komoditas yang relatif tinggi
                                    </p>
                                    <p>
                                        • <strong>Bentuk Polygon:</strong>{" "}
                                        Menunjukkan profil harga unik setiap
                                        klaster untuk semua komoditas
                                    </p>
                                    <p>
                                        • <strong>Perbandingan:</strong> Semakin
                                        luas area, semakin dominan karakteristik
                                        harga klaster tersebut
                                    </p>
                                </>
                            ) : chartType === "boxplot" ? (
                                <>
                                    <p>
                                        • <strong>Box Plot:</strong> Menampilkan
                                        distribusi harga dari semua data point
                                        per komoditas
                                    </p>
                                    <p>
                                        • <strong>Setiap Box:</strong> Mewakili
                                        satu klaster dengan warna yang konsisten
                                    </p>
                                    <p>
                                        • <strong>Box menunjukkan:</strong> Q1,
                                        median (garis tebal), dan Q3; whiskers
                                        menunjukkan min-max
                                    </p>
                                    <p>
                                        • <strong>Outliers:</strong> Ditampilkan
                                        sebagai titik di luar whiskers
                                    </p>
                                </>
                            ) : chartType === "heatmap" ? (
                                <>
                                    <p>
                                        • <strong>Warna Merah:</strong> Korelasi
                                        positif kuat (harga cenderung bergerak
                                        searah)
                                    </p>
                                    <p>
                                        • <strong>Warna Biru:</strong> Korelasi
                                        negatif (harga bergerak berlawanan arah)
                                    </p>
                                    <p>
                                        • <strong>Warna Putih:</strong> Tidak
                                        ada korelasi atau korelasi lemah
                                    </p>
                                    <p>
                                        • <strong>Nilai 1.00:</strong> Korelasi
                                        sempurna (diagonal utama - komoditas
                                        dengan dirinya sendiri)
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        • Grafik menunjukkan pola harga{" "}
                                        {selectedCommodity.toLowerCase()} selama
                                        periode {data.years[0]} -{" "}
                                        {data.years[data.years.length - 1]}
                                    </p>
                                    <p>
                                        • Setiap warna garis merepresentasikan
                                        klaster yang berbeda berdasarkan
                                        karakteristik harga
                                    </p>
                                    <p>
                                        • Pola divergen menunjukkan adanya
                                        perbedaan signifikan antar wilayah
                                        clustering
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ChartContainer);

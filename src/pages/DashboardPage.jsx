import React, { useState, useCallback, useMemo } from "react";
import { researchResults } from "../data/mockData";
import MapComponent from "../components/dashboard/MapComponent";
import ControlPanel from "../components/dashboard/ControlPanel";
import { AnalysisProvider } from "../context/AnalysisContext";
import ChartContainer from "../components/charts/ChartContainer";

const DashboardPage = () => {
    const [mode, setMode] = useState("research");
    const [analysisData, setAnalysisData] = useState(researchResults);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // const handleFileUpload = useCallback((file) => {
    //   if (!file) {
    //     setError("Silakan pilih file ZIP untuk diunggah.");
    //     return;
    //   }
    //   if (!file.name.endsWith(".zip")) {
    //     setError("Format file tidak valid. Harap unggah file .zip.");
    //     return;
    //   }

    //   setError(null);
    //   setIsLoading(true);

    //   setTimeout(() => {
    //     console.log("File diunggah:", file.name);
    //     setAnalysisData(userResults);
    //     setIsLoading(false);
    //   }, 3000);
    // }, []);

    const handleFileUpload = useCallback(async ({ source, file, config }) => {
        try {
            setIsLoading(true);
            setError(null);

            if (source === "upload") {
                if (!file) {
                    setError("Silakan pilih file ZIP untuk diunggah.");
                    return;
                }
                if (!file.name.endsWith(".zip")) {
                    setError(
                        "Format file tidak valid. Harap unggah file .zip."
                    );
                    return;
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("config", JSON.stringify(config));

                const response = await fetch(
                    "http://127.0.0.1:8000/clustering_app/analyze",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const result = await response.json();
                console.log("=== RESPONSE DARI DJANGO ===");
                console.log(result);
                setAnalysisData(result); // update dashboard dengan data dari backend
            } else {
                // App data mode: call backend with configuration only (no file)
                const response = await fetch(
                    "http://127.0.0.1:8000/clustering_app/analyze",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(config),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const result = await response.json();
                console.log("=== RESPONSE DARI DJANGO (APP DATA) ===");
                console.log(result);
                setAnalysisData(result);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Gagal memproses permintaan.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleModeChange = useCallback((newMode) => {
        setMode(newMode);
        if (newMode === "research") {
            setAnalysisData(researchResults);
            setError(null);
        }
    }, []);

    const memoizedAnalysisData = useMemo(() => analysisData, [analysisData]);

    return (
        <div className="flex-grow bg-gradient-to-br from-gray-50 to-white min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                            <span className="mr-2">📊</span>
                            Dashboard Analytics • Real-time Data Visualization
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Dashboard{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Analisis Clustering
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Eksplorasi interaktif hasil clustering harga pangan
                            dengan visualisasi peta dan grafik yang komprehensif
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Dashboard */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Map Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">
                                            🗺️
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Peta Sebaran Klaster
                                        </h2>
                                        <p className="text-gray-600">
                                            Visualisasi geografis hasil
                                            clustering
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 h-[500px] lg:h-[600px]">
                                <MapComponent data={memoizedAnalysisData} />
                            </div>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-full hover:shadow-xl transition-shadow duration-300">
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">
                                            ⚙️
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Panel Kontrol
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            Pengaturan analisis
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <AnalysisProvider defaultMode={mode}>
                                    <ControlPanel
                                        mode={mode}
                                        setMode={handleModeChange}
                                        onFileUpload={handleFileUpload}
                                        isLoading={isLoading}
                                        error={error}
                                        data={memoizedAnalysisData}
                                    />
                                </AnalysisProvider>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">
                                            📈
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Analisis Tren Harga
                                        </h2>
                                        <p className="text-gray-600">
                                            Perbandingan tren harga antar
                                            klaster
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                    <span>Interactive Chart</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <ChartContainer data={memoizedAnalysisData} />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Total Kota",
                            value: memoizedAnalysisData.cities.length,
                            icon: "🏙️",
                            color: "from-blue-500 to-blue-600",
                            change: "+2.5%",
                        },
                        {
                            title: "Klaster Aktif",
                            value: memoizedAnalysisData.clusters.length,
                            icon: "🎯",
                            color: "from-green-500 to-green-600",
                            change: "Optimal",
                        },
                        {
                            title: "Komoditas",
                            value: Object.keys(memoizedAnalysisData.trends)
                                .length,
                            icon: "🌾",
                            color: "from-yellow-500 to-yellow-600",
                            change: "Lengkap",
                        },
                        {
                            title: "Periode Data",
                            value: memoizedAnalysisData.years.length,
                            icon: "📅",
                            color: "from-purple-500 to-purple-600",
                            change: "Tahun",
                        },
                    ].map((stat, index) => (
                        <div key={index} className="group">
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.title}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(DashboardPage);

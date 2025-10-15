import React, { useState, useRef, useCallback } from "react";
import citiesByProvince from "../../data/cities.json";

const ControlPanel = ({
    mode,
    setMode,
    onFileUpload,
    isLoading,
    error,
    data,
}) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState("algorithms"); // Tab state for user mode
    const [locationModalOpen, setLocationModalOpen] = useState(false);

    // New state for analysis configuration
    const [analysisConfig, setAnalysisConfig] = useState({
        algorithms: ["kmeans"],
        commodities: ["Beras", "Daging Ayam", "Telur Ayam"],
        numClusters: 3,
        yearRange: { start: 2020, end: 2025 },
        locations: { provinces: [], cities: [] },
        dataSource: "app",
    });

    const availableAlgorithms = [
        {
            id: "kmeans",
            name: "K-Means",
            icon: "🎯",
            description: "Clustering berdasarkan centroid",
        },
        {
            id: "fcm",
            name: "Fuzzy C-Means",
            icon: "🌊",
            description: "Clustering dengan membership fuzzy",
        },
        {
            id: "spectral",
            name: "Spectral Clustering",
            icon: "🌈",
            description: "Clustering berbasis eigenvector pada graph Laplacian",
        },
    ];

    const availableCommodities = [
        "Beras",
        "Daging Ayam",
        "Telur Ayam",
        "Daging Sapi",
        "Gula Pasir",
        "Minyak Goreng",
        "Cabai Merah",
        "Bawang Merah",
        "Bawang Putih",
        "Kedelai",
    ];

    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    }, []);

    const handleSubmit = useCallback(() => {
        const isUploadMode = analysisConfig.dataSource === "upload";
        const payload = {
            source: analysisConfig.dataSource,
            config: {
                algorithms: analysisConfig.algorithms,
                numClusters: analysisConfig.numClusters,
                ...(analysisConfig.dataSource === "app" && {
                    commodities: analysisConfig.commodities,
                    yearRange: analysisConfig.yearRange,
                    locations: analysisConfig.locations,
                }),
            },
            ...(isUploadMode && { file: selectedFile }),
        };
        onFileUpload(payload);
    }, [onFileUpload, selectedFile, analysisConfig]);

    const handleFileInputClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleAlgorithmToggle = useCallback((algorithmId) => {
        // single-select algorithm
        setAnalysisConfig((prev) => ({
            ...prev,
            algorithms: [algorithmId],
        }));
    }, []);

    const handleCommodityToggle = useCallback((commodity) => {
        setAnalysisConfig((prev) => ({
            ...prev,
            commodities: prev.commodities.includes(commodity)
                ? prev.commodities.filter((c) => c !== commodity)
                : [...prev.commodities, commodity],
        }));
    }, []);

    const handleClusterChange = useCallback((value) => {
        setAnalysisConfig((prev) => ({
            ...prev,
            numClusters: parseInt(value),
        }));
    }, []);

    const handleYearRangeChange = useCallback((key, value) => {
        const numeric = parseInt(value);
        setAnalysisConfig((prev) => {
            const next = {
                ...prev,
                yearRange: { ...prev.yearRange, [key]: numeric },
            };
            if (next.yearRange.start > next.yearRange.end) {
                if (key === "start") next.yearRange.end = numeric;
                else next.yearRange.start = numeric;
            }
            // clamp 2020-2025
            next.yearRange.start = Math.max(
                2020,
                Math.min(2025, next.yearRange.start)
            );
            next.yearRange.end = Math.max(
                2020,
                Math.min(2025, next.yearRange.end)
            );
            return next;
        });
    }, []);

    // toggleProvince / toggleCity are handled inside LocationModal now

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    }, []);

    const tabs = [
        { id: "algorithms", label: "Algoritma", icon: "🤖" },
        { id: "config", label: "Config", icon: "⚙️" },
        { id: "upload", label: "Upload", icon: "📤" },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Mode Selector */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <span>🔧</span>
                    <span>Mode Analisis</span>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => setMode("research")}
                        className={`p-3 rounded-xl text-left transition-all duration-300 ${
                            mode === "research"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">🔬</span>
                            <div>
                                <div className="font-semibold text-sm">
                                    Hasil Penelitian
                                </div>
                                <div
                                    className={`text-xs ${
                                        mode === "research"
                                            ? "text-blue-100"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Data clustering yang telah dianalisis
                                </div>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setMode("user")}
                        className={`p-3 rounded-xl text-left transition-all duration-300 ${
                            mode === "user"
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">📊</span>
                            <div>
                                <div className="font-semibold text-sm">
                                    Analisis Data Anda
                                </div>
                                <div
                                    className={`text-xs ${
                                        mode === "user"
                                            ? "text-green-100"
                                            : "text-gray-500"
                                    }`}
                                >
                                    Upload dan analisis data kustom
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {mode === "research" ? (
                /* Research Mode */
                <div className="space-y-4 flex-grow overflow-y-auto">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">🎯</span>
                        <h3 className="font-semibold text-gray-900">
                            Profil Klaster
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {data.clusters.map((cluster, index) => (
                            <div
                                key={cluster.id}
                                className="group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-102"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${cluster.bgColor} shadow-md group-hover:scale-125 transition-transform duration-300`}
                                    ></div>
                                    <div className="flex-1">
                                        <div
                                            className={`font-semibold text-sm ${cluster.color} mb-1`}
                                        >
                                            Klaster {index + 1}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {cluster.name.split(": ")[1]}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {
                                                data.cities.filter(
                                                    (city) =>
                                                        city.clusterId ===
                                                        cluster.id
                                                ).length
                                            }{" "}
                                            kota/kabupaten
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Research Stats */}
                    <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="text-center">
                            <div className="text-xl mb-2">📈</div>
                            <div className="text-xs font-medium text-blue-800">
                                Akurasi Clustering
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                                94.2%
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                                Silhouette Score: 0.847
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* User Mode with Tabs */
                <div className="flex-grow flex flex-col space-y-3 min-w-0 overflow-hidden max-h-[600px]">
                    {/* Data Source Selector */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">
                            Sumber Data
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <label
                                className={`p-3 rounded-lg border cursor-pointer ${
                                    analysisConfig.dataSource === "app"
                                        ? "bg-blue-50 border-blue-300"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="dataSource"
                                    value="app"
                                    className="sr-only"
                                    checked={
                                        analysisConfig.dataSource === "app"
                                    }
                                    onChange={() =>
                                        setAnalysisConfig((p) => ({
                                            ...p,
                                            dataSource: "app",
                                        }))
                                    }
                                />
                                <div className="flex items-center space-x-2">
                                    <span>📚</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        Data Aplikasi
                                    </span>
                                </div>
                            </label>
                            <label
                                className={`p-3 rounded-lg border cursor-pointer ${
                                    analysisConfig.dataSource === "upload"
                                        ? "bg-green-50 border-green-300"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="dataSource"
                                    value="upload"
                                    className="sr-only"
                                    checked={
                                        analysisConfig.dataSource === "upload"
                                    }
                                    onChange={() =>
                                        setAnalysisConfig((p) => ({
                                            ...p,
                                            dataSource: "upload",
                                        }))
                                    }
                                />
                                <div className="flex items-center space-x-2">
                                    <span>📤</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        Upload Data
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                    {/* Tab Navigation */}
                    <div className="flex bg-gray-100 rounded-lg p-1 min-w-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center space-x-1 py-2 px-2 rounded-md text-xs font-medium transition-all duration-200 min-w-0 ${
                                    activeTab === tab.id
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-blue-600"
                                }`}
                            >
                                <span className="text-sm flex-shrink-0">
                                    {tab.icon}
                                </span>
                                <span className="truncate">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content (internal scroll) */}
                    <div className="flex-grow overflow-y-auto pr-1">
                        {activeTab === "algorithms" && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900">
                                    Pilih Algoritma Clustering
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {availableAlgorithms.map((algorithm) => (
                                        <label
                                            key={algorithm.id}
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                analysisConfig.algorithms.includes(
                                                    algorithm.id
                                                )
                                                    ? "bg-blue-50 border-blue-300 shadow-sm"
                                                    : "bg-white border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={analysisConfig.algorithms.includes(
                                                    algorithm.id
                                                )}
                                                onChange={() =>
                                                    handleAlgorithmToggle(
                                                        algorithm.id
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div className="flex items-center space-x-3 w-full">
                                                <span className="text-lg">
                                                    {algorithm.icon}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {algorithm.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {algorithm.description}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                        analysisConfig.algorithms.includes(
                                                            algorithm.id
                                                        )
                                                            ? "bg-blue-500 border-blue-500"
                                                            : "border-gray-300"
                                                    }`}
                                                >
                                                    {analysisConfig.algorithms.includes(
                                                        algorithm.id
                                                    ) && (
                                                        <span className="text-white text-xs">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "config" && (
                            <div className="space-y-6">
                                {/* Number of Clusters */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">
                                            Jumlah Klaster
                                        </h4>
                                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                            {analysisConfig.numClusters}
                                        </div>
                                    </div>
                                    <div
                                        className={`bg-white p-3 rounded-lg border ${
                                            analysisConfig.dataSource ===
                                            "upload"
                                                ? "opacity-50 pointer-events-none border-gray-200"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <div className="space-y-2">
                                            <input
                                                type="range"
                                                min="2"
                                                max="10"
                                                value={
                                                    analysisConfig.numClusters
                                                }
                                                onChange={(e) =>
                                                    handleClusterChange(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>2</span>
                                                <span>10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Year Range Selection */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">
                                            Tahun
                                        </h4>
                                        <div className="text-xs text-blue-600 font-medium">
                                            2020 - 2025
                                        </div>
                                    </div>
                                    <div
                                        className={`bg-white p-3 rounded-lg border ${
                                            analysisConfig.dataSource ===
                                            "upload"
                                                ? "opacity-50 pointer-events-none border-gray-200"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">
                                                    Mulai
                                                </label>
                                                <input
                                                    type="number"
                                                    min={2020}
                                                    max={2025}
                                                    value={
                                                        analysisConfig.yearRange
                                                            .start
                                                    }
                                                    onChange={(e) =>
                                                        handleYearRangeChange(
                                                            "start",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">
                                                    Selesai
                                                </label>
                                                <input
                                                    type="number"
                                                    min={2020}
                                                    max={2025}
                                                    value={
                                                        analysisConfig.yearRange
                                                            .end
                                                    }
                                                    onChange={(e) =>
                                                        handleYearRangeChange(
                                                            "end",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Province and Cities Selection (launch modal) */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">
                                            Provinsi & Kota
                                        </h4>
                                        <div className="text-xs text-blue-600 font-medium">
                                            {
                                                analysisConfig.locations.cities
                                                    .length
                                            }{" "}
                                            kota dipilih
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setLocationModalOpen(true)
                                        }
                                        className={`w-full px-3 py-2 text-sm rounded-lg border ${
                                            analysisConfig.dataSource ===
                                            "upload"
                                                ? "opacity-50 pointer-events-none"
                                                : "bg-white hover:bg-gray-50"
                                        }`}
                                    >
                                        Pilih Provinsi & Kota
                                    </button>
                                    <LocationModal
                                        open={locationModalOpen}
                                        onClose={() =>
                                            setLocationModalOpen(false)
                                        }
                                        citiesByProvince={citiesByProvince}
                                        selected={analysisConfig.locations}
                                        onChange={(next) =>
                                            setAnalysisConfig((p) => ({
                                                ...p,
                                                locations: next,
                                            }))
                                        }
                                        disabled={
                                            analysisConfig.dataSource ===
                                            "upload"
                                        }
                                    />
                                </div>

                                {/* Commodities Selection */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">
                                            Komoditas
                                        </h4>
                                        <div className="text-xs text-blue-600 font-medium">
                                            {analysisConfig.commodities.length}{" "}
                                            dipilih
                                        </div>
                                    </div>
                                    <div
                                        className={`bg-white p-3 rounded-lg border max-h-32 overflow-y-auto ${
                                            analysisConfig.dataSource ===
                                            "upload"
                                                ? "opacity-50 pointer-events-none border-gray-200"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <div className="grid grid-cols-2 gap-2">
                                            {availableCommodities.map(
                                                (commodity) => (
                                                    <label
                                                        key={commodity}
                                                        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={analysisConfig.commodities.includes(
                                                                commodity
                                                            )}
                                                            onChange={() =>
                                                                handleCommodityToggle(
                                                                    commodity
                                                                )
                                                            }
                                                            className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="text-xs text-gray-700">
                                                            {commodity}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "upload" && (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600">
                                    <p className="mb-2">
                                        Unggah file ZIP berisi data harga pangan
                                        untuk dianalisis dengan konfigurasi yang
                                        dipilih.
                                    </p>
                                    {analysisConfig.dataSource === "app" ? (
                                        <div className="flex items-center space-x-2 text-xs text-blue-600">
                                            <span>ℹ️</span>
                                            <span>
                                                Aktifkan "Upload Data" pada
                                                Sumber Data untuk mengunggah
                                                file
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 text-xs text-blue-600">
                                            <span>💡</span>
                                            <span>
                                                Format: CSV dengan kolom kota,
                                                komoditas, harga, tanggal
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Compact Drag & Drop Area */}
                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ${
                                        dragActive
                                            ? "border-blue-400 bg-blue-50"
                                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                    }`}
                                    style={{
                                        opacity:
                                            analysisConfig.dataSource ===
                                            "upload"
                                                ? 1
                                                : 0.5,
                                        pointerEvents:
                                            analysisConfig.dataSource ===
                                            "upload"
                                                ? "auto"
                                                : "none",
                                    }}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept=".zip"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    <div className="space-y-3">
                                        <div className="text-3xl">
                                            {dragActive ? "📥" : "📁"}
                                        </div>

                                        {selectedFile ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-center space-x-2 text-green-600">
                                                    <span>✅</span>
                                                    <span className="font-medium text-sm">
                                                        {selectedFile.name}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {(
                                                        selectedFile.size / 1024
                                                    ).toFixed(1)}{" "}
                                                    KB
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-gray-600 font-medium text-sm">
                                                    {dragActive
                                                        ? "Lepas file di sini"
                                                        : "Drag & drop file ZIP atau"}
                                                </p>
                                                <button
                                                    onClick={
                                                        handleFileInputClick
                                                    }
                                                    className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm"
                                                >
                                                    pilih file
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Template Download */}
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-yellow-600">
                                            📋
                                        </span>
                                        <div className="flex-1">
                                            <div className="font-medium text-yellow-800 text-sm mb-1">
                                                Template Format Data
                                            </div>
                                            <a
                                                href="#"
                                                className="inline-flex items-center space-x-2 text-xs font-medium text-yellow-800 hover:text-yellow-900 underline"
                                            >
                                                <span>⬇️</span>
                                                <span>
                                                    Download Template.zip
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fixed Bottom Section - Configuration Summary & Submit */}
                    <div className="space-y-3 border-t pt-3 sticky bottom-0 bg-white">
                        {/* Compact Analysis Summary */}
                        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <div className="text-xs text-indigo-700 space-y-1">
                                <div>
                                    <strong>Algoritma:</strong>{" "}
                                    {analysisConfig.algorithms.length > 0
                                        ? analysisConfig.algorithms
                                              .map(
                                                  (alg) =>
                                                      availableAlgorithms.find(
                                                          (a) => a.id === alg
                                                      )?.name
                                              )
                                              .join(", ")
                                        : "Belum dipilih"}
                                </div>
                                <div>
                                    <strong>Klaster:</strong>{" "}
                                    {analysisConfig.numClusters} |{" "}
                                    <strong>Komoditas:</strong>{" "}
                                    {analysisConfig.commodities.length}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={(function () {
                                const isUploadMode =
                                    analysisConfig.dataSource === "upload";
                                if (isLoading) return true;
                                if (analysisConfig.algorithms.length === 0)
                                    return true;
                                if (isUploadMode) {
                                    return !selectedFile;
                                }
                                return false;
                            })()}
                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${(function () {
                                const isUploadMode =
                                    analysisConfig.dataSource === "upload";
                                const disabledBase =
                                    isLoading ||
                                    analysisConfig.algorithms.length === 0 ||
                                    (isUploadMode && !selectedFile);
                                return disabledBase
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl";
                            })()}`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm">
                                            Menganalisis...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>🚀</span>
                                        <span className="text-sm">
                                            Mulai Analisis
                                        </span>
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Error Display */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center space-x-2 text-red-700">
                                    <span>❌</span>
                                    <span className="font-medium text-sm">
                                        Error:
                                    </span>
                                </div>
                                <p className="text-xs text-red-600 mt-1">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(ControlPanel);

// Location selection modal
export const LocationModal = ({
    open,
    onClose,
    citiesByProvince,
    selected,
    onChange,
    disabled,
}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Pilih Provinsi & Kota</h3>
                    <button onClick={onClose} className="text-gray-600">
                        ✕
                    </button>
                </div>
                <div
                    className={`flex-1 overflow-y-auto p-4 ${
                        disabled ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                    <div className="space-y-3">
                        {Object.entries(citiesByProvince).map(
                            ([province, cities]) => {
                                const provinces = new Set(selected.provinces);
                                const citiesSet = new Set(selected.cities);
                                const provinceChecked = provinces.has(province);
                                const toggleProv = () => {
                                    const nextProvinces = new Set(
                                        selected.provinces
                                    );
                                    const nextCities = new Set(selected.cities);
                                    if (provinceChecked) {
                                        nextProvinces.delete(province);
                                        cities.forEach((c) =>
                                            nextCities.delete(`${c}`)
                                        );
                                    } else {
                                        nextProvinces.add(province);
                                        cities.forEach((c) =>
                                            nextCities.add(`${c}`)
                                        );
                                    }
                                    onChange({
                                        provinces: Array.from(nextProvinces),
                                        cities: Array.from(nextCities),
                                    });
                                };
                                return (
                                    <div
                                        key={province}
                                        className="border-b border-gray-100 pb-2 last:border-b-0"
                                    >
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={provinceChecked}
                                                    onChange={toggleProv}
                                                    className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-800">
                                                    {province}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {cities.length} kota
                                            </span>
                                        </label>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            {cities.map((city) => {
                                                const key = `${city}`;
                                                const checked =
                                                    citiesSet.has(key);
                                                const toggleC = () => {
                                                    const nextProvinces =
                                                        new Set(
                                                            selected.provinces
                                                        );
                                                    const nextCities = new Set(
                                                        selected.cities
                                                    );
                                                    if (checked)
                                                        nextCities.delete(key);
                                                    else nextCities.add(key);
                                                    const allSelected =
                                                        cities.every((c) =>
                                                            nextCities.has(
                                                                `${c}`
                                                            )
                                                        );
                                                    if (allSelected)
                                                        nextProvinces.add(
                                                            province
                                                        );
                                                    else
                                                        nextProvinces.delete(
                                                            province
                                                        );
                                                    onChange({
                                                        provinces:
                                                            Array.from(
                                                                nextProvinces
                                                            ),
                                                        cities: Array.from(
                                                            nextCities
                                                        ),
                                                    });
                                                };
                                                return (
                                                    <label
                                                        key={key}
                                                        className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={toggleC}
                                                            className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                                        />
                                                        <span className="truncate">
                                                            {city}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 rounded-lg border"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onClose}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
};

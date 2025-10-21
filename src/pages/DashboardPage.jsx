import React, { useState, useCallback, useMemo, useEffect } from "react";
import MapComponent from "../components/dashboard/MapComponent";
import ControlPanel from "../components/dashboard/ControlPanel";
import { AnalysisProvider } from "../context/AnalysisContext";
import ChartContainer from "../components/charts/ChartContainer";
import AnalysisWrapper from "../components/dashboard/AnalysisWrapper";
import ValidationHandler from "../components/dashboard/ValidationHandler";
import ValidationFlowHandler from "../components/dashboard/ValidationFlowHandler";

const DashboardPage = () => {
    const [mode, setMode] = useState("research");
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysisId, setAnalysisId] = useState(null);
    const [customAnalysisData, setCustomAnalysisData] = useState(null);
    const [researchResults, setResearchResults] = useState(null);
    const [pendingValidationResult, setPendingValidationResult] =
        useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Load research results on component mount
    useEffect(() => {
        const loadResearchResults = async () => {
            try {
                setIsInitialLoading(true);
                const response = await fetch("/data/researchResults.json");
                if (!response.ok)
                    throw new Error("Failed to load research data");
                const data = await response.json();
                setResearchResults(data);
                setAnalysisData(data);
            } catch (err) {
                console.error("Error loading research results:", err);
                setError("Failed to load research data");
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadResearchResults();
    }, []);

    const handleFileUpload = useCallback(
        async ({ source, file, config, validationId }) => {
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

                    // Call validation endpoint first
                    const formData = new FormData();
                    formData.append("file", file);

                    const validationResponse = await fetch(
                        "http://127.0.0.1:8000/clustering_app/validate-data",
                        {
                            method: "POST",
                            body: formData,
                        }
                    );

                    console.log("=== VALIDATION RESPONSE STATUS ===");
                    console.log("Status:", validationResponse.status);
                    console.log("Status Text:", validationResponse.statusText);
                    console.log("Headers:", validationResponse.headers);

                    if (!validationResponse.ok) {
                        const errorData = await validationResponse.json();
                        console.error("Validation Error Response:", errorData);

                        // Extract error message from the response structure
                        let errorMessage = "Validation failed";
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (
                            errorData.errors &&
                            errorData.errors.length > 0
                        ) {
                            errorMessage = errorData.errors.join(", ");
                        } else if (
                            errorData.details &&
                            errorData.details.format_errors &&
                            errorData.details.format_errors.length > 0
                        ) {
                            errorMessage =
                                errorData.details.format_errors.join(", ");
                        }

                        throw new Error(`Validation Error: ${errorMessage}`);
                    }

                    let validationResult;
                    try {
                        const responseText = await validationResponse.text();
                        console.log("Raw response:", responseText);
                        validationResult = JSON.parse(responseText);
                    } catch (parseError) {
                        console.error("JSON Parse Error:", parseError);
                        throw new Error(
                            "Invalid JSON response from validation endpoint"
                        );
                    }

                    console.log("=== VALIDATION RESPONSE ===");
                    console.log(validationResult);

                    // Store validation result to be handled by ValidationFlowHandler
                    setPendingValidationResult(validationResult);
                    return; // Don't proceed with analysis yet
                } else if (source === "validated_upload") {
                    // Handle validated analysis submission
                    const response = await fetch(
                        "http://127.0.0.1:8000/clustering_app/analyze",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                validation_id: validationId,
                                commodities: config.commodities,
                                cities: config.cities,
                                provinces: config.provinces,
                                year_min: config.yearRange.start,
                                year_max: config.yearRange.end,
                                algorithms: config.algorithms,
                                num_clusters: config.numClusters,
                            }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Server Error: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log("=== VALIDATED ANALYSIS RESPONSE ===");
                    console.log(result);
                    setAnalysisData(result);
                    setCustomAnalysisData(result);

                    if (result.analysis_id) {
                        setAnalysisId(result.analysis_id);
                        console.log(
                            "Analysis ID received:",
                            result.analysis_id
                        );
                    }
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

                    console.log("=== APP DATA RESPONSE STATUS ===");
                    console.log("Status:", response.status);
                    console.log("Status Text:", response.statusText);

                    if (!response.ok) {
                        try {
                            const errorData = await response.json();
                            console.error(
                                "App Data Error Response:",
                                errorData
                            );

                            // Extract error message from the response structure
                            let errorMessage = "Server error occurred";
                            if (errorData.message) {
                                errorMessage = errorData.message;
                            } else if (
                                errorData.errors &&
                                errorData.errors.length > 0
                            ) {
                                errorMessage = errorData.errors.join(", ");
                            } else if (
                                errorData.details &&
                                errorData.details.format_errors &&
                                errorData.details.format_errors.length > 0
                            ) {
                                errorMessage =
                                    errorData.details.format_errors.join(", ");
                            }

                            throw new Error(`Server Error: ${errorMessage}`);
                        } catch (parseError) {
                            // If JSON parsing fails, fall back to text response
                            console.error("JSON parse error:", parseError);
                            const errorText = await response.text();
                            console.error(
                                "App Data Error Response (text):",
                                errorText
                            );
                            throw new Error(
                                `Server Error: ${response.status} - ${errorText}`
                            );
                        }
                    }

                    const result = await response.json();
                    console.log("=== RESPONSE DARI DJANGO (APP DATA) ===");
                    console.log(result);
                    setAnalysisData(result);
                    setCustomAnalysisData(result); // Store custom analysis results

                    // Store analysis_id if present in response
                    if (result.analysis_id) {
                        setAnalysisId(result.analysis_id);
                        console.log(
                            "Analysis ID received:",
                            result.analysis_id
                        );
                    }

                    // Show success message
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 5000); // Auto-hide after 5 seconds
                }
            } catch (err) {
                console.error(err);
                setError(err.message || "Gagal memproses permintaan.");
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const handleModeChange = useCallback(
        (newMode) => {
            setMode(newMode);
            if (newMode === "research") {
                setAnalysisData(researchResults);
                setError(null);
            } else if (newMode === "user") {
                if (customAnalysisData) {
                    setAnalysisData(customAnalysisData);
                } else {
                    setAnalysisData(null); // Trigger empty state
                }
                setError(null);
            }
        },
        [customAnalysisData, researchResults]
    );

    const memoizedAnalysisData = useMemo(() => analysisData, [analysisData]);

    // Validation handlers
    const handleValidatedAnalysis = useCallback(
        async (validationId, config) => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    "http://127.0.0.1:8000/clustering_app/analyze",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            validation_id: validationId,
                            algorithms: config.algorithms,
                            numClusters: config.numClusters,
                            commodities: config.commodities,
                            yearRange: {
                                start: config.yearRange.start,
                                end: config.yearRange.end,
                            },
                            locations: {
                                provinces: config.provinces,
                                cities: config.cities,
                            },
                        }),
                    }
                );

                console.log("=== VALIDATED ANALYSIS RESPONSE STATUS ===");
                console.log("Status:", response.status);
                console.log("Status Text:", response.statusText);

                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        console.error(
                            "Validated Analysis Error Response:",
                            errorData
                        );

                        // Extract error message from the response structure
                        let errorMessage = "Server error occurred";
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (
                            errorData.errors &&
                            errorData.errors.length > 0
                        ) {
                            errorMessage = errorData.errors.join(", ");
                        } else if (
                            errorData.details &&
                            errorData.details.format_errors &&
                            errorData.details.format_errors.length > 0
                        ) {
                            errorMessage =
                                errorData.details.format_errors.join(", ");
                        }

                        throw new Error(`Server Error: ${errorMessage}`);
                    } catch (parseError) {
                        // If JSON parsing fails, fall back to text response
                        console.error("JSON parse error:", parseError);
                        const errorText = await response.text();
                        console.error(
                            "Validated Analysis Error Response (text):",
                            errorText
                        );
                        throw new Error(
                            `Server Error: ${response.status} - ${errorText}`
                        );
                    }
                }

                const result = await response.json();
                console.log("=== VALIDATED ANALYSIS RESPONSE ===");
                console.log(result);
                setAnalysisData(result);
                setCustomAnalysisData(result);

                if (result.analysis_id) {
                    setAnalysisId(result.analysis_id);
                    console.log("Analysis ID received:", result.analysis_id);
                }

                // Show success message
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 5000); // Auto-hide after 5 seconds
            } catch (err) {
                console.error(err);
                setError(err.message || "Gagal memproses permintaan.");
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const handleReupload = useCallback(() => {
        // Clear selected file and close error modal
        // This will be handled by context
    }, []);

    // Show loading state only for initial data loading
    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading research data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow bg-gradient-to-br from-gray-50 to-white min-h-screen">
            {/* Success Message Popup */}
            {showSuccessMessage && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
                    <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-lg">
                                        ✓
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-green-800">
                                    Analisis Berhasil!
                                </h3>
                                <p className="text-sm text-green-700 mt-1">
                                    Data clustering telah diproses dan
                                    ditampilkan di dashboard.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSuccessMessage(false)}
                                className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
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
                                    <AnalysisWrapper analysisId={analysisId}>
                                        <ControlPanel
                                            mode={mode}
                                            setMode={handleModeChange}
                                            onFileUpload={handleFileUpload}
                                            isLoading={isLoading}
                                            error={error}
                                            data={memoizedAnalysisData}
                                        />
                                        <ValidationFlowHandler
                                            validationResult={
                                                pendingValidationResult
                                            }
                                            onValidatedAnalysis={
                                                handleValidatedAnalysis
                                            }
                                            onReupload={handleReupload}
                                            onClear={() =>
                                                setPendingValidationResult(null)
                                            }
                                        />
                                        <ValidationHandler
                                            onValidatedAnalysis={
                                                handleValidatedAnalysis
                                            }
                                            onReupload={handleReupload}
                                            isLoading={isLoading}
                                        />
                                    </AnalysisWrapper>
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
                            value: memoizedAnalysisData?.cities?.length || 0,
                            icon: "🏙️",
                            color: "from-blue-500 to-blue-600",
                            change: memoizedAnalysisData ? "+2.5%" : "N/A",
                        },
                        {
                            title: "Klaster Aktif",
                            value: memoizedAnalysisData?.clusters?.length || 0,
                            icon: "🎯",
                            color: "from-green-500 to-green-600",
                            change: memoizedAnalysisData ? "Optimal" : "N/A",
                        },
                        {
                            title: "Komoditas",
                            value: memoizedAnalysisData?.trends
                                ? Object.keys(memoizedAnalysisData.trends)
                                      .length
                                : 0,
                            icon: "🌾",
                            color: "from-yellow-500 to-yellow-600",
                            change: memoizedAnalysisData ? "Lengkap" : "N/A",
                        },
                        {
                            title: "Periode Data",
                            value: memoizedAnalysisData?.years?.length || 0,
                            icon: "📅",
                            color: "from-purple-500 to-purple-600",
                            change: memoizedAnalysisData ? "Tahun" : "N/A",
                        },
                    ].map((stat, index) => (
                        <div key={index} className="group">
                            <div
                                className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${
                                    !memoizedAnalysisData ? "opacity-60" : ""
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <span
                                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                                            memoizedAnalysisData
                                                ? "text-green-600 bg-green-100"
                                                : "text-gray-500 bg-gray-100"
                                        }`}
                                    >
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

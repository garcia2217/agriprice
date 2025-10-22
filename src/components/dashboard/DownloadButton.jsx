import React, { useState } from "react";
import { useAnalysis } from "../../context/AnalysisContext";

const DownloadButton = () => {
    const { analysisId } = useAnalysis();
    const [isDownloading, setIsDownloading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleDownloadPDF = async () => {
        if (!analysisId) {
            setToast({
                type: "error",
                message: "No analysis ID available. Please run analysis first.",
            });
            return;
        }

        setIsDownloading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/clustering_app/download-pdf/${analysisId}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `clustering_analysis_${analysisId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setToast({
                type: "success",
                message: "PDF downloaded successfully!",
            });
        } catch (error) {
            setToast({
                type: "error",
                message: `Download failed: ${error.message}`,
            });
        } finally {
            setIsDownloading(false);
        }
    };

    // Auto-hide toast after 3 seconds
    React.useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <>
            <button
                onClick={handleDownloadPDF}
                disabled={!analysisId || isDownloading}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    !analysisId || isDownloading
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                }`}
            >
                <div className="flex items-center justify-center space-x-2">
                    {isDownloading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Downloading...</span>
                        </>
                    ) : (
                        <>
                            <span>📥</span>
                            <span className="text-sm">Download PDF</span>
                        </>
                    )}
                </div>
            </button>

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg z-[9999] max-w-sm ${
                        toast.type === "success"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                    }`}
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-lg">
                            {toast.type === "success" ? "✅" : "❌"}
                        </span>
                        <span className="text-sm font-medium">
                            {toast.message}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default DownloadButton;

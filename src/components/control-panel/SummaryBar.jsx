import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import { availableAlgorithms } from "../../constants/analysis";

const SummaryBar = ({ isLoading, error, onFileUpload }) => {
    const { analysisConfig, selectedFile, actions } = useAnalysis();
    const isUploadMode = analysisConfig.dataSource === "upload";
    const disabled = (function () {
        if (isLoading) return true;
        if (analysisConfig.algorithms.length === 0) return true;
        if (isUploadMode) return !selectedFile;
        return false;
    })();

    return (
        <div className="space-y-3 border-t pt-3 sticky bottom-0 bg-white">
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
                        <strong>Klaster:</strong> {analysisConfig.numClusters} |{" "}
                        <strong>Komoditas:</strong>{" "}
                        {analysisConfig.commodities.length}
                    </div>
                </div>
            </div>

            <button
                onClick={() => actions.submitAnalysis({ onFileUpload })}
                disabled={disabled}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    disabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                }`}
            >
                <div className="flex items-center justify-center space-x-2">
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Menganalisis...</span>
                        </>
                    ) : (
                        <>
                            <span>🚀</span>
                            <span className="text-sm">Mulai Analisis</span>
                        </>
                    )}
                </div>
            </button>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-700">
                        <span>❌</span>
                        <span className="font-medium text-sm">Error:</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
            )}
        </div>
    );
};

export default React.memo(SummaryBar);

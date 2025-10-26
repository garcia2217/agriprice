import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";

const ModeSelector = ({ mode, onChangeMode }) => {
    const { setMode } = useAnalysis();
    const handleSetMode = (next) => {
        setMode(next);
        if (onChangeMode) onChangeMode(next);
    };
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>🔧</span>
                <span>Mode Analisis</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
                <button
                    onClick={() => handleSetMode("research")}
                    className={`p-3 rounded-xl text-left transition-all duration-300 h-20 ${
                        mode === "research"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                    }`}
                >
                    <div className="flex items-center space-x-3 h-full">
                        <span className="text-lg">🔬</span>
                        <div className="flex flex-col justify-center">
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
                    onClick={() => handleSetMode("user")}
                    className={`p-3 rounded-xl text-left transition-all duration-300 h-20 ${
                        mode === "user"
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                    }`}
                >
                    <div className="flex items-center space-x-3 h-full">
                        <span className="text-lg">📊</span>
                        <div className="flex flex-col justify-center">
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
    );
};

export default React.memo(ModeSelector);

import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import { availableAlgorithms } from "../../constants/analysis";

const AlgorithmSelector = () => {
    const { analysisConfig, actions } = useAnalysis();
    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
                Pilih Algoritma Clustering
            </h4>
            <div className="grid grid-cols-1 gap-3">
                {availableAlgorithms.map((algorithm) => (
                    <label
                        key={algorithm.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            analysisConfig.algorithms.includes(algorithm.id)
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
                                actions.toggleAlgorithm(algorithm.id)
                            }
                            className="sr-only"
                        />
                        <div className="flex items-center space-x-3 w-full">
                            <span className="text-lg">{algorithm.icon}</span>
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
    );
};

export default React.memo(AlgorithmSelector);

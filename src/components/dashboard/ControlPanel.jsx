import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import ModeSelector from "../control-panel/ModeSelector";
import Tabs from "../control-panel/Tabs";
import AlgorithmSelector from "../control-panel/AlgorithmSelector";
import ConfigPanel from "../control-panel/ConfigPanel";
import UploadPanel from "../control-panel/UploadPanel";
import SummaryBar from "../control-panel/SummaryBar";

const ControlPanel = ({
    mode,
    setMode,
    onFileUpload,
    isLoading,
    error,
    data,
}) => {
    const { analysisConfig, ui, actions } = useAnalysis();

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Mode Selector */}
            <ModeSelector mode={mode} onChangeMode={setMode} />

            {mode === "research" ? (
                /* Research Mode */
                <div className="space-y-4 flex-grow overflow-y-auto">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">🎯</span>
                        <h3 className="font-semibold text-gray-900">
                            Profil Klaster
                        </h3>
                    </div>

                    {data && data.clusters && data.clusters.length > 0 ? (
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
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">📊</div>
                            <p className="text-sm">Belum ada data klaster</p>
                        </div>
                    )}

                    {/* Research Stats */}
                    {/* <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
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
                    </div> */}
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
                                        actions.setDataSource("app")
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
                                        actions.setDataSource("upload")
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
                    <Tabs />

                    {/* Tab Content (internal scroll) */}
                    <div className="flex-grow overflow-y-auto pr-1">
                        {ui.activeTab === "algorithms" && <AlgorithmSelector />}
                        {ui.activeTab === "config" && <ConfigPanel />}
                        {ui.activeTab === "upload" && <UploadPanel />}
                    </div>

                    {/* Fixed Bottom Section - Configuration Summary & Submit */}
                    <SummaryBar
                        isLoading={isLoading}
                        error={error}
                        onFileUpload={onFileUpload}
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(ControlPanel);

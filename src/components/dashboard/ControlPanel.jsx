import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import ModeSelector from "../control-panel/ModeSelector";
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
            <h3 className="font-semibold text-gray-900">Profil Klaster</h3>
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
                        Klaster {cluster.id}
                      </div>
                      <div className="text-xs text-gray-600">
                        {cluster.name.split(": ")[1]}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {
                          data.cities.filter(
                            (city) => city.clusterId === cluster.id
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

          {/* Research Info Card */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">ℹ️</span>
              <div className="space-y-2 text-blue-900">
                <p>
                  <strong>Metode:</strong> Hasil clustering data harga pangan
                  menggunakan algoritma{" "}
                  <span className="font-medium">Spectral Clustering</span>{" "}
                  dengan jumlah klaster (k) = 2.
                </p>
                <p>
                  <strong>Analisis:</strong> Klaster dibagi berdasarkan pola
                  kemiripan tren harga komoditas antar wilayah selama periode
                  2020-2024.
                </p>
              </div>
            </div>
          </div>

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
            <h4 className="font-semibold text-gray-900">Sumber Data</h4>
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
                  checked={analysisConfig.dataSource === "app"}
                  onChange={() => {
                    actions.setDataSource("app");
                    actions.setActiveTab("algorithms");
                  }}
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
                  checked={analysisConfig.dataSource === "upload"}
                  onChange={() => {
                    actions.setDataSource("upload");
                    actions.setActiveTab("upload");
                  }}
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
          {/* Conditional Tab Navigation and Content */}
          {analysisConfig.dataSource === "app" ? (
            /* Data Aplikasi Mode - Show Algorithm + Config tabs */
            <>
              {/* Tab Navigation - Only Algorithm and Config */}
              <div className="flex bg-gray-100 rounded-lg p-1 min-w-0">
                {[
                  {
                    id: "algorithms",
                    label: "Algoritma",
                    icon: "🤖",
                  },
                  {
                    id: "config",
                    label: "Config",
                    icon: "⚙️",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => actions.setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 px-2 rounded-md text-xs font-medium transition-all duration-200 min-w-0 ${
                      ui.activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <span className="text-sm flex-shrink-0">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content (internal scroll) */}
              <div className="flex-grow overflow-y-auto pr-1">
                {ui.activeTab === "algorithms" && <AlgorithmSelector />}
                {ui.activeTab === "config" && <ConfigPanel />}
              </div>
            </>
          ) : (
            /* Upload Data Mode - Show upload content directly without tabs */
            <div className="flex-grow overflow-y-auto pr-1">
              <UploadPanel />
            </div>
          )}

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

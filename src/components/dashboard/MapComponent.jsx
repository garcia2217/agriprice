import React from "react";
import { useMapManager } from "../../hooks/useMapManager";

const MapComponent = ({ data }) => {
    const { mapRef } = useMapManager(data);

    const hasData = data && data.clusters && data.clusters.length > 0;

    return (
        <div className="h-full w-full flex flex-col">
            {/* Map Controls */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                            Legenda:
                        </span>
                        {hasData ? (
                            <div className="flex space-x-3">
                                {data.clusters.map((cluster) => (
                                    <div
                                        key={cluster.id}
                                        className="flex items-center space-x-1"
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full ${cluster.bgColor} shadow-sm`}
                                            style={{
                                                backgroundColor:
                                                    cluster.hexColor,
                                            }}
                                        ></div>
                                        <span className="text-xs text-gray-600">
                                            Klaster {cluster.id + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500 italic">
                                Belum ada data klaster
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>🗺️</span>
                    <span>{data?.cities?.length || 0} lokasi</span>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-grow relative rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                <div
                    ref={mapRef}
                    className="absolute inset-0 z-0"
                    style={{ height: "100%", width: "100%" }}
                ></div>

                {/* Loading Overlay */}
                <div
                    className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 opacity-0 pointer-events-none transition-opacity duration-300"
                    id="map-loading"
                >
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Memuat peta...</p>
                    </div>
                </div>

                {/* Empty State Overlay */}
                {!hasData && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                        <div className="text-center p-8">
                            <div className="text-5xl mb-3">🗺️</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Peta Siap Menampilkan Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Lakukan analisis untuk melihat sebaran klaster
                                di peta
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-blue-700">
                        <span>ℹ️</span>
                        <span className="font-medium">Tips:</span>
                    </div>
                    <div className="text-blue-600">
                        Klik marker untuk detail informasi
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MapComponent);

import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import { availableCommodities } from "../../constants/analysis";
import citiesByProvince from "../../data/cities.json";

const ConfigPanel = () => {
    const { analysisConfig, actions, ui } = useAnalysis();
    const isUpload = analysisConfig.dataSource === "upload";
    return (
        <div className="space-y-6">
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
                        isUpload
                            ? "opacity-50 pointer-events-none border-gray-200"
                            : "border-gray-200"
                    }`}
                >
                    <div className="space-y-2">
                        <input
                            type="range"
                            min="2"
                            max="10"
                            value={analysisConfig.numClusters}
                            onChange={(e) =>
                                actions.setNumClusters(e.target.value)
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

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Tahun</h4>
                    <div className="text-xs text-blue-600 font-medium">
                        2020 - 2024
                    </div>
                </div>
                <div
                    className={`bg-white p-3 rounded-lg border ${
                        isUpload
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
                                max={2024}
                                value={analysisConfig.yearRange.start}
                                onChange={(e) =>
                                    actions.setYearRange(
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
                                max={2024}
                                value={analysisConfig.yearRange.end}
                                onChange={(e) =>
                                    actions.setYearRange("end", e.target.value)
                                }
                                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                            Provinsi & Kota
                        </h4>
                        <div className="text-xs text-blue-600 font-medium">
                            {analysisConfig.locations.cities.length} kota
                            dipilih
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={actions.selectAllLocations}
                            disabled={isUpload}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-blue-200"
                        >
                            Pilih Semua
                        </button>
                        <button
                            onClick={actions.deselectAllLocations}
                            disabled={isUpload}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
                        >
                            Hapus Semua
                        </button>
                    </div>
                </div>
                <button
                    onClick={actions.openLocationModal}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        isUpload
                            ? "opacity-50 pointer-events-none"
                            : "bg-white hover:bg-gray-50"
                    }`}
                >
                    Pilih Provinsi & Kota
                </button>
                {ui.locationModalOpen && (
                    <div className="fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-black/30"
                            onClick={actions.closeLocationModal}
                        />
                        <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold">
                                    Pilih Provinsi & Kota
                                </h3>
                                <button
                                    onClick={actions.closeLocationModal}
                                    className="text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div
                                className={`flex-1 overflow-y-auto p-4 ${
                                    isUpload
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }`}
                            >
                                <div className="space-y-3">
                                    {Object.entries(citiesByProvince).map(
                                        ([province, cities]) => {
                                            const provinces = new Set(
                                                analysisConfig.locations.provinces
                                            );
                                            const citiesSet = new Set(
                                                analysisConfig.locations.cities
                                            );
                                            const provinceChecked =
                                                provinces.has(province);
                                            const toggleProv = () => {
                                                const nextProvinces = new Set(
                                                    analysisConfig.locations.provinces
                                                );
                                                const nextCities = new Set(
                                                    analysisConfig.locations.cities
                                                );
                                                if (provinceChecked) {
                                                    nextProvinces.delete(
                                                        province
                                                    );
                                                    cities.forEach((c) =>
                                                        nextCities.delete(
                                                            `${c}`
                                                        )
                                                    );
                                                } else {
                                                    nextProvinces.add(province);
                                                    cities.forEach((c) =>
                                                        nextCities.add(`${c}`)
                                                    );
                                                }
                                                actions.setLocations({
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
                                                <div
                                                    key={province}
                                                    className="border-b border-gray-100 pb-2 last:border-b-0"
                                                >
                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    provinceChecked
                                                                }
                                                                onChange={
                                                                    toggleProv
                                                                }
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
                                                                citiesSet.has(
                                                                    key
                                                                );
                                                            const toggleC =
                                                                () => {
                                                                    const nextProvinces =
                                                                        new Set(
                                                                            analysisConfig.locations.provinces
                                                                        );
                                                                    const nextCities =
                                                                        new Set(
                                                                            analysisConfig.locations.cities
                                                                        );
                                                                    if (checked)
                                                                        nextCities.delete(
                                                                            key
                                                                        );
                                                                    else
                                                                        nextCities.add(
                                                                            key
                                                                        );
                                                                    const allSelected =
                                                                        cities.every(
                                                                            (
                                                                                c
                                                                            ) =>
                                                                                nextCities.has(
                                                                                    `${c}`
                                                                                )
                                                                        );
                                                                    if (
                                                                        allSelected
                                                                    )
                                                                        nextProvinces.add(
                                                                            province
                                                                        );
                                                                    else
                                                                        nextProvinces.delete(
                                                                            province
                                                                        );
                                                                    actions.setLocations(
                                                                        {
                                                                            provinces:
                                                                                Array.from(
                                                                                    nextProvinces
                                                                                ),
                                                                            cities: Array.from(
                                                                                nextCities
                                                                            ),
                                                                        }
                                                                    );
                                                                };
                                                            return (
                                                                <label
                                                                    key={key}
                                                                    className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            checked
                                                                        }
                                                                        onChange={
                                                                            toggleC
                                                                        }
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
                                    onClick={actions.closeLocationModal}
                                    className="px-3 py-2 rounded-lg border"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={actions.closeLocationModal}
                                    className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                            Komoditas
                        </h4>
                        <div className="text-xs text-blue-600 font-medium">
                            {analysisConfig.commodities.length} dipilih
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={actions.selectAllCommodities}
                            disabled={isUpload}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-blue-200"
                        >
                            Pilih Semua
                        </button>
                        <button
                            onClick={actions.deselectAllCommodities}
                            disabled={isUpload}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
                        >
                            Hapus Semua
                        </button>
                    </div>
                </div>
                <div
                    className={`bg-white p-3 rounded-lg border max-h-32 overflow-y-auto ${
                        isUpload
                            ? "opacity-50 pointer-events-none border-gray-200"
                            : "border-gray-200"
                    }`}
                >
                    <div className="grid grid-cols-2 gap-2">
                        {availableCommodities.map((commodity) => (
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
                                        actions.toggleCommodity(commodity)
                                    }
                                    className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-xs text-gray-700">
                                    {commodity}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ConfigPanel);

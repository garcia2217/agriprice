import React, { useState, useCallback, useEffect } from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import { availableAlgorithms } from "../../constants/analysis";

const ValidationConfigModal = ({ validationResult, onConfirm, onCancel }) => {
    const { analysisConfig, validationConfig, actions } = useAnalysis();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { available_data, warnings, data_quality } = validationResult || {};
    const { commodities, provinces, years } = available_data || {};

    // Handle success state and auto-close modal
    useEffect(() => {
        if (isSuccess) {
            // Show success state for 2 seconds, then close modal
            const timer = setTimeout(() => {
                actions.closeValidationModal();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, actions]);

    // Reset success state when modal opens
    useEffect(() => {
        setIsSuccess(false);
    }, [validationResult]);

    const handleLocationToggle = useCallback(
        (city) => {
            const currentCities = validationConfig?.cities || [];
            const currentProvinces = validationConfig?.provinces || [];

            if (currentCities.includes(city)) {
                // Remove city
                const newCities = currentCities.filter((c) => c !== city);
                actions.setValidationCities(newCities);

                // Find which province this city belongs to
                const cityProvince = Object.keys(provinces || {}).find(
                    (province) => provinces[province].includes(city)
                );

                // Check if province should be unchecked (no cities from this province selected)
                if (cityProvince) {
                    const hasOtherCitiesFromProvince = newCities.some((c) =>
                        provinces[cityProvince].includes(c)
                    );
                    if (!hasOtherCitiesFromProvince) {
                        const newProvinces = currentProvinces.filter(
                            (p) => p !== cityProvince
                        );
                        actions.setValidationProvinces(newProvinces);
                    }
                }
            } else {
                // Add city
                const newCities = [...currentCities, city];
                actions.setValidationCities(newCities);

                // Find which province this city belongs to and add it if not already selected
                const cityProvince = Object.keys(provinces || {}).find(
                    (province) => provinces[province].includes(city)
                );

                if (cityProvince && !currentProvinces.includes(cityProvince)) {
                    actions.setValidationProvinces([
                        ...currentProvinces,
                        cityProvince,
                    ]);
                }
            }
        },
        [validationConfig, actions, provinces]
    );

    const handleProvinceToggle = useCallback(
        (province) => {
            const currentProvinces = validationConfig?.provinces || [];
            const currentCities = validationConfig?.cities || [];

            if (currentProvinces.includes(province)) {
                // Remove province and all its cities
                const newProvinces = currentProvinces.filter(
                    (p) => p !== province
                );
                actions.setValidationProvinces(newProvinces);

                // Remove all cities from this province
                const provinceCities = provinces?.[province] || [];
                const newCities = currentCities.filter(
                    (city) => !provinceCities.includes(city)
                );
                actions.setValidationCities(newCities);
            } else {
                // Add province and all its cities
                actions.setValidationProvinces([...currentProvinces, province]);

                // Add all cities from this province
                const provinceCities = provinces?.[province] || [];
                const newCities = [
                    ...currentCities,
                    ...provinceCities.filter(
                        (city) => !currentCities.includes(city)
                    ),
                ];
                actions.setValidationCities(newCities);
            }
        },
        [validationConfig, actions, provinces]
    );

    const handleCommodityToggle = useCallback(
        (commodity) => {
            const currentCommodities = validationConfig?.commodities || [];

            if (currentCommodities.includes(commodity)) {
                actions.setValidationCommodities(
                    currentCommodities.filter((c) => c !== commodity)
                );
            } else {
                actions.setValidationCommodities([
                    ...currentCommodities,
                    commodity,
                ]);
            }
        },
        [validationConfig, actions]
    );

    const isDisabled =
        !validationConfig?.commodities?.length ||
        !validationConfig?.cities?.length;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
            <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-xl">⚙️</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Konfigurasi Analisis Data
                            </h3>
                            <p className="text-sm text-gray-600">
                                Sesuaikan parameter analisis berdasarkan data
                                yang diunggah
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Jumlah Klaster */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">
                                Jumlah Klaster
                            </h4>
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                {analysisConfig.numClusters}
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
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

                    {/* Tahun */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">
                                Tahun
                            </h4>
                            <div className="text-xs text-blue-600 font-medium">
                                {Math.min(...(years || []))} -{" "}
                                {Math.max(...(years || []))}
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Mulai
                                    </label>
                                    <input
                                        type="number"
                                        min={Math.min(...(years || []))}
                                        max={Math.max(...(years || []))}
                                        value={
                                            validationConfig?.yearRange
                                                ?.start ||
                                            Math.min(...(years || []))
                                        }
                                        onChange={(e) =>
                                            actions.setValidationYearRange(
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
                                        min={Math.min(...(years || []))}
                                        max={Math.max(...(years || []))}
                                        value={
                                            validationConfig?.yearRange?.end ||
                                            Math.max(...(years || []))
                                        }
                                        onChange={(e) =>
                                            actions.setValidationYearRange(
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

                    {/* Provinsi & Kota */}
                    <div>
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                    Provinsi & Kota
                                </h4>
                                <div className="text-xs text-blue-600 font-medium">
                                    {validationConfig?.cities?.length || 0} kota
                                    dipilih
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={
                                        actions.selectAllValidationLocations
                                    }
                                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                                >
                                    Pilih Semua
                                </button>
                                <button
                                    onClick={
                                        actions.deselectAllValidationLocations
                                    }
                                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowLocationModal(true)}
                            className="w-full px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50"
                        >
                            Pilih Provinsi & Kota
                        </button>
                    </div>

                    {/* Komoditas */}
                    <div>
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                    Komoditas
                                </h4>
                                <div className="text-xs text-blue-600 font-medium">
                                    {validationConfig?.commodities?.length || 0}{" "}
                                    dipilih
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={
                                        actions.selectAllValidationCommodities
                                    }
                                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                                >
                                    Pilih Semua
                                </button>
                                <button
                                    onClick={
                                        actions.deselectAllValidationCommodities
                                    }
                                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-2">
                                {commodities?.map((commodity) => (
                                    <label
                                        key={commodity}
                                        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                validationConfig?.commodities?.includes(
                                                    commodity
                                                ) || false
                                            }
                                            onChange={() =>
                                                handleCommodityToggle(commodity)
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

                    {/* Algoritma */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
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
                                            actions.toggleAlgorithm(
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
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batalkan
                    </button>
                    <button
                        onClick={() => {
                            setIsSuccess(true);
                            onConfirm(validationResult.validation_id, {
                                ...validationConfig,
                                algorithms: analysisConfig.algorithms,
                                numClusters: analysisConfig.numClusters,
                            });
                        }}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                            isDisabled
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : isSuccess
                                ? "bg-green-500 text-white"
                                : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        }`}
                    >
                        <div className="flex items-center space-x-2">
                            {isSuccess ? (
                                <>
                                    <span className="text-green-200">✓</span>
                                    <span>Berhasil!</span>
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    <span>Lanjut Analisis</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>

                {/* Location Modal */}
                {showLocationModal && (
                    <div className="fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-black/30"
                            onClick={() => setShowLocationModal(false)}
                        />
                        <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold">
                                    Pilih Provinsi & Kota
                                </h3>
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-3">
                                    {Object.keys(provinces || {}).map(
                                        (province) => {
                                            const provinceCities =
                                                provinces[province] || [];

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
                                                                    validationConfig?.provinces?.includes(
                                                                        province
                                                                    ) || false
                                                                }
                                                                onChange={() =>
                                                                    handleProvinceToggle(
                                                                        province
                                                                    )
                                                                }
                                                                className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                                            />
                                                            <span className="text-sm font-medium text-gray-800">
                                                                {province}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                provinceCities.length
                                                            }{" "}
                                                            kota
                                                        </span>
                                                    </label>
                                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                                        {provinceCities
                                                            .slice(0, 10)
                                                            .map((city) => (
                                                                <label
                                                                    key={city}
                                                                    className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            validationConfig?.cities?.includes(
                                                                                city
                                                                            ) ||
                                                                            false
                                                                        }
                                                                        onChange={() =>
                                                                            handleLocationToggle(
                                                                                city
                                                                            )
                                                                        }
                                                                        className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                                                                    />
                                                                    <span className="truncate">
                                                                        {city}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        {provinceCities.length >
                                                            10 && (
                                                            <div className="text-xs text-gray-500 col-span-2">
                                                                ... dan{" "}
                                                                {provinceCities.length -
                                                                    10}{" "}
                                                                kota lainnya
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="p-4 border-t flex justify-end gap-2">
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="px-3 py-2 rounded-lg border"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ValidationConfigModal);

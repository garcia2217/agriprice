import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import {
    YEAR_MIN,
    YEAR_MAX,
    CLUSTER_MIN,
    CLUSTER_MAX,
    availableCommodities,
} from "../constants/analysis";
import citiesByProvince from "../data/cities.json";

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children, defaultMode = "research" }) => {
    const [mode, setMode] = useState(defaultMode);
    const [analysisConfig, setAnalysisConfig] = useState(() => {
        const allProvinces = Object.keys(citiesByProvince);
        const allCities = Object.values(citiesByProvince).flat();

        return {
            algorithms: ["kmeans"],
            commodities: availableCommodities,
            numClusters: 2,
            yearRange: { start: 2020, end: 2024 },
            locations: {
                provinces: allProvinces,
                cities: allCities,
            },
            dataSource: "app",
        };
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisId, setAnalysisId] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [validationConfig, setValidationConfig] = useState(null);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [ui, setUi] = useState({
        activeTab: "algorithms",
        dragActive: false,
        locationModalOpen: false,
    });

    const setDataSource = useCallback(
        (src) => setAnalysisConfig((p) => ({ ...p, dataSource: src })),
        []
    );
    const toggleAlgorithm = useCallback((id) => {
        setAnalysisConfig((prev) => {
            const alreadySelected = prev.algorithms.includes(id);
            // Prevent removing the last remaining algorithm
            if (alreadySelected && prev.algorithms.length === 1) {
                return prev;
            }
            const nextAlgorithms = alreadySelected
                ? prev.algorithms.filter((alg) => alg !== id)
                : [...prev.algorithms, id];
            return { ...prev, algorithms: nextAlgorithms };
        });
    }, []);
    const toggleCommodity = useCallback(
        (name) =>
            setAnalysisConfig((p) => ({
                ...p,
                commodities: p.commodities.includes(name)
                    ? p.commodities.filter((c) => c !== name)
                    : [...p.commodities, name],
            })),
        []
    );
    const setNumClusters = useCallback(
        (n) =>
            setAnalysisConfig((p) => ({
                ...p,
                numClusters: Math.max(
                    CLUSTER_MIN,
                    Math.min(CLUSTER_MAX, Number(n))
                ),
            })),
        []
    );
    const setYearRange = useCallback((key, value) => {
        const numeric = Number(value);
        setAnalysisConfig((p) => {
            const next = {
                ...p,
                yearRange: { ...p.yearRange, [key]: numeric },
            };
            if (next.yearRange.start > next.yearRange.end) {
                if (key === "start") next.yearRange.end = numeric;
                else next.yearRange.start = numeric;
            }
            next.yearRange.start = Math.max(
                YEAR_MIN,
                Math.min(YEAR_MAX, next.yearRange.start)
            );
            next.yearRange.end = Math.max(
                YEAR_MIN,
                Math.min(YEAR_MAX, next.yearRange.end)
            );
            return next;
        });
    }, []);
    const setLocations = useCallback(
        (next) => setAnalysisConfig((p) => ({ ...p, locations: next })),
        []
    );

    const setActiveTab = useCallback(
        (tab) => setUi((u) => ({ ...u, activeTab: tab })),
        []
    );
    const setDragActive = useCallback(
        (b) => setUi((u) => ({ ...u, dragActive: b })),
        []
    );
    const openLocationModal = useCallback(
        () => setUi((u) => ({ ...u, locationModalOpen: true })),
        []
    );
    const closeLocationModal = useCallback(
        () => setUi((u) => ({ ...u, locationModalOpen: false })),
        []
    );

    // Select All/Deselect All actions
    const selectAllCommodities = useCallback(() => {
        setAnalysisConfig((p) => ({
            ...p,
            commodities: [...availableCommodities],
        }));
    }, []);

    const deselectAllCommodities = useCallback(() => {
        setAnalysisConfig((p) => ({
            ...p,
            commodities: [],
        }));
    }, []);

    const selectAllLocations = useCallback(() => {
        const allProvinces = Object.keys(citiesByProvince);
        const allCities = Object.values(citiesByProvince).flat();
        setAnalysisConfig((p) => ({
            ...p,
            locations: {
                provinces: allProvinces,
                cities: allCities,
            },
        }));
    }, []);

    const deselectAllLocations = useCallback(() => {
        setAnalysisConfig((p) => ({
            ...p,
            locations: {
                provinces: [],
                cities: [],
            },
        }));
    }, []);

    // Validation modal actions
    const setValidationCommodities = useCallback((commodities) => {
        setValidationConfig((p) => ({ ...p, commodities }));
    }, []);

    const setValidationCities = useCallback((cities) => {
        setValidationConfig((p) => ({ ...p, cities }));
    }, []);

    const setValidationProvinces = useCallback((provinces) => {
        setValidationConfig((p) => ({ ...p, provinces }));
    }, []);

    const setValidationYearRange = useCallback((key, value) => {
        const numeric = Number(value);
        setValidationConfig((p) => {
            const next = {
                ...p,
                yearRange: { ...p.yearRange, [key]: numeric },
            };
            if (next.yearRange.start > next.yearRange.end) {
                if (key === "start") next.yearRange.end = numeric;
                else next.yearRange.start = numeric;
            }
            return next;
        });
    }, []);

    const selectAllValidationCommodities = useCallback(() => {
        if (validationResult?.available_data?.commodities) {
            setValidationConfig((p) => ({
                ...p,
                commodities: [...validationResult.available_data.commodities],
            }));
        }
    }, [validationResult]);

    const deselectAllValidationCommodities = useCallback(() => {
        setValidationConfig((p) => ({ ...p, commodities: [] }));
    }, []);

    const selectAllValidationLocations = useCallback(() => {
        if (validationResult?.available_data) {
            const { provinces } = validationResult.available_data;
            const allCities = provinces ? Object.values(provinces).flat() : [];
            const allProvinces = provinces ? Object.keys(provinces) : [];

            setValidationConfig((p) => ({
                ...p,
                cities: allCities,
                provinces: allProvinces,
            }));
        }
    }, [validationResult]);

    const deselectAllValidationLocations = useCallback(() => {
        setValidationConfig((p) => ({
            ...p,
            cities: [],
            provinces: [],
        }));
    }, []);

    const openValidationModal = useCallback((result) => {
        setValidationResult(result);
        // Initialize validation config with all items pre-selected
        const { provinces } = result.available_data;
        const allCities = provinces ? Object.values(provinces).flat() : [];
        const allProvinces = provinces ? Object.keys(provinces) : [];

        setValidationConfig({
            commodities: result.available_data.commodities || [],
            cities: allCities,
            provinces: allProvinces,
            yearRange: {
                start: Math.min(...result.available_data.years),
                end: Math.max(...result.available_data.years),
            },
        });

        // Also update main analysis config to reflect the selected cities for display
        setAnalysisConfig((prev) => ({
            ...prev,
            locations: {
                provinces: allProvinces,
                cities: allCities,
            },
        }));

        setShowValidationModal(true);
    }, []);

    const closeValidationModal = useCallback(() => {
        setShowValidationModal(false);
        setValidationResult(null);
        setValidationConfig(null);
    }, []);

    const openErrorModal = useCallback((result) => {
        setValidationResult(result);
        setShowErrorModal(true);
    }, []);

    const closeErrorModal = useCallback(() => {
        setShowErrorModal(false);
        setValidationResult(null);
    }, []);

    const handleValidationResult = useCallback(
        (result) => {
            setValidationResult(result);
            if (result && result.valid) {
                openValidationModal(result);
            } else if (result && !result.valid) {
                openErrorModal(result);
            }
        },
        [openValidationModal, openErrorModal]
    );

    const submitAnalysis = useCallback(
        ({ onFileUpload }) => {
            const isUploadMode = analysisConfig.dataSource === "upload";
            const payload = {
                source: analysisConfig.dataSource,
                config: {
                    algorithms: analysisConfig.algorithms,
                    numClusters: analysisConfig.numClusters,
                    ...(analysisConfig.dataSource === "app" && {
                        commodities: analysisConfig.commodities,
                        yearRange: analysisConfig.yearRange,
                        locations: analysisConfig.locations,
                    }),
                },
                ...(isUploadMode && { file: selectedFile }),
            };
            onFileUpload(payload);
        },
        [analysisConfig, selectedFile]
    );

    const submitValidatedAnalysis = useCallback(
        ({ validationId, onFileUpload }) => {
            if (!validationConfig) return;

            const payload = {
                source: "validated_upload",
                validationId,
                config: {
                    algorithms: analysisConfig.algorithms,
                    numClusters: analysisConfig.numClusters,
                    commodities: validationConfig.commodities,
                    yearRange: validationConfig.yearRange,
                    locations: {
                        provinces: validationConfig.provinces,
                        cities: validationConfig.cities,
                    },
                },
            };
            onFileUpload(payload);
        },
        [analysisConfig, validationConfig]
    );

    const value = useMemo(
        () => ({
            mode,
            setMode,
            analysisConfig,
            selectedFile,
            analysisId,
            validationResult,
            validationConfig,
            showValidationModal,
            showErrorModal,
            ui,
            setSelectedFile,
            setAnalysisId,
            actions: {
                setDataSource,
                toggleAlgorithm,
                toggleCommodity,
                setNumClusters,
                setYearRange,
                setLocations,
                setActiveTab,
                setDragActive,
                openLocationModal,
                closeLocationModal,
                selectAllCommodities,
                deselectAllCommodities,
                selectAllLocations,
                deselectAllLocations,
                submitAnalysis,
                setValidationCommodities,
                setValidationCities,
                setValidationProvinces,
                setValidationYearRange,
                selectAllValidationCommodities,
                deselectAllValidationCommodities,
                selectAllValidationLocations,
                deselectAllValidationLocations,
                openValidationModal,
                closeValidationModal,
                openErrorModal,
                closeErrorModal,
                submitValidatedAnalysis,
                handleValidationResult,
            },
        }),
        [
            mode,
            analysisConfig,
            selectedFile,
            analysisId,
            validationResult,
            validationConfig,
            showValidationModal,
            showErrorModal,
            ui,
            setDataSource,
            toggleAlgorithm,
            toggleCommodity,
            setNumClusters,
            setYearRange,
            setLocations,
            setActiveTab,
            setDragActive,
            openLocationModal,
            closeLocationModal,
            selectAllCommodities,
            deselectAllCommodities,
            selectAllLocations,
            deselectAllLocations,
            submitAnalysis,
            setValidationCommodities,
            setValidationCities,
            setValidationProvinces,
            setValidationYearRange,
            selectAllValidationCommodities,
            deselectAllValidationCommodities,
            selectAllValidationLocations,
            deselectAllValidationLocations,
            openValidationModal,
            closeValidationModal,
            openErrorModal,
            closeErrorModal,
            submitValidatedAnalysis,
            handleValidationResult,
        ]
    );

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const ctx = useContext(AnalysisContext);
    if (!ctx)
        throw new Error("useAnalysis must be used within AnalysisProvider");
    return ctx;
};

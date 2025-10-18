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
    const [analysisConfig, setAnalysisConfig] = useState({
        algorithms: ["kmeans"],
        commodities: ["Beras", "Daging Ayam", "Telur Ayam"],
        numClusters: 3,
        yearRange: { start: 2020, end: 2024 },
        locations: { provinces: [], cities: [] },
        dataSource: "app",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisId, setAnalysisId] = useState(null);
    const [ui, setUi] = useState({
        activeTab: "algorithms",
        dragActive: false,
        locationModalOpen: false,
    });

    const setDataSource = useCallback(
        (src) => setAnalysisConfig((p) => ({ ...p, dataSource: src })),
        []
    );
    const toggleAlgorithm = useCallback(
        (id) => setAnalysisConfig((p) => ({ ...p, algorithms: [id] })),
        []
    );
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

    const value = useMemo(
        () => ({
            mode,
            setMode,
            analysisConfig,
            selectedFile,
            analysisId,
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
            },
        }),
        [
            mode,
            analysisConfig,
            selectedFile,
            analysisId,
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

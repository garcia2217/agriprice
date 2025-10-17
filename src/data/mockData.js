// Helper functions for statistical calculations
const calculateMean = (data) =>
    data.reduce((sum, val) => sum + val, 0) / data.length;

const calculateStandardDeviation = (data) => {
    const mean = calculateMean(data);
    const variance =
        data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        data.length;
    return Math.sqrt(variance);
};

const calculateCoefficientOfVariation = (data) => {
    const mean = calculateMean(data);
    const stdDev = calculateStandardDeviation(data);
    return (stdDev / mean) * 100;
};

const calculateSlope = (data) => {
    const n = data.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const xMean = calculateMean(xValues);
    const yMean = calculateMean(data);

    const numerator = xValues.reduce(
        (sum, x, i) => sum + (x - xMean) * (data[i] - yMean),
        0
    );
    const denominator = xValues.reduce(
        (sum, x) => sum + Math.pow(x - xMean, 2),
        0
    );

    return denominator === 0 ? 0 : numerator / denominator;
};

// Generate monthly series (length = years.length * 12) from yearly values
const generateMonthlySeries = (yearlyValues, yearsCount) => {
    const monthsPerYear = 12;
    const result = [];
    for (let y = 0; y < yearsCount; y++) {
        const current = yearlyValues[y];
        const next =
            y < yearsCount - 1
                ? yearlyValues[y + 1]
                : yearlyValues[y] +
                  (yearlyValues[y] - yearlyValues[y - 1] || 0);
        const delta = (next - current) / monthsPerYear;
        for (let m = 0; m < monthsPerYear; m++) {
            result.push(Math.round(current + delta * m));
        }
    }
    return result;
};

export const researchResults = {
    cities: [
        { name: "Jakarta Pusat", lat: -6.175, lon: 106.828, clusterId: 0 },
        { name: "Kota Bandung", lat: -6.917, lon: 107.619, clusterId: 0 },
        { name: "Kota Surabaya", lat: -7.257, lon: 112.752, clusterId: 0 },
        { name: "Kota Medan", lat: 3.595, lon: 98.672, clusterId: 1 },
        { name: "Kota Palembang", lat: -2.976, lon: 104.775, clusterId: 1 },
        { name: "Kota Pontianak", lat: -0.022, lon: 109.33, clusterId: 2 },
        { name: "Kota Banjarmasin", lat: -3.319, lon: 114.594, clusterId: 2 },
        { name: "Kota Balikpapan", lat: -1.269, lon: 116.831, clusterId: 2 },
    ],
    clusters: [
        {
            id: 0,
            name: "Klaster 0: Pusat Konsumsi Harga Tinggi",
            color: "text-red-500",
            bgColor: "bg-red-500",
            hexColor: "#EF4444",
        },
        {
            id: 1,
            name: "Klaster 1: Lumbung Pangan Stabil",
            color: "text-green-500",
            bgColor: "bg-green-500",
            hexColor: "#22C55E",
        },
        {
            id: 2,
            name: "Klaster 2: Wilayah Pesisir Fluktuatif",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500",
            hexColor: "#EAB308",
        },
    ],
    years: ["2020", "2021", "2022", "2023", "2024"],
    trends: {},
    radarFeatures: {
        0: {
            Beras: 0.8,
            "Daging Ayam": 0.9,
            "Telur Ayam": 0.7,
        },
        1: {
            Beras: 0.3,
            "Daging Ayam": 0.4,
            "Telur Ayam": 0.2,
        },
        2: {
            Beras: 0.6,
            "Daging Ayam": 0.5,
            "Telur Ayam": 0.8,
        },
    },

    // Legacy methods - kept for backward compatibility but not used by radar chart
    getClusterFeatures() {
        const commodities = Object.keys(this.trends);
        const clusterFeatures = {};

        // Initialize cluster features
        this.clusters.forEach((cluster) => {
            clusterFeatures[cluster.id] = {
                priceMean: 0,
                volatility: 0,
                trend: 0,
                commodityBreakdown: {},
            };
        });

        // Calculate features for each commodity and cluster
        commodities.forEach((commodity) => {
            this.trends[commodity].forEach((clusterData) => {
                const clusterId = clusterData.clusterId;
                const data = clusterData.data;

                const mean = calculateMean(data);
                const cv = calculateCoefficientOfVariation(data);
                const slope = calculateSlope(data);

                clusterFeatures[clusterId].commodityBreakdown[commodity] = {
                    mean: mean,
                    volatility: cv,
                    trend: slope,
                };
            });
        });

        // Aggregate features across commodities for each cluster
        this.clusters.forEach((cluster) => {
            const clusterId = cluster.id;
            const commodityData = Object.values(
                clusterFeatures[clusterId].commodityBreakdown
            );

            clusterFeatures[clusterId].priceMean = calculateMean(
                commodityData.map((d) => d.mean)
            );
            clusterFeatures[clusterId].volatility = calculateMean(
                commodityData.map((d) => d.volatility)
            );
            clusterFeatures[clusterId].trend = calculateMean(
                commodityData.map((d) => d.trend)
            );
        });

        return clusterFeatures;
    },

    // Legacy method - kept for backward compatibility but not used by radar chart
    getNormalizedClusterFeatures() {
        const features = this.getClusterFeatures();
        const clusterIds = Object.keys(features);

        // Find min/max values for normalization
        const allPriceMeans = clusterIds.map((id) => features[id].priceMean);
        const allVolatilities = clusterIds.map((id) => features[id].volatility);
        const allTrends = clusterIds.map((id) => features[id].trend);

        const minPriceMean = Math.min(...allPriceMeans);
        const maxPriceMean = Math.max(...allPriceMeans);
        const minVolatility = Math.min(...allVolatilities);
        const maxVolatility = Math.max(...allVolatilities);
        const minTrend = Math.min(...allTrends);
        const maxTrend = Math.max(...allTrends);

        // Normalize function (0-1 scale)
        const normalize = (value, min, max) => {
            if (max === min) return 0.5; // If all values are the same
            return (value - min) / (max - min);
        };

        // Create normalized features
        const normalizedFeatures = {};
        clusterIds.forEach((clusterId) => {
            const feature = features[clusterId];
            normalizedFeatures[clusterId] = {
                priceMean: normalize(
                    feature.priceMean,
                    minPriceMean,
                    maxPriceMean
                ),
                volatility: normalize(
                    feature.volatility,
                    minVolatility,
                    maxVolatility
                ),
                trend: normalize(feature.trend, minTrend, maxTrend),
                rawValues: feature, // Keep raw values for tooltips
            };
        });

        return normalizedFeatures;
    },
};

// Populate monthly trends for researchResults
(() => {
    const yearsCount = researchResults.years.length;
    const yearly = {
        Beras: [
            { clusterId: 0, data: [14500, 14600, 14700, 14800, 14900] },
            { clusterId: 1, data: [12500, 12550, 12600, 12650, 12700] },
            { clusterId: 2, data: [13500, 13700, 13600, 13800, 13900] },
        ],
        "Daging Ayam": [
            { clusterId: 0, data: [38000, 38500, 39000, 38800, 40000] },
            { clusterId: 1, data: [34000, 34200, 34500, 34300, 35000] },
            { clusterId: 2, data: [36000, 37000, 36500, 37500, 38000] },
        ],
        "Telur Ayam": [
            { clusterId: 0, data: [28000, 28200, 28500, 29000, 29500] },
            { clusterId: 1, data: [25000, 25100, 25300, 25500, 25800] },
            { clusterId: 2, data: [27000, 27500, 27300, 28000, 28200] },
        ],
    };
    researchResults.trends = Object.fromEntries(
        Object.entries(yearly).map(([commodity, arr]) => [
            commodity,
            arr.map(({ clusterId, data }) => ({
                clusterId,
                data: generateMonthlySeries(data, yearsCount),
            })),
        ])
    );
})();

export const userResults = {
    cities: [
        { name: "Kota A", lat: -1.5, lon: 102.5, clusterId: 0 },
        { name: "Kota B", lat: -2.5, lon: 106.5, clusterId: 0 },
        { name: "Kota C", lat: -4.5, lon: 110.5, clusterId: 1 },
        { name: "Kota D", lat: -6.5, lon: 114.5, clusterId: 1 },
        { name: "Kota E", lat: 1.5, lon: 117.5, clusterId: 2 },
    ],
    clusters: [
        {
            id: 0,
            name: "Klaster Pengguna 0: Harga Rendah",
            color: "text-blue-500",
            bgColor: "bg-blue-500",
            hexColor: "#3B82F6",
        },
        {
            id: 1,
            name: "Klaster Pengguna 1: Harga Sedang",
            color: "text-purple-500",
            bgColor: "bg-purple-500",
            hexColor: "#8B5CF6",
        },
        {
            id: 2,
            name: "Klaster Pengguna 2: Harga Tinggi",
            color: "text-pink-500",
            bgColor: "bg-pink-500",
            hexColor: "#EC4899",
        },
    ],
    years: ["Thn 1", "Thn 2", "Thn 3", "Thn 4", "Thn 5"],
    trends: {},
    radarFeatures: {
        0: {
            Beras: 0.2,
            "Daging Ayam": 0.3,
            "Telur Ayam": 0.1,
        },
        1: {
            Beras: 0.5,
            "Daging Ayam": 0.6,
            "Telur Ayam": 0.4,
        },
        2: {
            Beras: 0.9,
            "Daging Ayam": 0.8,
            "Telur Ayam": 0.95,
        },
    },

    // Legacy methods - kept for backward compatibility but not used by radar chart
    getClusterFeatures() {
        const commodities = Object.keys(this.trends);
        const clusterFeatures = {};

        // Initialize cluster features
        this.clusters.forEach((cluster) => {
            clusterFeatures[cluster.id] = {
                priceMean: 0,
                volatility: 0,
                trend: 0,
                commodityBreakdown: {},
            };
        });

        // Calculate features for each commodity and cluster
        commodities.forEach((commodity) => {
            this.trends[commodity].forEach((clusterData) => {
                const clusterId = clusterData.clusterId;
                const data = clusterData.data;

                const mean = calculateMean(data);
                const cv = calculateCoefficientOfVariation(data);
                const slope = calculateSlope(data);

                clusterFeatures[clusterId].commodityBreakdown[commodity] = {
                    mean: mean,
                    volatility: cv,
                    trend: slope,
                };
            });
        });

        // Aggregate features across commodities for each cluster
        this.clusters.forEach((cluster) => {
            const clusterId = cluster.id;
            const commodityData = Object.values(
                clusterFeatures[clusterId].commodityBreakdown
            );

            clusterFeatures[clusterId].priceMean = calculateMean(
                commodityData.map((d) => d.mean)
            );
            clusterFeatures[clusterId].volatility = calculateMean(
                commodityData.map((d) => d.volatility)
            );
            clusterFeatures[clusterId].trend = calculateMean(
                commodityData.map((d) => d.trend)
            );
        });

        return clusterFeatures;
    },

    // Legacy method - kept for backward compatibility but not used by radar chart
    getNormalizedClusterFeatures() {
        const features = this.getClusterFeatures();
        const clusterIds = Object.keys(features);

        // Find min/max values for normalization
        const allPriceMeans = clusterIds.map((id) => features[id].priceMean);
        const allVolatilities = clusterIds.map((id) => features[id].volatility);
        const allTrends = clusterIds.map((id) => features[id].trend);

        const minPriceMean = Math.min(...allPriceMeans);
        const maxPriceMean = Math.max(...allPriceMeans);
        const minVolatility = Math.min(...allVolatilities);
        const maxVolatility = Math.max(...allVolatilities);
        const minTrend = Math.min(...allTrends);
        const maxTrend = Math.max(...allTrends);

        // Normalize function (0-1 scale)
        const normalize = (value, min, max) => {
            if (max === min) return 0.5; // If all values are the same
            return (value - min) / (max - min);
        };

        // Create normalized features
        const normalizedFeatures = {};
        clusterIds.forEach((clusterId) => {
            const feature = features[clusterId];
            normalizedFeatures[clusterId] = {
                priceMean: normalize(
                    feature.priceMean,
                    minPriceMean,
                    maxPriceMean
                ),
                volatility: normalize(
                    feature.volatility,
                    minVolatility,
                    maxVolatility
                ),
                trend: normalize(feature.trend, minTrend, maxTrend),
                rawValues: feature, // Keep raw values for tooltips
            };
        });

        return normalizedFeatures;
    },
};

// Populate monthly trends for userResults
(() => {
    const yearsCount = userResults.years.length;
    const yearly = {
        Beras: [
            { clusterId: 0, data: [11000, 11100, 11200, 11300, 11400] },
            { clusterId: 1, data: [13000, 13050, 13100, 13150, 13200] },
            { clusterId: 2, data: [15000, 15200, 15100, 15300, 15500] },
        ],
        "Daging Ayam": [
            { clusterId: 0, data: [32000, 32500, 33000, 32800, 34000] },
            { clusterId: 1, data: [36000, 36200, 36500, 36300, 37000] },
            { clusterId: 2, data: [40000, 41000, 40500, 41500, 42000] },
        ],
        "Telur Ayam": [
            { clusterId: 0, data: [23000, 23200, 23500, 24000, 24500] },
            { clusterId: 1, data: [26000, 26100, 26300, 26500, 26800] },
            { clusterId: 2, data: [29000, 29500, 29300, 30000, 30200] },
        ],
    };
    userResults.trends = Object.fromEntries(
        Object.entries(yearly).map(([commodity, arr]) => [
            commodity,
            arr.map(({ clusterId, data }) => ({
                clusterId,
                data: generateMonthlySeries(data, yearsCount),
            })),
        ])
    );
})();

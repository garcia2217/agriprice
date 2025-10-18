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

// Calculate Pearson correlation between two arrays
const calculatePearsonCorrelation = (x, y) => {
    const n = x.length;
    const meanX = calculateMean(x);
    const meanY = calculateMean(y);

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
        const diffX = x[i] - meanX;
        const diffY = y[i] - meanY;
        numerator += diffX * diffY;
        denomX += diffX * diffX;
        denomY += diffY * diffY;
    }

    const denominator = Math.sqrt(denomX * denomY);
    return denominator === 0 ? 0 : numerator / denominator;
};

// Calculate correlation matrix from trends data
const calculateCorrelationMatrix = (trends) => {
    const commodities = Object.keys(trends);
    const n = commodities.length;

    // Create time series for each commodity (average across clusters)
    const timeSeries = {};
    commodities.forEach((commodity) => {
        const allPrices = [];
        const clusterData = trends[commodity];
        const numPoints = clusterData[0].data.length;

        for (let i = 0; i < numPoints; i++) {
            const avgPrice =
                clusterData.reduce((sum, cluster) => sum + cluster.data[i], 0) /
                clusterData.length;
            allPrices.push(avgPrice);
        }
        timeSeries[commodity] = allPrices;
    });

    // Calculate Pearson correlation between each pair
    const matrix = [];
    const pValues = [];

    for (let i = 0; i < n; i++) {
        const row = [];
        const pRow = [];
        for (let j = 0; j < n; j++) {
            if (i === j) {
                row.push(1.0);
                pRow.push(1.0);
            } else {
                const corr = calculatePearsonCorrelation(
                    timeSeries[commodities[i]],
                    timeSeries[commodities[j]]
                );
                row.push(Math.round(corr * 100) / 100); // Round to 2 decimal places
                pRow.push(corr > 0.7 ? 0.001 : 0.05); // Mock p-value
            }
        }
        matrix.push(row);
        pValues.push(pRow);
    }

    return {
        commodities,
        matrix,
        pValues,
        method: "pearson",
        description:
            "Correlation matrix showing price relationships between commodities",
    };
};

// Generate PCA scatter plot data
const generatePCAData = (cities, clusters, commodities) => {
    // Generate random but plausible scatter coordinates grouped by cluster
    const transformedData = [];

    cities.forEach((city, index) => {
        const clusterId = city.clusterId;

        // Generate coordinates based on cluster with some randomness
        let x, y;
        switch (clusterId) {
            case 0:
                x = -2 + Math.random() * 2; // Left side
                y = -1 + Math.random() * 2; // Bottom half
                break;
            case 1:
                x = 0 + Math.random() * 2; // Right side
                y = -1 + Math.random() * 2; // Bottom half
                break;
            case 2:
                x = -1 + Math.random() * 2; // Center-left
                y = 1 + Math.random() * 2; // Top half
                break;
            default:
                x = -1 + Math.random() * 2;
                y = -1 + Math.random() * 2;
        }

        transformedData.push({
            x: parseFloat(x.toFixed(3)),
            y: parseFloat(y.toFixed(3)),
            clusterId: clusterId,
            cityName: city.name,
            originalIndex: index,
        });
    });

    // Generate feature contributions for biplot arrows
    const featureContributions = {
        pc1: {},
        pc2: {},
    };

    commodities.forEach((commodity) => {
        // Generate random but realistic contributions
        featureContributions.pc1[commodity] = parseFloat(
            (Math.random() * 0.8 - 0.4).toFixed(3)
        );
        featureContributions.pc2[commodity] = parseFloat(
            (Math.random() * 0.8 - 0.4).toFixed(3)
        );
    });

    return {
        components: {
            pc1: {
                explained_variance_ratio: 0.45,
                explained_variance: 2.1,
            },
            pc2: {
                explained_variance_ratio: 0.32,
                explained_variance: 1.5,
            },
        },
        transformed_data: transformedData,
        feature_contributions: featureContributions,
        method: "PCA",
        description: "Principal Component Analysis of commodity price patterns",
    };
};

// Generate clustering metrics and silhouette scores
const generateClusteringMetrics = (cities, clusters) => {
    // Generate random but realistic silhouette scores for each city
    const citySilhouettes = cities.map((city) => {
        const clusterId = city.clusterId;
        const cluster = clusters.find((c) => c.id === clusterId);

        // Generate silhouette score based on cluster with some randomness
        let baseScore;
        switch (clusterId) {
            case 0:
                baseScore = 0.7 + Math.random() * 0.25; // High-quality cluster
                break;
            case 1:
                baseScore = 0.4 + Math.random() * 0.3; // Medium-quality cluster
                break;
            case 2:
                baseScore = 0.2 + Math.random() * 0.4; // Lower-quality cluster
                break;
            default:
                baseScore = 0.3 + Math.random() * 0.4;
        }

        return {
            city: city.name,
            silhouette: parseFloat(baseScore.toFixed(3)),
            clusterId: clusterId,
            clusterName: cluster.name,
            coordinates: [city.lat, city.lon],
        };
    });

    // Sort by silhouette score (descending)
    citySilhouettes.sort((a, b) => b.silhouette - a.silhouette);

    // Calculate overall metrics
    const overallSilhouette =
        citySilhouettes.reduce((sum, city) => sum + city.silhouette, 0) /
        citySilhouettes.length;
    const daviesBouldin = 0.3 + Math.random() * 0.4; // Random but realistic DB index

    return {
        clusteringMetrics: {
            overall_silhouette: parseFloat(overallSilhouette.toFixed(3)),
            davies_bouldin: parseFloat(daviesBouldin.toFixed(3)),
            quality_assessment:
                overallSilhouette > 0.7
                    ? "Excellent"
                    : overallSilhouette > 0.5
                    ? "Good"
                    : overallSilhouette > 0.3
                    ? "Fair"
                    : "Poor",
        },
        citySilhouettes: citySilhouettes,
    };
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

    // Box Plot Data for visualization
    boxPlotData: {},

    // Correlation Matrix Data for heatmap
    correlationMatrix: {},

    // PCA Data for scatter plot
    pcaData: {},

    // Clustering Metrics for silhouette analysis
    clusteringMetrics: {},
    citySilhouettes: [],
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

// Generate box plot data for researchResults
(() => {
    const commodities = Object.keys(researchResults.trends);
    const clusters = researchResults.clusters.map((c) => c.id.toString());
    const years = researchResults.years;

    // Generate monthly price data with variation for box plots
    const generateMonthlyBoxData = (yearlyData, yearsCount) => {
        const result = {};
        for (let y = 0; y < yearsCount; y++) {
            const year = years[y];
            result[year] = {};

            yearlyData.forEach(({ clusterId, data }) => {
                const yearlyPrice = data[y];
                const monthlyPrices = [];

                // Generate 12 monthly prices with realistic variation
                for (let m = 0; m < 12; m++) {
                    const variation =
                        (Math.random() - 0.5) * yearlyPrice * 0.05; // 5% variation
                    const monthlyPrice = Math.round(yearlyPrice + variation);
                    monthlyPrices.push(monthlyPrice);
                }

                result[year][clusterId.toString()] = monthlyPrices;
            });
        }
        return result;
    };

    // Calculate box plot statistics
    const calculateBoxStats = (prices) => {
        const sorted = [...prices].sort((a, b) => a - b);
        const n = sorted.length;
        const q1 = sorted[Math.floor(n * 0.25)];
        const median = sorted[Math.floor(n * 0.5)];
        const q3 = sorted[Math.floor(n * 0.75)];
        const mean = prices.reduce((sum, val) => sum + val, 0) / n;
        const std = Math.sqrt(
            prices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
        );

        // Calculate outliers (1.5 * IQR rule)
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = prices.filter((p) => p < lowerBound || p > upperBound);

        return {
            min: Math.min(...prices),
            q1,
            median,
            q3,
            max: Math.max(...prices),
            mean: Math.round(mean),
            std: Math.round(std),
            outliers,
        };
    };

    // Generate data structure
    const data = {};
    const statistics = {};

    commodities.forEach((commodity) => {
        const commodityData = researchResults.trends[commodity];
        data[commodity] = generateMonthlyBoxData(commodityData, years.length);

        statistics[commodity] = {};
        years.forEach((year) => {
            statistics[commodity][year] = {};
            commodityData.forEach(({ clusterId }) => {
                const prices = data[commodity][year][clusterId.toString()];
                statistics[commodity][year][clusterId.toString()] =
                    calculateBoxStats(prices);
            });
        });
    });

    // Cluster colors mapping
    const clusterColors = {};
    researchResults.clusters.forEach((cluster) => {
        clusterColors[cluster.id.toString()] = cluster.hexColor;
    });

    researchResults.boxPlotData = {
        commodities,
        clusters,
        years,
        data,
        statistics,
        clusterColors,
    };

    // Generate correlation matrix for researchResults
    researchResults.correlationMatrix = calculateCorrelationMatrix(
        researchResults.trends
    );

    // Generate PCA data for researchResults
    researchResults.pcaData = generatePCAData(
        researchResults.cities,
        researchResults.clusters,
        Object.keys(researchResults.trends)
    );

    // Generate clustering metrics for researchResults
    const researchClusteringData = generateClusteringMetrics(
        researchResults.cities,
        researchResults.clusters
    );
    researchResults.clusteringMetrics =
        researchClusteringData.clusteringMetrics;
    researchResults.citySilhouettes = researchClusteringData.citySilhouettes;
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

    // Box Plot Data for visualization
    boxPlotData: {},

    // Correlation Matrix Data for heatmap
    correlationMatrix: {},

    // PCA Data for scatter plot
    pcaData: {},

    // Clustering Metrics for silhouette analysis
    clusteringMetrics: {},
    citySilhouettes: [],
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

// Generate box plot data for userResults
(() => {
    const commodities = Object.keys(userResults.trends);
    const clusters = userResults.clusters.map((c) => c.id.toString());
    const years = userResults.years;

    // Generate monthly price data with variation for box plots
    const generateMonthlyBoxData = (yearlyData, yearsCount) => {
        const result = {};
        for (let y = 0; y < yearsCount; y++) {
            const year = years[y];
            result[year] = {};

            yearlyData.forEach(({ clusterId, data }) => {
                const yearlyPrice = data[y];
                const monthlyPrices = [];

                // Generate 12 monthly prices with realistic variation
                for (let m = 0; m < 12; m++) {
                    const variation =
                        (Math.random() - 0.5) * yearlyPrice * 0.05; // 5% variation
                    const monthlyPrice = Math.round(yearlyPrice + variation);
                    monthlyPrices.push(monthlyPrice);
                }

                result[year][clusterId.toString()] = monthlyPrices;
            });
        }
        return result;
    };

    // Calculate box plot statistics
    const calculateBoxStats = (prices) => {
        const sorted = [...prices].sort((a, b) => a - b);
        const n = sorted.length;
        const q1 = sorted[Math.floor(n * 0.25)];
        const median = sorted[Math.floor(n * 0.5)];
        const q3 = sorted[Math.floor(n * 0.75)];
        const mean = prices.reduce((sum, val) => sum + val, 0) / n;
        const std = Math.sqrt(
            prices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
        );

        // Calculate outliers (1.5 * IQR rule)
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = prices.filter((p) => p < lowerBound || p > upperBound);

        return {
            min: Math.min(...prices),
            q1,
            median,
            q3,
            max: Math.max(...prices),
            mean: Math.round(mean),
            std: Math.round(std),
            outliers,
        };
    };

    // Generate data structure
    const data = {};
    const statistics = {};

    commodities.forEach((commodity) => {
        const commodityData = userResults.trends[commodity];
        data[commodity] = generateMonthlyBoxData(commodityData, years.length);

        statistics[commodity] = {};
        years.forEach((year) => {
            statistics[commodity][year] = {};
            commodityData.forEach(({ clusterId }) => {
                const prices = data[commodity][year][clusterId.toString()];
                statistics[commodity][year][clusterId.toString()] =
                    calculateBoxStats(prices);
            });
        });
    });

    // Cluster colors mapping
    const clusterColors = {};
    userResults.clusters.forEach((cluster) => {
        clusterColors[cluster.id.toString()] = cluster.hexColor;
    });

    userResults.boxPlotData = {
        commodities,
        clusters,
        years,
        data,
        statistics,
        clusterColors,
    };

    // Generate correlation matrix for userResults
    userResults.correlationMatrix = calculateCorrelationMatrix(
        userResults.trends
    );

    // Generate PCA data for userResults
    userResults.pcaData = generatePCAData(
        userResults.cities,
        userResults.clusters,
        Object.keys(userResults.trends)
    );

    // Generate clustering metrics for userResults
    const userClusteringData = generateClusteringMetrics(
        userResults.cities,
        userResults.clusters
    );
    userResults.clusteringMetrics = userClusteringData.clusteringMetrics;
    userResults.citySilhouettes = userClusteringData.citySilhouettes;
})();

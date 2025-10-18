// Analysis configuration constants and option lists

export const YEAR_MIN = 2020;
export const YEAR_MAX = 2024;
export const CLUSTER_MIN = 2;
export const CLUSTER_MAX = 10;

export const availableAlgorithms = [
    {
        id: "kmeans",
        name: "K-Means",
        icon: "🎯",
        description: "Clustering berdasarkan centroid",
    },
    {
        id: "fcm",
        name: "Fuzzy C-Means",
        icon: "🌊",
        description: "Clustering dengan membership fuzzy",
    },
    {
        id: "spectral",
        name: "Spectral Clustering",
        icon: "🌈",
        description: "Clustering berbasis eigenvector pada graph Laplacian",
    },
];

export const availableCommodities = [
    "Beras",
    "Daging Ayam",
    "Telur Ayam",
    "Daging Sapi",
    "Gula Pasir",
    "Minyak Goreng",
    "Cabai Merah",
    "Cabai Rawit",
    "Bawang Merah",
    "Bawang Putih",
];

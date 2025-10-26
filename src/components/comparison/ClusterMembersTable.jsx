import React, { useMemo } from "react";

const ClusterMembersTable = ({
    algorithmResults,
    selectedAlgorithm,
    onAlgorithmChange,
}) => {
    const algorithms = useMemo(
        () => Object.keys(algorithmResults || {}),
        [algorithmResults]
    );
    const data = algorithmResults?.[selectedAlgorithm] || {};
    const clusters = data?.clusters || [];
    const cities = data?.cities || [];

    const citiesByCluster = useMemo(() => {
        const map = new Map();
        clusters.forEach((c) => map.set(c.id, []));
        cities.forEach((city) => {
            const arr = map.get(city.clusterId) || [];
            arr.push(city);
            map.set(city.clusterId, arr);
        });
        return map;
    }, [clusters, cities]);

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-gray-700">
                            Pilih Algoritma:
                        </label>
                        <select
                            value={selectedAlgorithm}
                            onChange={(e) => onAlgorithmChange(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer shadow-sm"
                        >
                            {algorithms.map((alg) => (
                                <option key={alg} value={alg}>
                                    {alg.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold">{clusters.length}</span>{" "}
                        klaster total •{" "}
                        <span className="font-semibold">{cities.length}</span>{" "}
                        kota
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {[...citiesByCluster.entries()].map(
                    ([clusterId, members], idx) => {
                        const cluster = clusters.find(
                            (c) => c.id === clusterId
                        );
                        return (
                            <div
                                key={clusterId}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                style={{
                                    animationDelay: `${idx * 75}ms`,
                                    animation: "fadeIn 0.4s ease-out forwards",
                                    opacity: 0,
                                }}
                            >
                                <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white"
                                            style={{
                                                backgroundColor:
                                                    cluster?.hexColor ||
                                                    "#94a3b8",
                                            }}
                                        ></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">
                                                Klaster {clusterId}
                                            </span>
                                            {cluster?.name && (
                                                <>
                                                    <span className="text-gray-400">
                                                        •
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {cluster.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {members.length}{" "}
                                            {members.length === 1
                                                ? "anggota"
                                                : "anggota"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {members.map((city, cityIdx) => (
                                            <div
                                                key={city.name}
                                                className="group relative px-4 py-2.5 bg-slate-50 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                                                style={{
                                                    animationDelay: `${
                                                        idx * 75 + cityIdx * 30
                                                    }ms`,
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                cluster?.hexColor ||
                                                                "#94a3b8",
                                                        }}
                                                    ></div>
                                                    <span className="font-medium truncate">
                                                        {city.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            {clusters.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                        Tidak ada data klaster
                    </p>
                    <p className="text-xs text-gray-500">
                        Pilih algoritma lain atau muat data baru
                    </p>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default React.memo(ClusterMembersTable);

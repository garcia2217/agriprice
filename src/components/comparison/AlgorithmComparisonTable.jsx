import React, { useMemo, useState } from "react";

const formatNumber = (n) => (typeof n === "number" ? n.toFixed(3) : n ?? "-");

const AlgorithmComparisonTable = ({ algorithmResults }) => {
    const [sortBy, setSortBy] = useState({
        key: "silhouette_score",
        dir: "desc",
    });

    const rows = useMemo(() => {
        if (!algorithmResults) return [];
        return Object.entries(algorithmResults).map(([alg, result]) => ({
            algorithm: alg,
            silhouette_score: result?.silhouette_score ?? null,
            dbi_score: result?.dbi_score ?? null,
            computation_time: result?.computation_time ?? null,
        }));
    }, [algorithmResults]);

    const best = useMemo(() => {
        if (rows.length === 0) return {};
        const maxSil = Math.max(
            ...rows.map((r) => r.silhouette_score ?? -Infinity)
        );
        const minDbi = Math.min(...rows.map((r) => r.dbi_score ?? Infinity));
        const minTime = Math.min(
            ...rows.map((r) => r.computation_time ?? Infinity)
        );
        return { maxSil, minDbi, minTime };
    }, [rows]);

    const sortedRows = useMemo(() => {
        const arr = [...rows];
        arr.sort((a, b) => {
            const k = sortBy.key;
            const av =
                a[k] ??
                (k === "dbi_score" || k === "computation_time"
                    ? Infinity
                    : -Infinity);
            const bv =
                b[k] ??
                (k === "dbi_score" || k === "computation_time"
                    ? Infinity
                    : -Infinity);
            return sortBy.dir === "asc" ? av - bv : bv - av;
        });
        return arr;
    }, [rows, sortBy]);

    const toggleSort = (key) => {
        setSortBy((p) =>
            p.key === key
                ? { key, dir: p.dir === "asc" ? "desc" : "asc" }
                : { key, dir: "desc" }
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                    Algoritma
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() =>
                                        toggleSort("silhouette_score")
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Silhouette Score</span>
                                        <span className="text-gray-400 group-hover:text-gray-600">
                                            {sortBy.key === "silhouette_score"
                                                ? sortBy.dir === "asc"
                                                    ? "↑"
                                                    : "↓"
                                                : "↕"}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() => toggleSort("dbi_score")}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>DBI Score</span>
                                        <span className="text-gray-400 group-hover:text-gray-600">
                                            {sortBy.key === "dbi_score"
                                                ? sortBy.dir === "asc"
                                                    ? "↑"
                                                    : "↓"
                                                : "↕"}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                                    onClick={() =>
                                        toggleSort("computation_time")
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Waktu (s)</span>
                                        <span className="text-gray-400 group-hover:text-gray-600">
                                            {sortBy.key === "computation_time"
                                                ? sortBy.dir === "asc"
                                                    ? "↑"
                                                    : "↓"
                                                : "↕"}
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {sortedRows.map((r, idx) => (
                                <tr
                                    key={r.algorithm}
                                    className="hover:bg-slate-50 transition-colors"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 uppercase whitespace-nowrap">
                                        {r.algorithm}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                                r.silhouette_score ===
                                                best.maxSil
                                                    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {formatNumber(r.silhouette_score)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                                r.dbi_score === best.minDbi
                                                    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {formatNumber(r.dbi_score)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                                r.computation_time ===
                                                best.minTime
                                                    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {formatNumber(r.computation_time)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {sortedRows.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-sm">
                            No algorithm results available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(AlgorithmComparisonTable);

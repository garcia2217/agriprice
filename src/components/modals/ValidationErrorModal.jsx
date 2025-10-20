import React from "react";

const ValidationErrorModal = ({ validationResult, onClose, onReupload }) => {
    const { errors } = validationResult || {};

    const getErrorSuggestion = (error) => {
        const errorLower = error.toLowerCase();
        if (errorLower.includes("format") || errorLower.includes("file")) {
            return "Pastikan file dalam format ZIP yang berisi file CSV dengan struktur yang benar.";
        }
        if (errorLower.includes("column") || errorLower.includes("header")) {
            return "Periksa nama kolom dalam file CSV. Gunakan template yang disediakan.";
        }
        if (errorLower.includes("data") || errorLower.includes("empty")) {
            return "Pastikan file CSV berisi data yang valid dan tidak kosong.";
        }
        return "Periksa format file dan struktur data sesuai template.";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-xl">❌</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Validasi Data Gagal
                                </h3>
                                <p className="text-sm text-gray-600">
                                    File yang diunggah tidak memenuhi
                                    persyaratan
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>
                </div>

                {/* Error List */}
                <div className="p-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                            Masalah yang ditemukan:
                        </h4>
                        {errors && errors.length > 0 ? (
                            <div className="space-y-3">
                                {errors.map((error, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <span className="text-red-600 text-sm mt-0.5">
                                            ❌
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-red-800">
                                                {error}
                                            </p>
                                            <p className="text-xs text-red-600 mt-1">
                                                {getErrorSuggestion(error)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">
                                    Tidak ada detail error tersedia
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="/templates/template.zip"
                            download="Template.zip"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            📥 Download Template
                        </a>
                        <button
                            onClick={onReupload}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            📤 Upload Ulang
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ValidationErrorModal);

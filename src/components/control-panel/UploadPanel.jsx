import React, { useRef } from "react";
import { useAnalysis } from "../../context/AnalysisContext";

const UploadPanel = () => {
    const { analysisConfig, selectedFile, setSelectedFile, actions, ui } =
        useAnalysis();
    const fileInputRef = useRef(null);
    const isUpload = analysisConfig.dataSource === "upload";

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file || null);
    };
    const handleFileInputClick = () => fileInputRef.current?.click();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover")
            actions.setDragActive(true);
        else if (e.type === "dragleave") actions.setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        actions.setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">
                <p className="mb-2">
                    Unggah file ZIP berisi data harga pangan untuk dianalisis
                    dengan konfigurasi yang dipilih.
                </p>
                {analysisConfig.dataSource === "app" ? (
                    <div className="flex items-center space-x-2 text-xs text-blue-600">
                        <span>ℹ️</span>
                        <span>
                            Aktifkan "Upload Data" pada Sumber Data untuk
                            mengunggah file
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-xs text-blue-600">
                        <span>💡</span>
                        <span>
                            Format: CSV dengan kolom kota, komoditas, harga,
                            tanggal
                        </span>
                    </div>
                )}
            </div>

            <div
                className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ${
                    ui.dragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                style={{
                    opacity: isUpload ? 1 : 0.5,
                    pointerEvents: isUpload ? "auto" : "none",
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".zip"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="space-y-3">
                    <div className="text-3xl">
                        {ui.dragActive ? "📥" : "📁"}
                    </div>

                    {selectedFile ? (
                        <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-2 text-green-600">
                                <span>✅</span>
                                <span className="font-medium text-sm">
                                    {selectedFile.name}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-gray-600 font-medium text-sm">
                                {ui.dragActive
                                    ? "Lepas file di sini"
                                    : "Drag & drop file ZIP atau"}
                            </p>
                            <button
                                onClick={handleFileInputClick}
                                className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm"
                            >
                                pilih file
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start space-x-3">
                    <span className="text-yellow-600">📋</span>
                    <div className="flex-1">
                        <div className="font-medium text-yellow-800 text-sm mb-1">
                            Template Format Data
                        </div>
                        <a
                            href="/templates/template.zip"
                            download="Template.zip"
                            className="inline-flex items-center space-x-2 text-xs font-medium text-yellow-800 hover:text-yellow-900 underline"
                        >
                            <span>⬇️</span>
                            <span>Download Template.zip</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(UploadPanel);

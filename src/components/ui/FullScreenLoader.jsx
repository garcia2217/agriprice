import React from "react";

const FullScreenLoader = ({
    isLoading,
    message = "Sedang melakukan analisis clustering...",
}) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-sm mx-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                    {message}
                </p>
                <p className="text-sm text-gray-600">Mohon tunggu sebentar</p>
            </div>
        </div>
    );
};

export default React.memo(FullScreenLoader);

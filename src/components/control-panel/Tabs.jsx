import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";

const Tabs = () => {
    const { ui, actions } = useAnalysis();
    const tabs = [
        { id: "algorithms", label: "Algoritma", icon: "🤖" },
        { id: "config", label: "Config", icon: "⚙️" },
        { id: "upload", label: "Upload", icon: "📤" },
    ];
    return (
        <div className="flex bg-gray-100 rounded-lg p-1 min-w-0">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => actions.setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 px-2 rounded-md text-xs font-medium transition-all duration-200 min-w-0 ${
                        ui.activeTab === tab.id
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                    <span className="text-sm flex-shrink-0">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default React.memo(Tabs);

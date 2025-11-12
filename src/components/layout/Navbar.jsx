import React, { useState } from "react";

const Navbar = ({ currentPage, setCurrentPage }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { key: "Home", label: "Home", icon: "🏠" },
        { key: "Dashboard", label: "Dashboard", icon: "📊" },
        { key: "About", label: "About", icon: "👤" },
    ];

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white text-lg font-bold">
                                🌾
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                AgriPrice
                            </span>
                            <span className="text-xs text-gray-500 -mt-1">
                                Analytics Dashboard
                            </span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-2 bg-gray-100/80 rounded-xl p-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setCurrentPage(item.key)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                        currentPage === item.key
                                            ? "bg-white text-blue-600 shadow-md transform scale-105"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                                    }`}
                                >
                                    <span className="text-base">
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Manual Button */}
                    <div className="hidden md:block">
                        <a
                            href="/manual.pdf"
                            download
                            className="ml-4 inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
                        >
                            <span className="mr-2">📘</span>
                            Download Manual
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                        isMobileMenuOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16M4 18h16"
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200/50">
                        <div className="px-4 py-2 space-y-1 bg-white/95 backdrop-blur-md">
                            {navItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => {
                                        setCurrentPage(item.key);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        currentPage === item.key
                                            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}

                            <a
                                href="/manual.pdf"
                                download
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                            >
                                <span className="text-lg">📘</span>
                                <span>Download Manual</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default React.memo(Navbar);

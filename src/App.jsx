import React, { useState, useCallback, useEffect } from "react";
import { useLeafletLoader } from "./hooks/useLeafletLoader";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";

const App = () => {
    const [currentPage, setCurrentPage] = useState("Home");

    useLeafletLoader();

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    // Ensure we scroll to top on page change (e.g., Home -> Dashboard)
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [currentPage]);

    const renderPage = () => {
        switch (currentPage) {
            case "Home":
                return <HomePage setCurrentPage={handlePageChange} />;
            case "Dashboard":
                return <DashboardPage />;
            case "About":
                return <AboutPage />;
            default:
                return <HomePage setCurrentPage={handlePageChange} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <Navbar
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
            />
            <main className="flex-grow">{renderPage()}</main>
            <Footer setCurrentPage={handlePageChange} />
        </div>
    );
};

export default App;

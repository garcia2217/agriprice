import React, { useState, useCallback } from "react";
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
            <Footer />
        </div>
    );
};

export default App;

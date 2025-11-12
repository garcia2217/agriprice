import React from "react";

const HomePage = ({ setCurrentPage }) => (
    <div className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
                {/* Main Heading */}
                <div className="space-y-8">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                        <span className="mr-2">🎯</span>
                        Penelitian Skripsi • Machine Learning • Data Analytics
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                        <span className="block">
                            Pengelompokan dan Analisis
                        </span>
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Harga Pangan di Pasar Tradisional
                        </span>
                        <span className="block text-4xl md:text-5xl text-gray-600 font-medium mt-4">
                            Wilayah Indonesia Bagian Barat
                        </span>
                    </h1>

                    <p className="max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed">
                        Penelitian inovatif yang menerapkan algoritma{" "}
                        <strong>K-Means</strong>, <strong>Fuzzy C-Means</strong>
                        , dan <strong>Spectral Clustering</strong> untuk
                        memetakan pola kewilayahan harga pangan strategis,
                        memberikan informasi bagi perumusan kebijakan yang lebih
                        efektif dan berbasis data.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                        <button
                            onClick={() => setCurrentPage("Dashboard")}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="flex items-center space-x-2">
                                <span>🚀</span>
                                <span>Jelajahi Dashboard Interaktif</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        <button
                            onClick={() => setCurrentPage("About")}
                            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="flex items-center space-x-2">
                                <span>👤</span>
                                <span>Tentang Peneliti</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Metodologi Penelitian
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Pendekatan sistematis dalam analisis data harga pangan
                        menggunakan teknologi terkini
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: "📊",
                            title: "Pengumpulan Data",
                            description:
                                "Data harga harian dari 10 komoditas strategis di 69 kota/kabupaten dikumpulkan dari sistem PIHPS Nasional dengan validasi kualitas data yang ketat.",
                            color: "from-blue-500 to-blue-600",
                        },
                        {
                            icon: "🤖",
                            title: "Machine Learning",
                            description:
                                "Penerapan algoritma K-Means, Fuzzy C-Means, dan Spectral Clustering untuk mengidentifikasi pola tersembunyi dalam data dan interpretabilitas.",
                            color: "from-green-500 to-green-600",
                        },
                        {
                            icon: "📈",
                            title: "Visualisasi Interaktif",
                            description:
                                "Hasil analisis disajikan dalam bentuk peta interaktif dan grafik dinamis untuk eksplorasi dan pemahaman yang intuitif.",
                            color: "from-purple-500 to-purple-600",
                        },
                    ].map((feature, index) => (
                        <div key={index} className="group relative">
                            <div className="h-full p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Data & Cakupan Penelitian
                    </h2>
                    <p className="text-xl text-gray-300">
                        Skala dan ruang lingkup analisis yang komprehensif
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { number: "69", label: "Kota/Kabupaten", icon: "🏙️" },
                        {
                            number: "10",
                            label: "Komoditas Strategis",
                            icon: "🌾",
                        },
                        { number: "5", label: "Tahun Data", icon: "📅" },
                        { number: "2", label: "Klaster Optimal", icon: "🎯" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-300 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-12 transform hover:scale-105 transition-all duration-300">
                    <div className="text-6xl mb-6">🚀</div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Siap Mengeksplorasi Data?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Masuki dashboard interaktif dan temukan wawasan mendalam
                        tentang pola harga pangan di Indonesia Bagian Barat
                        melalui analisis clustering yang canggih.
                    </p>
                    <button
                        onClick={() => setCurrentPage("Dashboard")}
                        className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                    >
                        <span className="flex items-center space-x-3">
                            <span>📊</span>
                            <span>Mulai Analisis Sekarang</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                →
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    </div>
);

export default React.memo(HomePage);

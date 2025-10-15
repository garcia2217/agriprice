import React from "react";
import { GithubIcon, LinkedinIcon } from "../components/icons";

const AboutPage = () => (
    <div className="flex-grow bg-gradient-to-br from-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                        <span className="mr-2">👨‍🎓</span>
                        Mahasiswa
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Tentang{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Peneliti
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Dedikasi untuk kemajuan ilmu pengetahuan melalui
                        penelitian berbasis data dan teknologi
                    </p>
                </div>
            </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
            <div className="max-w-6xl mx-auto px-6">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Profile Image Section */}
                        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                            <div className="relative z-10 text-center">
                                <div className="relative mb-8">
                                    <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:scale-105 transition-transform duration-300">
                                        <img
                                            className="w-full h-full object-cover"
                                            src="https://i.pinimg.com/474x/07/c4/72/07c4720d19a9e9edad9d0e939eca304a.jpg"
                                            alt="Foto profil peneliti"
                                        />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">🎓</span>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center space-x-4">
                                    <a
                                        href="#"
                                        className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
                                    >
                                        <GithubIcon />
                                    </a>
                                    <a
                                        href="#"
                                        className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
                                    >
                                        <LinkedinIcon />
                                    </a>
                                    <a
                                        href="#"
                                        className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
                                    >
                                        <span className="w-6 h-6 block">
                                            📧
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-12">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                        Emmanuel Garcia Sumargo
                                    </h2>
                                    <div className="flex items-center space-x-2 text-blue-600 font-semibold mb-6">
                                        <span>🏛️</span>
                                        <span>
                                            Teknik Informatika, Universitas
                                            Tarumanagara
                                        </span>
                                    </div>
                                </div>

                                <div className="prose prose-lg text-gray-600">
                                    <p className="leading-relaxed">
                                        Saya adalah seorang mahasiswa tingkat
                                        akhir dengan passion mendalam pada
                                        bidang
                                        <strong className="text-blue-600">
                                            {" "}
                                            Data Science
                                        </strong>
                                        ,
                                        <strong className="text-green-600">
                                            {" "}
                                            Machine Learning
                                        </strong>
                                        , dan
                                        <strong className="text-purple-600">
                                            {" "}
                                            Web Development
                                        </strong>
                                        .
                                    </p>

                                    <p className="leading-relaxed">
                                        Penelitian ini merupakan puncak dari
                                        perjalanan akademis saya, menggabungkan
                                        kemampuan analisis data dengan
                                        pengembangan aplikasi web yang
                                        fungsional dan informatif. Melalui
                                        penerapan algoritma clustering, saya
                                        berusaha memberikan kontribusi nyata
                                        bagi pemahaman pola harga pangan di
                                        Indonesia.
                                    </p>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Keahlian & Teknologi
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            {
                                                skill: "Python",
                                                icon: "🐍",
                                                level: "Intermediate",
                                            },
                                            {
                                                skill: "Machine Learning",
                                                icon: "🤖",
                                                level: "Intermediate",
                                            },
                                            // {
                                            //     skill: "React.js",
                                            //     icon: "⚛️",
                                            //     level: "Advanced",
                                            // },
                                            // {
                                            //     skill: "Data Visualization",
                                            //     icon: "📊",
                                            //     level: "Intermediate",
                                            // },
                                            {
                                                skill: "SQL",
                                                icon: "🗃️",
                                                level: "Intermediate",
                                            },
                                            {
                                                skill: "JavaScript",
                                                icon: "🟨",
                                                level: "Intermediate",
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <span className="text-xl">
                                                    {item.icon}
                                                </span>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {item.skill}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.level}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Research Focus */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Fokus Penelitian
                    </h2>
                    <p className="text-xl text-gray-600">
                        Area penelitian dan minat akademis yang sedang
                        dikembangkan
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: "🔬",
                            title: "Data Science",
                            description:
                                "Analisis data kompleks menggunakan statistical methods dan machine learning untuk mengungkap insights tersembunyi dalam dataset besar.",
                            color: "from-blue-500 to-blue-600",
                        },
                        {
                            icon: "🧠",
                            title: "Machine Learning",
                            description:
                                "Implementasi algoritma clustering, classification, dan regression untuk memecahkan masalah real-world dengan pendekatan berbasis data.",
                            color: "from-green-500 to-green-600",
                        },
                        {
                            icon: "🌐",
                            title: "Web Development",
                            description:
                                "Pengembangan aplikasi web modern yang user-friendly dengan fokus pada data visualization dan interactive dashboards.",
                            color: "from-purple-500 to-purple-600",
                        },
                    ].map((focus, index) => (
                        <div key={index} className="group">
                            <div className="h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${focus.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {focus.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {focus.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {focus.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
                    <div className="text-5xl mb-6">🤝</div>
                    <h2 className="text-4xl font-bold mb-6">
                        Mari Berkolaborasi!
                    </h2>
                    <p className="text-xl mb-8 opacity-90 leading-relaxed">
                        Tertarik untuk berdiskusi tentang penelitian ini atau
                        mengeksplorasi peluang kolaborasi? Saya selalu terbuka
                        untuk berbagi pengetahuan dan belajar hal-hal baru.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#"
                            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="flex items-center space-x-2">
                                <span>📧</span>
                                <span>Kirim Email</span>
                            </span>
                        </a>
                        <a
                            href="#"
                            className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/30 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="flex items-center space-x-2">
                                <span>💼</span>
                                <span>LinkedIn Profile</span>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export default React.memo(AboutPage);

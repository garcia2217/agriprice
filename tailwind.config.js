/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Inter",
                    "system-ui",
                    "Avenir",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                ],
            },
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    900: "#1e3a8a",
                },
            },
            boxShadow: {
                soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                "soft-lg":
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out forwards",
                "slide-in": "slideIn 0.5s ease-out forwards",
                "bounce-custom": "bounce 2s infinite",
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideIn: {
                    from: { transform: "translateX(-100%)" },
                    to: { transform: "translateX(0)" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};

/** @type {import('tailwindcss').Config} */

// ==========================================
// 🔒 TAILWIND FROZEN CONFIGURATION
// Design Authority: Craftlayers CSS (`.cl-*`)
// Tailwind Role: Layout Engine Only
// ==========================================

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Layout-only extensions allowed here.
            // visual tokens (colors, fonts, radius, shadows) are removed.

            // 4. Animation (Retained for existing micro-interactions if any)
            animation: {
                blob: "blob 7s infinite",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
        },
    },
    plugins: [],
};

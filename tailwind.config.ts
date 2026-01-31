import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 1. 🎨 Color Palette (Glass Light Theme + Legacy Mappings)
            colors: {
                // New DS Tokens (Glass Light)
                brand: {
                    primary: {
                        base: "#4f46e5",
                        "on-base": "#ffffff",
                        interaction: "#4338ca",
                        background: "rgba(79, 70, 229, 0.1)",
                        surface: "rgba(79, 70, 229, 0.05)",
                    },
                    secondary: {
                        base: "#0891b2",
                        "on-base": "#ffffff",
                        interaction: "#0e7490",
                        background: "rgba(6, 182, 212, 0.1)",
                        surface: "rgba(6, 182, 212, 0.05)",
                    },
                },
                neutral: {
                    surface: {
                        "level-0": "rgba(255,255,255,0.9)",
                        "level-1": "rgba(255, 255, 255, 0.8)",
                        "level-2": "rgba(255, 255, 255, 0.6)",
                        "level-3": "rgba(255, 255, 255, 0.4)",
                        "level-4": "rgba(255, 255, 255, 0.2)",
                    },
                    text: {
                        "high-contrast": "#0f172a",
                        "medium-contrast": "#64748b",
                        "low-contrast": "#94a3b8",
                        disabled: "rgba(0, 0, 0, 0.3)",
                        inverse: "#ffffff",
                    },
                },
                semantic: {
                    success: {
                        text: "#059669",
                        icon: "#10b981",
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "#059669",
                    },
                    warning: {
                        text: "#d97706",
                        icon: "#f59e0b",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "#d97706",
                    },
                    error: {
                        text: "#dc2626",
                        icon: "#ef4444",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "#dc2626",
                    },
                    info: {
                        text: "#2563eb",
                        icon: "#3b82f6",
                        background: "rgba(59, 130, 246, 0.1)",
                        border: "#2563eb",
                    },
                },

                // --- Legacy Mappings (Backward Compatibility) ---
                // Mapping old semantic keys to new DS values
                primary: {
                    main: {
                        50: "rgba(79, 70, 229, 0.05)", // brand.primary.surface
                        100: "rgba(79, 70, 229, 0.1)", // brand.primary.background
                        200: "rgba(79, 70, 229, 0.2)",
                        300: "#6366f1",
                        400: "#4f46e5", // brand.primary.base
                        500: "#4338ca", // brand.primary.interaction
                        600: "#3730a3",
                        700: "#312e81",
                    },
                },
                surface: {
                    page: "rgba(255,255,255,0.9)", // neutral.surface.level-0
                    DEFAULT: "rgba(255, 255, 255, 0.8)", // neutral.surface.level-1
                    subtle: "rgba(255, 255, 255, 0.6)", // neutral.surface.level-2
                    overlay: "rgba(0, 0, 0, 0.1)", // approximate overlay
                    inverse: "#0f172a", // neutral.text.high-contrast or similar dark
                },
                content: {
                    primary: "#0f172a", // neutral.text.high-contrast
                    secondary: "#64748b", // neutral.text.medium-contrast
                    tertiary: "#94a3b8", // neutral.text.low-contrast
                    inverse: "#ffffff", // neutral.text.inverse
                    link: "#4f46e5", // brand.primary.base
                },
                border: {
                    DEFAULT: "rgba(0, 0, 0, 0.1)", // border.color.default
                    muted: "rgba(0, 0, 0, 0.05)", // border.color.subtle
                    focus: "#4f46e5", // border.color.interaction
                },

                // Retaining Pastel Palette for "Organic" Shapes/Badges as requested
                pastel: {
                    green: { 50: "#f1faf4", 100: "#e7f8f0", 500: "#5fcb9b" },
                    teal: { 100: "#e5faf8", 500: "#3dd1c2" },
                    blue: { 50: "#f3f8fe", 100: "#eaf6fd", 500: "#50a9ee" },
                    periwinkle: { 50: "#f5f7ff", 100: "#f4f6fd", 500: "#8d9bf3" },
                    purple: { 50: "#f7f3ff", 100: "#f5f1fa", 500: "#a682d7" },
                    pink: { 50: "#fff5f9", 100: "#fde9f2", 500: "#f06292" },
                    orange: { 50: "#fff7e6", 100: "#fff3e6", 500: "#ffaa6a" },
                },
                // Retaining partial primary/gray scales if needed for specific hardcoded lookups,
                // but usually the mappings above cover semantic usage.
                // Keeping minimal gray needed for some untyped usages if any.
                gray: {
                    0: "#ffffff",
                    50: "#f9fafb",
                    100: "#f3f4f6",
                    200: "#e5e7eb",
                    300: "#d1d5db",
                    400: "#9ca3af",
                    500: "#6b7280",
                    600: "#4b5563",
                    700: "#374151",
                    800: "#1f2937",
                    900: "#111827",
                },
            },

            // 2. 🔠 Typography
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            fontSize: {
                // New DS Sizes
                "050": "0.75rem",
                "075": "0.875rem",
                "100": "1rem",
                "200": "1.125rem",
                "300": "1.25rem",
                "400": "1.5rem",
                "500": "1.875rem",
                "600": "2.25rem",
                "700": "3rem",
                "800": "3.75rem",
                "900": "3.75rem",
                // Mapped Semantic Header Sizes
                h1: ["3.75rem", { lineHeight: "1", letterSpacing: "-0.025em" }], // ~800/900
                h2: ["3rem", { lineHeight: "1", letterSpacing: "-0.025em" }], // ~700
                h3: ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.025em" }], // ~600
                h4: ["1.875rem", { lineHeight: "1.25" }], // ~500
                headline: ["1.5rem", { lineHeight: "1.5" }], // ~400
                body: ["1rem", { lineHeight: "1.5" }], // ~100
                "body-sm": ["0.875rem", { lineHeight: "1.5" }], // ~075
                caption: ["0.75rem", { lineHeight: "1.5" }], // ~050
            },

            // 3. 📏 Spacing & Sizing
            // Extend default spacing with DS additions if needed, otherwise rely on defaults.
            // DS Spacing: 025=2px, 050=4px, 100=8px, 150=12px, 200=16px...
            // Tailwind defaults: 0.5=2px, 1=4px, 2=8px, 3=12px, 4=16px.
            // We can map specific DS keys if used directly.

            borderRadius: {
                sm: "4px",
                md: "8px",
                lg: "16px",
                xl: "24px",
                full: "9999px",
                none: "0px",
            },
            boxShadow: {
                none: "none",
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },

            // 4. Animation
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

export default config;

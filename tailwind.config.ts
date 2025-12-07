import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./index.html",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // --- 1. Base Variables (Shadcn-compatible) ---
                background: "var(--bg-app)", // Mapped to CSS var
                foreground: "var(--text-primary)",

                // --- 2. Semantics (Usage Context) ---
                surface: {
                    page: "var(--bg-app)",        // Gray0
                    DEFAULT: "var(--bg-surface)", // Gray10
                    subtle: "var(--bg-subtle)",   // Gray20
                    overlay: "var(--bg-overlay)", // Gray800
                    inverse: "var(--bg-inverse)", // Gray1000
                },
                content: {
                    primary: "var(--text-primary)",   // Gray700
                    secondary: "var(--text-secondary)", // Gray400
                    tertiary: "var(--text-tertiary)",  // Gray300
                    inverse: "var(--text-inverse)",   // Gray10
                    link: "var(--text-link)",      // Primary700
                },
                border: {
                    DEFAULT: "var(--border-default)",   // Gray200
                    muted: "var(--border-muted)",     // Gray100
                    focus: "var(--border-focus)",     // Gray600
                },

                // --- 3. Primitives (The Raw Paint) ---
                primary: {
                    DEFAULT: "#FFA500", // Orange-500
                    foreground: "#FFFFFF",
                    // Manual Palette
                    50: "#fff3e0",
                    100: "#ffe0b2",
                    200: "#ffcc80",
                    300: "#ffb74d",
                    400: "#ffa726",
                    500: "#ffa500",
                    600: "#e69500",
                    700: "#cc8400",
                },
                gray: {
                    0: "#ffffff",
                    10: "#fcfcfd",
                    20: "#f8fafb",
                    100: "#f0f4f5",
                    200: "#d5dbde",
                    300: "#a1a6a8",
                    400: "#73787a",
                    500: "#505355",
                    600: "#383b3c",
                    700: "#2b2d2e",
                    800: "#18191a",
                    1000: "#000000",
                },
                pastel: {
                    green: { 50: "#f1faf4", 100: "#e7f8f0", 500: "#5fcb9b" },
                    teal: { 100: "#e5faf8", 500: "#3dd1c2" },
                    blue: { 50: "#f3f8fe", 100: "#eaf6fd", 500: "#50a9ee" },
                    periwinkle: { 50: "#f5f7ff", 100: "#f4f6fd", 500: "#8d9bf3" },
                    purple: { 50: "#f7f3ff", 100: "#f5f1fa", 500: "#a682d7" },
                    pink: { 50: "#fff5f9", 100: "#fde9f2", 500: "#f06292" },
                    orange: { 50: "#fff7e6", 100: "#fff3e6", 500: "#ffaa6a" },
                },
                // Functional Status
                info: { 100: "#e5f2ff", 500: "#007aff", 700: "#0062cc" },
                success: { 100: "#e5fff1", 500: "#0fa251", 700: "#0d8041" },
                warning: { 100: "#f9ead1", 500: "#f5a623", 700: "#c4851c" },
                error: { 100: "#ffdbe2", 500: "#b00020", 700: "#8d001a" },
            },
            borderRadius: {
                lg: "16px",    // Standard Card Radius
                md: "8px",
                sm: "4px",
                xl: "24px",
                full: "9999px",
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
                mono: ["Roboto Mono", "monospace"],
            },
            fontSize: {
                h1: ["48px", { lineHeight: "110%", letterSpacing: "-1%" }],
                h2: ["32px", { lineHeight: "110%", letterSpacing: "-1%" }],
                h3: ["28px", { lineHeight: "110%", letterSpacing: "-0.5%" }],
                h4: ["24px", { lineHeight: "110%" }],
                headline: ["20px", { lineHeight: "140%" }],
                body: ["16px", { lineHeight: "160%" }],
                "body-sm": ["14px", { lineHeight: "160%" }],
                caption: ["12px", { lineHeight: "160%" }],
            },
            spacing: {
                "2xs": "2px",
                xs: "4px",
                sm: "8px",
                md: "16px",
                lg: "24px",
                xl: "32px",
                "2xl": "48px",
                "3xl": "64px", // For Section Gaps
                container: "1440px",
            },
        },
    },
    plugins: [],
};

export default config;

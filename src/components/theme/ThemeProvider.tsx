import React, { createContext, useContext, useEffect } from "react"

type Theme = "light"

interface ThemeProviderProps {
    children: React.ReactNode
}

interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "light",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children
}: ThemeProviderProps) {
    // Force light theme and remove any existing persistence
    useEffect(() => {
        const root = window.document.documentElement
        root.setAttribute("data-theme", "light")
        root.classList.remove("dark")
        localStorage.removeItem("vite-ui-theme")
    }, [])

    const value = {
        theme: "light" as Theme,
        setTheme: () => null, // No-op
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")
    return context
}

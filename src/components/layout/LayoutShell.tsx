import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { ChatWidget } from '../chat/ChatWidget';

export function LayoutShell() {
    const location = useLocation();

    // Audit Issue A: Unique Page Titles
    useEffect(() => {
        const path = location.pathname;
        // Format: "[Page Name] — Hari Nandipati | CraftLayers"
        let title = 'Hari Nandipati — Senior Product Designer | CraftLayers';

        if (path === '/') title = 'Hari Nandipati — Senior Product Designer | CraftLayers';
        else if (path.includes('/work')) title = 'Work — Hari Nandipati | CraftLayers';
        else if (path.includes('/blog')) title = 'Insights — Hari Nandipati | CraftLayers';
        else if (path === '/about') title = 'About — Hari Nandipati | CraftLayers';

        document.title = title;
    }, [location]);

    return (
        <div className="min-h-screen flex flex-col cl-bg-neutral-surface-level-0 font-sans cl-text-neutral-text-high-contrast antialiased relative">
            {/* Skip to Main Content Link for Accessibility */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only absolute top-4 left-4 z-[100] px-6 py-3 cl-bg-brand-primary-base cl-text-white cl-radius-lg shadow-xl font-bold cl-focus-ring"
            >
                Skip to main content
            </a>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                {/* Main Content Area - Stitch Canvas Constraint */}
                <main id="main-content" tabIndex={-1} className="flex-grow pt-20 px-6 focus:outline-none w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>

                <Footer />
                {/* Audit Issue B: Sonner Accessibility */}
                <Toaster 
                    position="bottom-right" 
                    richColors 
                    closeButton
                    visibleToasts={3}
                    toastOptions={{
                        className: 'cl-bg-neutral-surface-level-1 cl-border-neutral-border-default cl-radius-md cl-text-primary',
                    }} 
                />
            </div>
            <ChatWidget />
        </div>
    );
}

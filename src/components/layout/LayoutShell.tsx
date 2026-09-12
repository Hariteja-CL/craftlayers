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
        else if (path === '/profile') title = 'Profile — Hari Nandipati | CraftLayers';
        else if (path === '/contact') title = 'Contact — Hari Nandipati | CraftLayers';
        // Specific routes must be checked before the /work catch-all below.
        else if (path === '/work/design') title = 'From Figma Library to Executable Product Rules — Hariteja Nandipati';
        else if (path.includes('/work')) title = 'Work — Hari Nandipati | CraftLayers';
        else if (path.startsWith('/for/')) title = 'Senior Product Designer — Hari Nandipati | CraftLayers';
        else if (path.includes('/blog')) title = 'Writing — Hari Nandipati | CraftLayers';
        // Library: the handbook reader sets a chapter-specific title itself,
        // so only the index and landing page are named here.
        else if (path === '/library') title = 'Library — Hari Nandipati | CraftLayers';
        // Deliberately generic. The handbook's real title is private content
        // and naming it here would compile it straight back into the public
        // bundle — the exact leak this route was moved server-side to close.
        else if (path.startsWith('/library/')) title = 'Library — Hari Nandipati | CraftLayers';

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

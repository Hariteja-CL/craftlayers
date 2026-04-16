import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { ChatWidget } from '../chat/ChatWidget';

export function LayoutShell() {
    return (
        <div className="min-h-screen flex flex-col cl-bg-neutral-surface-level-0 font-sans cl-text-neutral-text-high-contrast antialiased relative">
            {/* Skip to Main Content Link for Accessibility */}
            <a 
                href="#main-content" 
                className="absolute left-[-9999px] z-50 cl-p-150 cl-bg-brand-primary-base cl-text-brand-primary-on-base cl-radius-md focus:left-4 focus:top-4 cl-focus-ring"
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
                <Toaster 
                    position="bottom-right" 
                    richColors 
                    closeButton 
                    toastOptions={{
                        className: 'cl-bg-neutral-surface-level-1 cl-border-neutral-border-default cl-radius-md cl-text-primary',
                    }} 
                />
            </div>
            <ChatWidget />
        </div>
    );
}


import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function LayoutShell() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-page font-sans text-content-primary antialiased">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow pt-20">
                {/* pt-20 to offset fixed navbar height */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

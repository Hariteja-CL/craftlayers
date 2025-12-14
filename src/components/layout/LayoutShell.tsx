
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function LayoutShell() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDFD] font-sans text-content-primary antialiased relative selection:bg-orange-100 selection:text-orange-900">
            {/* Atmospheric Depth Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-50/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                {/* Main Content Area */}
                <main className="flex-grow pt-20">
                    {/* pt-20 to offset fixed navbar height */}
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}

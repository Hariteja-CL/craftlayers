import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../ui/Button'; // Reuse utility

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Insights', path: '/blog' },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] md:w-auto">
            <div className={cn(
                "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] px-2 py-2 flex flex-col md:flex-row md:items-center justify-between md:gap-2 transition-all duration-300",
                isMenuOpen ? "rounded-[2rem]" : "rounded-full"
            )}>

                <div className="flex items-center justify-between w-full md:w-auto">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/50 rounded-full transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="font-bold text-gray-900 tracking-tight text-sm">CraftLayers</span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Desktop Contact Action (Hidden on Mobile when menu closed, effectively moved inside menu for mobile) */}
                    <div className="hidden md:block">
                        {/* Placeholder to keep layout consistent if needed, but flex justify-between handles it. 
                             Actually, the standard deskop layout has Contact on the right. 
                             We can leave the 'Contact' link outside this div for Desktop, see below.
                         */}
                    </div>
                </div>


                {/* Navigation Links Area */}
                <div className={cn(
                    "flex-col md:flex-row items-center gap-4 md:gap-2 w-full md:w-auto overflow-hidden transition-all duration-300 ease-in-out",
                    isMenuOpen ? "flex max-h-screen opacity-100 mt-4 md:mt-0" : "hidden md:flex max-h-0 md:max-h-full opacity-0 md:opacity-100"
                )}>
                    {/* Desktop Nav Wrapper (Gray Pill) - Modified for Mobile to be just a list */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center bg-transparent md:bg-gray-100/50 rounded-2xl md:rounded-full px-0 md:px-1 p-0 md:p-1 w-full md:w-auto gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        "px-5 py-3 md:py-2 rounded-xl md:rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-center",
                                        isActive
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                    )
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Mobile Contact Action */}
                    <div className="md:hidden w-full pt-2 border-t border-gray-100 pb-2">
                        <Link
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/5 flex justify-center w-full focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Desktop Contact Action (Visible only on Desktop) */}
                    <Link
                        to="/contact"
                        className="hidden md:block bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    >
                        Contact
                    </Link>
                </div>

            </div>
        </nav>
    );
}

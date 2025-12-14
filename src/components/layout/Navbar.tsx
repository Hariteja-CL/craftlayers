import { NavLink, Link } from 'react-router-dom';
import { cn } from '../ui/Button'; // Reuse utility

const navItems = [
    { name: 'Home', path: '/' }, // Renamed from Work as requested
    { name: 'About', path: '/about' },
    { name: 'Insights', path: '/blog' },
    // { name: 'Playground', path: '/playground' }, // Future
];

export function Navbar() {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] md:w-auto">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full px-2 py-2 flex items-center justify-between md:gap-2">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 px-4 py-2 hover:bg-white/50 rounded-full transition-colors">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="font-bold text-gray-900 tracking-tight text-sm">CraftLayers</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center bg-gray-100/50 rounded-full px-1 p-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20",
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

                {/* Contact Action */}
                <Link
                    to="/contact"
                    className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-black/5 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                >
                    Contact
                </Link>

            </div>
        </nav>
    );
}

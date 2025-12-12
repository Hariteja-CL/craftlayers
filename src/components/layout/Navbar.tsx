import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../ui/Button'; // Reuse utility

const navItems = [
    { name: 'Home', path: '/' }, // Renamed from Work as requested
    { name: 'About', path: '/about' },
    { name: 'Insights', path: '/blog' },
    // { name: 'Playground', path: '/playground' }, // Future
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
                scrolled
                    ? "bg-surface/80 backdrop-blur-md border-border-muted shadow-sm py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold tracking-tight text-content-primary">
                    hariteja.<span className="text-content-secondary">design</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "text-sm font-medium transition-colors hover:text-primary-main-400",
                                    isActive ? "text-primary-main-400" : "text-content-secondary"
                                )
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    <Button variant="solid" size="sm" asChild>
                        <Link to="/contact">Let's Talk</Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-content-primary focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-border-muted shadow-lg">
                    <div className="flex flex-col p-6 space-y-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        "block text-base font-medium py-2 transition-colors",
                                        isActive ? "text-primary-main-400" : "text-content-secondary"
                                    )
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                        <div className="pt-4 border-t border-border-muted">
                            <Button className="w-full" asChild>
                                <Link to="/contact" onClick={() => setIsOpen(false)}>
                                    Let's Talk
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Check, Mail } from 'lucide-react';
import { cn } from '../ui/Button';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Insights', path: '/blog' },
    { name: 'About', path: '/about' },
];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [copied, setCopied] = useState(false);
    const navRef = useRef(null);
    const location = useLocation();

    const email = "haritejanandipati@gmail.com";

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setIsMenuOpen(false);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full cl-bg-neutral-surface-level-1 border-b cl-border-border-color-default",
                isScrolled ? "cl-py-100 shadow-sm" : "cl-py-200"
            )}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-2 transition-all duration-300 cl-px-400 w-full max-w-7xl mx-auto">

                {/* Logo + Mobile Toggle */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center justify-between pl-4 md:pl-0">
                        <Link
                            to="/"
                            className="cl-text-400 cl-weight-bold cl-text-neutral-text-high-contrast hover:scale-[1.02] transition-transform cl-focus-ring"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            CraftLayers
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden ml-4 flex items-center p-2 rounded-full hover:cl-bg-neutral-surface-level-2 transition-colors cl-text-neutral-text-high-contrast cl-focus-ring"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Desktop Nav + CTA */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-transparent px-2 space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={cn(
                                    "px-4 py-2 rounded-md cl-text-075 cl-weight-medium transition-all duration-200 cl-focus-ring",
                                    location.pathname === link.path
                                        ? "cl-bg-neutral-surface-level-2 cl-text-neutral-text-high-contrast"
                                        : "cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2"
                                )}
                            >
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={handleCopyEmail}
                        className={cn(
                            "hidden md:flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap focus:outline-none cl-focus-ring ml-2",
                            copied
                                ? "cl-bg-semantic-success-background cl-text-semantic-success-text"
                                : "cl-bg-brand-primary-base cl-text-brand-primary-on-base hover:cl-bg-brand-primary-interaction"
                        )}
                    >
                        {copied ? <Check size={14} /> : <Mail size={14} />}
                        {copied ? "Email copied!" : "Let's Connect"}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={cn(
                    "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
                    isMenuOpen ? "max-h-[400px] opacity-100 mt-4 pb-4" : "max-h-0 opacity-0"
                )}>
                    <div className="flex flex-col gap-2 px-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-lg font-medium transition-colors cl-focus-ring",
                                    location.pathname === link.path
                                        ? "cl-bg-neutral-surface-level-2 cl-text-neutral-text-high-contrast"
                                        : "cl-text-neutral-text-medium-contrast hover:cl-bg-neutral-surface-level-2 hover:cl-text-neutral-text-high-contrast"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleCopyEmail}
                            className={cn(
                                "mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg font-medium transition-colors text-center cl-focus-ring",
                                copied
                                    ? "cl-bg-semantic-success-background cl-text-semantic-success-text"
                                    : "cl-bg-brand-primary-base cl-text-brand-primary-on-base hover:cl-bg-brand-primary-interaction"
                            )}
                        >
                            {copied ? <Check size={18} /> : <Mail size={18} />}
                            {copied ? "Email copied!" : "Let's Connect"}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

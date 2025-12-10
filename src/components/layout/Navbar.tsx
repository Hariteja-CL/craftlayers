import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const location = useLocation();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 w-full border-b border-border-muted bg-surface/80 backdrop-blur-md"
        >
            <div className="container mx-auto flex h-[80px] items-center justify-between px-6 lg:px-12 max-w-[1440px]">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <svg width="40" height="40" viewBox="10 10 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <path d="M10 34C10 20.7452 20.7452 10 34 10C47.2548 10 58 20.7452 58 34C58 47.2548 47.2548 58 34 58C20.7452 58 10 47.2548 10 34Z" fill="#F0F4F5" />
                        <path d="M35.5 29C35.7761 29 36 28.7761 36 28.5C36 28.2239 35.7761 28 35.5 28C35.2239 28 35 28.2239 35 28.5C35 28.7761 35.2239 29 35.5 29Z" fill="#FFA500" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M39.5 33C39.7761 33 40 32.7761 40 32.5C40 32.2239 39.7761 32 39.5 32C39.2239 32 39 32.2239 39 32.5C39 32.7761 39.2239 33 39.5 33Z" fill="#FFA500" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M30.5 30C30.7761 30 31 29.7761 31 29.5C31 29.2239 30.7761 29 30.5 29C30.2239 29 30 29.2239 30 29.5C30 29.7761 30.2239 30 30.5 30Z" fill="#FFA500" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M28.5 35C28.7761 35 29 34.7761 29 34.5C29 34.2239 28.7761 34 28.5 34C28.2239 34 28 34.2239 28 34.5C28 34.7761 28.2239 35 28.5 35Z" fill="#FFA500" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M34 24C28.5 24 24 28.5 24 34C24 39.5 28.5 44 34 44C34.926 44 35.648 43.254 35.648 42.312C35.648 41.875 35.468 41.477 35.211 41.187C34.921 40.898 34.773 40.535 34.773 40.062C34.7692 39.8419 34.8098 39.6233 34.8922 39.4192C34.9747 39.2151 35.0975 39.0298 35.2531 38.8741C35.4088 38.7185 35.5941 38.5957 35.7982 38.5132C36.0023 38.4308 36.2209 38.3902 36.441 38.394H38.437C41.488 38.394 43.992 35.891 43.992 32.84C43.965 28.012 39.461 24 34 24Z" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-lg font-bold tracking-tight text-content-primary">CraftLayers</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8">
                    {links.map((link) => {
                        const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "relative text-sm font-medium transition-all hover:text-primary-500",
                                    isActive ? "text-primary-500 font-semibold" : "text-content-secondary"
                                )}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-[29px] left-0 right-0 h-[2px] bg-primary-500"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-content-primary p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface border-t border-border-muted overflow-hidden"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "text-base font-medium transition-colors hover:text-primary-500 py-2 block",
                                        link.active ? "text-primary-500 font-semibold" : "text-content-secondary"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

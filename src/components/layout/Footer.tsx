
import { Link } from 'react-router-dom';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-border-muted py-12">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Copyright */}
                <div className="flex flex-col gap-2 max-w-md text-center md:text-left">
                    <div className="text-content-tertiary text-sm">
                        &copy; {currentYear} Hariteja. All rights reserved.
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        CraftLayers is the professional portfolio and brand of Hariteja Nandipati, showcasing advanced UX design, system architecture, and security protocols. This site serves as a visual library for enterprise technology solutions and is not affiliated with any e-commerce marketplace.
                    </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 text-sm font-medium text-content-secondary">
                    <Link to="/about" className="hover:text-primary-main-400 transition-colors">
                        About
                    </Link>
                    <Link to="/blog" className="hover:text-primary-main-400 transition-colors">
                        Insights
                    </Link>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-main-400 transition-colors"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}


import { Link } from 'react-router-dom';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-border-muted py-12">
            <div className="container mx-auto px-6">
                <div className="mb-8 max-w-2xl">
                    <h3 className="text-lg font-semibold text-content-primary mb-2">About the Site</h3>
                    <p className="text-content-secondary text-sm leading-relaxed">
                        CraftLayers is the professional portfolio and personal brand of Hariteja Nandipati, a Sr UX Designer. It serves as a showcase for case studies, design insights, and technical explorations in AI, Security, and User Experience. This site is a dedicated space for professional work and is not an e-commerce marketplace.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border-muted/50">
                    {/* Copyright */}
                    <div className="text-content-tertiary text-sm">
                        &copy; {currentYear} Hariteja. All rights reserved.
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
            </div>
        </footer>
    );
}

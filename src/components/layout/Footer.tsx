import { Link } from 'react-router-dom';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="cl-bg-neutral-surface-level-1 border-t cl-border-border-color-default py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Copyright */}
                <div className="flex flex-col gap-2 max-w-md text-center md:text-left">
                    <div className="cl-text-neutral-text-medium-contrast text-sm">
                        &copy; {currentYear} Hariteja Nandipati. All rights reserved.
                    </div>
                    <p className="text-xs cl-text-neutral-text-low-contrast leading-relaxed opacity-70">
                        CraftLayers is the professional portfolio and brand of Hariteja Nandipati, showcasing advanced UX design,
                        system architecture, and security protocols.
                    </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 text-sm font-medium cl-text-neutral-text-medium-contrast">
                    <Link to="/about" className="hover:cl-text-brand-primary-base transition-colors">
                        About
                    </Link>
                    <Link to="/blog" className="hover:cl-text-brand-primary-base transition-colors">
                        Insights
                    </Link>
                    <a
                        href="https://linkedin.com/in/hariteja-nandipati"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:cl-text-brand-primary-base transition-colors"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}

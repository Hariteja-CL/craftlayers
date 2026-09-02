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
                        CraftLayers is the product design portfolio of Hari Nandipati, a Senior Product Designer specialising in
                        enterprise UX, user research, analytics dashboards, design systems, AI-enabled workflows, and privacy-aware
                        product experiences.
                    </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 text-sm font-medium cl-text-neutral-text-medium-contrast">
                    <Link to="/profile" className="hover:cl-text-brand-primary-base transition-colors">
                        Profile
                    </Link>
                    <Link to="/contact" className="hover:cl-text-brand-primary-base transition-colors">
                        Contact
                    </Link>
                    {/* Keeps /blog reachable without returning it to the primary nav */}
                    <Link to="/blog" className="hover:cl-text-brand-primary-base transition-colors">
                        Writing
                    </Link>
                    {/* Library follows the same rule as Writing: live and reachable,
                        but not competing with Work in the primary nav. */}
                    <Link to="/library" className="hover:cl-text-brand-primary-base transition-colors">
                        Library
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

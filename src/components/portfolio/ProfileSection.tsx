

// Note: We'll use the SVGs as images for now since we haven't migrated them to React components
// or we can import them if they are in assets.

import profileHero from '../../assets/images/profile.png';
import linkedinIcon from '../../assets/images/linkedin.svg';
import { FileText } from 'lucide-react';

export function ProfileSection() {
    return (
        <div className="w-full h-full cl-surface-page cl-radius-lg cl-p-inset-400 md:cl-p-inset-600 flex flex-col md:flex-row items-center cl-gap-stack-400 md:cl-gap-stack-600 relative overflow-hidden group border cl-border-subtle hover:cl-elevation-raised transition-all duration-300">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 cl-bg-neutral-surface-level-2 opacity-30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 cl-border-neutral-surface-level-2 shadow-xl overflow-hidden relative">
                    <img src={profileHero} alt="Hariteja" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 cl-bg-neutral-surface-level-1 rounded-full p-1 shadow-sm">
                        <img src={linkedinIcon} alt="in" className="w-3 h-3" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex-1 text-center md:text-left space-y-3">
                <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 cl-text-secondary text-[10px] uppercase tracking-wider font-semibold mb-1">
                        <span>Hariteja Nandipati</span>
                        <span className="w-1 h-1 rounded-full cl-bg-neutral-text-medium-contrast" />
                        <span>Hyderabad, India</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold cl-text-primary">
                        Senior Product Designer & System Builder
                    </h3>
                </div>

                <div className="space-y-4">
                    <p className="cl-text-secondary text-sm leading-relaxed font-medium">
                        I design and ship production-ready product experiences by combining UX, AI-assisted workflows, and frontend execution.
                        <br /><br />
                        8+ years building data-driven platforms, design systems, and secure UX for SaaS products like Enculture.
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold cl-text-brand-primary-base">
                        From research → system design → frontend-ready output.
                    </p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                    <a href="/resume.html" target="_blank" className="cl-bg-color-brand-primary-base cl-text-color-brand-primary-on-base cl-p-inline-500 cl-p-stack-200 cl-radius-full cl-text-075 cl-weight-bold hover:cl-bg-color-brand-primary-interaction focus:outline-none cl-focus-ring flex items-center cl-gap-inline-200 cl-elevation-raised transition-all">
                        <FileText size={16} />
                        View Resume
                    </a>
                    <a href="https://linkedin.com/in/hariteja-nandipati" className="bg-transparent cl-border-thin cl-border-solid cl-border-subtle cl-text-neutral-text-medium-contrast cl-p-inline-500 cl-p-stack-200 cl-radius-full cl-text-075 cl-weight-medium hover:cl-bg-neutral-surface-level-2 hover:cl-text-neutral-text-high-contrast focus:outline-none cl-focus-ring flex items-center cl-gap-inline-200 transition-all">
                        <span className="font-serif italic pr-1 font-bold text-lg">in</span> Connect
                    </a>
                </div>
            </div>
        </div>
    );
}

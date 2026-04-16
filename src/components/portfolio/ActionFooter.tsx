import { useState } from 'react';
import { Mail, Linkedin, FileText, Check } from 'lucide-react';
import { cn } from '../ui/Button';

export function ActionFooter() {
    const [copied, setCopied] = useState(false);
    const email = "haritejanandipati@gmail.com";

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-32 cl-bg-neutral-surface-level-0 border-t cl-border-border-color-default overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-primary-background rounded-full blur-[140px] opacity-40 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold cl-text-neutral-text-high-contrast mb-6 tracking-tight">
                    If your team is stuck between<br />design and development — <span className="cl-text-brand-primary-base">I fix that.</span>
                </h2>
                <p className="cl-text-neutral-text-medium-contrast text-lg mb-12 max-w-xl mx-auto">
                    Currently open to new product leadership and design-engineering opportunities for Fall 2026.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button 
                        onClick={handleCopyEmail}
                        className={cn(
                            "flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 cl-focus-ring shadow-xl hover:-translate-y-1 min-w-[160px] justify-center",
                            copied 
                                ? "cl-bg-semantic-success-background cl-text-semantic-success-text" 
                                : "cl-bg-neutral-text-high-contrast cl-text-inverse hover:cl-bg-neutral-text-medium-contrast"
                        )}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        {copied ? "Email Copied!" : "Email Me"}
                    </button>
                    <a 
                        href="https://www.linkedin.com/in/hariteja-nandipati"
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            "flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 cl-focus-ring border",
                            "cl-bg-neutral-surface-level-1 cl-border-border-color-default cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2"
                        )}
                    >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                    </a>
                    <a 
                        href="#"
                        className={cn(
                            "flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 cl-focus-ring border",
                            "cl-bg-neutral-surface-level-1 cl-border-border-color-default cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2"
                        )}
                    >
                        <FileText className="w-4 h-4" />
                        Download Portfolio
                    </a>
                </div>
                
                <p className="mt-16 text-[10px] font-mono uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast opacity-50">
                    Built by Designer + AI + Systems. 2026.
                </p>
            </div>
        </section>
    );
}

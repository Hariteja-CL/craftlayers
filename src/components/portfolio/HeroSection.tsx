import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Mail } from 'lucide-react';
import { cn } from '../ui/Button';

export function HeroSection() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("haritejanandipati@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="pt-36 pb-24 cl-bg-neutral-surface-level-0">
            <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-5xl">

                    {/* Availability */}
                    <div className="flex items-center gap-2 mb-8 text-[11px] md:text-xs font-mono uppercase tracking-widest cl-text-brand-primary-base">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full cl-bg-brand-primary-base opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full cl-bg-brand-primary-base" />
                        </span>
                        Available for Q3 2026 Projects
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.05] mb-6">
                        UX lead who<br />
                        <span className="cl-text-brand-primary-base">ships the frontend.</span>
                    </h1>

                <p className="text-lg md:text-xl cl-text-neutral-text-medium-contrast mb-2 leading-relaxed max-w-2xl mx-auto font-medium">
                    AI-Native UX Engineer / System-Driven Product Designer | Cybersecurity Practitioner
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-10">
                    Designing systems, not just screens. AI-assisted workflows with production-ready execution.
                </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-start gap-3">
                        <button
                            onClick={() => navigate('/work')}
                            className="px-6 py-3 rounded-xl text-sm font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-all cl-focus-ring"
                        >
                            View Work
                        </button>
                        <button
                            onClick={() => document.getElementById('approach')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-3 rounded-xl text-sm font-semibold border cl-border-border-color-default cl-bg-neutral-surface-level-1 cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-all cl-focus-ring"
                        >
                            How I work
                        </button>
                        <button
                            onClick={handleCopyEmail}
                            className={cn(
                                "px-6 py-3 rounded-xl text-sm font-semibold border transition-all cl-focus-ring flex items-center gap-2",
                                copied
                                    ? "cl-bg-semantic-success-background cl-text-semantic-success-text cl-border-semantic-success-border"
                                    : "border-transparent cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast"
                            )}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                            {copied ? "Email copied" : "Email me"}
                        </button>
                    </div>

                    {/* Keyword strip */}
                    <div className="mt-16 pt-8 border-t cl-border-border-color-default flex flex-wrap gap-x-5 gap-y-2 text-[10px] md:text-xs font-mono uppercase tracking-widest cl-text-neutral-text-low-contrast">
                        {["Design Systems", "React / TypeScript", "Vibe Coding", "Usability Audits", "Design QA", "Security-Aware UX", "Figma → Frontend"].map((k, i, arr) => (
                            <span key={k} className="flex items-center gap-5">
                                {k}
                                {i < arr.length - 1 && <span className="cl-text-neutral-text-low-contrast opacity-30">/</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

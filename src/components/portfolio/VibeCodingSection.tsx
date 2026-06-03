import { CheckCircle2 } from 'lucide-react';

export function VibeCodingSection() {
    const points = [
        "Preserve design system fundamentals",
        "Convert visual decisions into reusable system guidance",
        "Connect Figma components with implementation intent",
        "Improve token, spacing, typography, and component consistency",
        "Support accessibility and usability standards",
        "Reduce design-to-development interpretation gaps",
        "Make the design system useful beyond prototype review",
        "Strengthen design QA and long-term product consistency"
    ];

    return (
        <section id="systems" className="py-24 cl-bg-neutral-surface-level-1 border-t cl-border-border-color-default font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
                    
                    {/* Left Column: Heading & Key Message */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.1em] uppercase border cl-bg-neutral-surface-level-0 cl-border-border-color-default cl-text-brand-primary-base">
                            Systems Governance
                        </div>
                        
                        <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight">
                            Design System Process, Evolved
                        </h2>
                        
                        <p className="cl-text-neutral-text-medium-contrast text-lg leading-relaxed">
                            I do not treat design systems as just Figma component libraries. I follow the core design system process — defining tokens, typography, spacing, components, states, patterns, accessibility rules, and usage guidance — and extend it into formats that support real product execution.
                        </p>
                        
                        <p className="cl-text-neutral-text-medium-contrast text-lg leading-relaxed">
                            This helps the design system move beyond static screens and become a shared source of clarity for designers, developers, AI-assisted workflows, and design QA.
                        </p>

                        {/* Critical Highlight Banner */}
                        <div className="p-6 rounded-2xl cl-bg-brand-primary-background border cl-border-brand-primary-base/20 border-dashed">
                            <p className="text-sm font-semibold cl-text-brand-primary-base leading-relaxed">
                                "This is not a move away from design systems. It is a more mature use of design systems — from visual library to execution-ready product system."
                            </p>
                        </div>
                    </div>

                    {/* Right Column: 8 Core Principles List */}
                    <div className="cl-bg-neutral-surface-level-0 rounded-3xl p-8 border cl-border-border-color-default shadow-sm">
                        <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-6 pb-4 border-b cl-border-border-color-default">
                            Core Focus Areas
                        </h3>
                        
                        <ul className="space-y-4">
                            {points.map((pt, i) => (
                                <li key={i} className="flex gap-4 items-start p-3 rounded-xl hover:cl-bg-neutral-surface-level-2 transition-colors">
                                    <div className="mt-1 shrink-0 cl-text-brand-primary-base">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold cl-text-neutral-text-high-contrast leading-tight">
                                        {pt}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-6 border-t cl-border-border-color-default flex items-center justify-between text-xs cl-text-neutral-text-low-contrast font-mono">
                            <span>Maturity Framework</span>
                            <span>Scale & Consistency</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

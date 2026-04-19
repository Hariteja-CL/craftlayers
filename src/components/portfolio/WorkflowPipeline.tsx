import { cn } from '../ui/Button';

interface Step {
    id: string;
    title: string;
    output: string;
    desc: string;
    icon: React.ReactNode;
    tags: string[];
    isAI?: boolean;
}

const steps: Step[] = [
    {
        id: "01",
        title: "Discovery & Research",
        output: "Clear problem definition",
        desc: "Stakeholder + user alignment",
        icon: (
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        ),
        tags: ["user input", "stakeholder"]
    },
    {
        id: "02",
        title: "Insight to System",
        output: "Structured flows & data models",
        desc: "Stitch + Google Studio orchestration",
        icon: (
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        ),
        tags: ["stakeholder"]
    },
    {
        id: "03",
        title: "System Design",
        output: "Scalable UI architecture",
        desc: "\u00A0",
        icon: (
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        ),
        tags: ["developer collab", "stakeholder"]
    },
    {
        id: "04",
        title: "Vibe Coding (AI Layer)",
        output: "Functional UI structure",
        desc: "Cursor + Antigravity execution",
        isAI: true,
        icon: (
            <svg viewBox="0 0 24 24"><path d="M15 3l6 6-12 12H3v-6L15 3z"/></svg>
        ),
        tags: ["developer collab"]
    },
    {
        id: "05",
        title: "Refinement & Polish",
        output: "Usable, production-ready interface",
        desc: "\u00A0",
        icon: (
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        ),
        tags: ["user input", "stakeholder"]
    },
    {
        id: "06",
        title: "Production UI",
        output: "Clean frontend-ready implementation",
        desc: "\u00A0",
        icon: (
            <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        ),
        tags: ["developer collab"]
    },
    {
        id: "07",
        title: "Handover & Ship",
        output: "Git-ready delivery",
        desc: "GitHub + Vercel deployment",
        icon: (
            <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        ),
        tags: ["developer collab", "stakeholder"]
    }
];

export function WorkflowPipeline() {
    return (
        <section id="workflow" className="py-24 cl-bg-neutral-surface-level-0 border-t cl-border-border-color-default font-sans">
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');
                
                .wp-v2 { font-family: 'Outfit', sans-serif; }
                .wp-v2 .serif { font-family: 'DM Serif Display', serif; }
                .wp-v2 .mono { font-family: 'DM Mono', monospace; }
                
                .wp-v2 .icon-wrap svg { 
                    width: 18px; 
                    height: 18px; 
                }

                .wp-v2 .icon-wrap svg path, 
                .wp-v2 .icon-wrap svg circle, 
                .wp-v2 .icon-wrap svg rect, 
                .wp-v2 .icon-wrap svg polyline, 
                .wp-v2 .icon-wrap svg line, 
                .wp-v2 .icon-wrap svg ellipse { 
                    stroke: var(--cl-color-neutral-text-high-contrast); 
                    fill: none; 
                    stroke-width: 1.5; 
                    stroke-linecap: round; 
                    stroke-linejoin: round; 
                }
                
                .wp-v2 .ai-step .icon-wrap svg path, 
                .wp-v2 .ai-step .icon-wrap svg circle { 
                    stroke: var(--cl-color-brand-primary-base); 
                }

                .wp-v2 .pipeline::before {
                    content: '';
                    position: absolute;
                    top: 27px;
                    left: calc(100% / 14);
                    right: calc(100% / 14);
                    height: 1px;
                    background: var(--cl-border-color-default);
                    z-index: 0;
                }
            `}} />

            <div className="max-w-7xl mx-auto px-6 wp-v2">
                {/* Head */}
                <div className="mb-12">
                    <h2 className="serif text-[28px] cl-text-neutral-text-high-contrast mb-2 tracking-tight">
                        My workflow
                    </h2>
                    <p className="text-[14px] cl-text-neutral-text-medium-contrast mb-1.5 leading-relaxed">
                        A system-first approach that transforms complexity into production-ready UI.
                    </p>
                    <p className="mono text-[11px] cl-text-neutral-text-low-contrast tracking-wider">
                        <span className="cl-text-neutral-text-medium-contrast">Research</span> → 
                        <span className="cl-text-neutral-text-medium-contrast"> System design</span> → 
                        <span className="cl-text-neutral-text-medium-contrast"> AI-assisted execution</span> → 
                        <span className="cl-text-neutral-text-medium-contrast"> Shipped frontend</span>
                    </p>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mb-12 flex-wrap mono">
                    <div className="flex items-center gap-1.5 text-[10px] cl-text-neutral-text-low-contrast tracking-widest font-bold">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-semantic-success-icon" /> user input
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] cl-text-neutral-text-low-contrast tracking-widest font-bold">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-semantic-warning-icon" /> stakeholder input
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] cl-text-neutral-text-low-contrast tracking-widest font-bold">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-semantic-info-icon" /> developer collab
                    </div>
                </div>

                {/* Pipeline */}
                <div className="pipeline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-0 relative">
                    {steps.map((step) => (
                        <div key={step.id} className={cn(
                            "step group flex flex-col items-center px-1 relative z-10",
                            step.isAI && "ai-step"
                        )}>
                            <div className={cn(
                                "icon-wrap w-[54px] h-[54px] rounded-full cl-bg-neutral-surface-level-1 border transition-colors duration-200 flex items-center justify-center mb-2.5",
                                "cl-border-border-color-default group-hover:cl-border-neutral-text-high-contrast",
                                step.isAI && "cl-border-brand-primary-base cl-bg-brand-primary-surface border-[1.5px] group-hover:cl-border-brand-primary-base"
                            )}>
                                {step.icon}
                            </div>
                            
                            <div className="snum mono text-[9px] cl-text-neutral-text-low-contrast mb-1 tracking-widest font-bold">
                                {step.id}
                            </div>
                            
                            <h3 className={cn(
                                "sname text-[11px] font-medium cl-text-neutral-text-high-contrast text-center leading-tight mb-1.5",
                                step.isAI && "cl-text-brand-primary-base"
                            )}>
                                {step.title}
                            </h3>

                            {step.isAI && (
                                <div className="ai-badge mono text-[8px] tracking-wider cl-text-brand-primary-base cl-bg-brand-primary-surface border cl-border-brand-primary-base rounded px-1.5 py-0.5 mb-1.5 font-bold">
                                    AI-assisted
                                </div>
                            )}

                            <div className="output-label mono text-[8px] tracking-[0.1em] cl-text-neutral-text-low-contrast uppercase mb-0.5">
                                output
                            </div>
                            
                            <div className={cn(
                                "output-val text-[10px] font-bold cl-text-neutral-text-high-contrast text-center leading-tight mb-1",
                                step.isAI && "cl-text-brand-primary-base"
                            )}>
                                {step.output}
                            </div>

                            <div className="sdesc text-[9.5px] cl-text-neutral-text-low-contrast text-center leading-relaxed mb-2 min-h-[14px]">
                                {step.desc}
                            </div>

                            <div className="div-line w-[0.5px] h-[14px] cl-bg-border-color-default mb-1.5" />

                            <div className="tags flex flex-col gap-1 w-full max-w-[100px]">
                                {step.tags.map(tag => {
                                    const isUser = tag.includes('user');
                                    const isStakeholder = tag.includes('stakeholder');
                                    const isDev = tag.includes('developer');
                                    
                                    return (
                                        <div 
                                            key={tag} 
                                            className={cn(
                                                "tag text-[8px] mono tracking-tight text-center px-1 py-0.5 rounded border transition-colors",
                                                isUser && "cl-border-semantic-success-border cl-text-semantic-success-text cl-bg-semantic-success-background",
                                                isStakeholder && "cl-border-semantic-warning-border cl-text-semantic-warning-text cl-bg-semantic-warning-background",
                                                isDev && "cl-border-semantic-info-border cl-text-semantic-info-text cl-bg-semantic-info-background",
                                                !isUser && !isStakeholder && !isDev && "cl-border-border-color-default cl-text-neutral-text-low-contrast"
                                            )}
                                        >
                                            {tag}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="footer mt-16 pt-5 border-t cl-border-border-color-default flex flex-col gap-1">
                    <div className="footer-main text-[13px] font-medium cl-text-neutral-text-high-contrast">
                        AI generates speed. Refinement ensures quality.
                    </div>
                    <div className="footer-sub mono text-[10px] cl-text-neutral-text-low-contrast tracking-tight">
                        AI-generated structure → refined → production-ready UI
                    </div>
                </div>
            </div>
        </section>
    );
}

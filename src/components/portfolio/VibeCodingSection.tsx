import { Cpu, Users, Zap, CheckCircle2 } from 'lucide-react';

export function VibeCodingSection() {
    return (
        <section className="py-24 cl-bg-neutral-surface-level-1 border-y cl-border-border-color-default">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-6 tracking-tight">
                            What is Vibe Coding?
                        </h2>
                        <div className="space-y-6">
                            <p className="cl-text-neutral-text-medium-contrast text-lg leading-relaxed">
                                Vibe coding is not AI generating UI. It’s controlling AI to produce structured, buildable interfaces — then refining them into production-quality systems.
                            </p>
                            
                            <ul className="space-y-4">
                                {[
                                    { title: "AI Generates Structure", desc: "Rapidly scaffolding layouts and component boilerplates." },
                                    { title: "Designer Controls Direction", desc: "Setting the high-level system logic and aesthetic intent." },
                                    { title: "Systems Ensure Consistency", desc: "Design tokens act as the guardrails for every pixel." },
                                    { title: "Human Refines Quality", desc: "The final 20% of craft that AI cannot replicate." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="mt-1 p-1 rounded-full cl-bg-brand-primary-background cl-text-brand-primary-base">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold cl-text-neutral-text-high-contrast text-sm">{item.title}</h4>
                                            <p className="cl-text-neutral-text-low-contrast text-xs">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="cl-text-brand-primary-base text-sm font-bold tracking-tight pt-4">
                                AI generates speed. I ensure quality.
                            </p>
                        </div>
                    </div>

                    <div className="cl-bg-neutral-surface-level-2 rounded-3xl p-8 border cl-border-border-color-default shadow-xl">
                        <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-8 border-b cl-border-border-color-default pb-4">
                            Workflow Comparison
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Header row */}
                            <div className="grid grid-cols-2 gap-4 pb-2 text-[10px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast">
                                <div>Traditional UX</div>
                                <div className="cl-text-brand-primary-base">My Approach (Vibe Coding)</div>
                            </div>

                            {[
                                ["Static Screens", "Dynamic Generation"],
                                ["Dev Handoff Gaps", "Frontend-Ready Output"],
                                ["Slow Iteration", "Rapid Iteration Loops"],
                                ["Design vs Dev Conflict", "One Unified Pipeline"]
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-2 gap-4 p-4 rounded-xl cl-bg-neutral-surface-level-0 border cl-border-border-color-default hover:border-brand-primary-base transition-colors group">
                                    <div className="text-xs font-medium cl-text-neutral-text-medium-contrast">{row[0]}</div>
                                    <div className="text-xs font-bold cl-text-neutral-text-high-contrast flex items-center gap-2">
                                        <Zap className="w-3 h-3 cl-text-brand-primary-base" />
                                        {row[1]}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t cl-border-border-color-default flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full border-2 border-slate-800 cl-bg-neutral-surface-level-4 flex items-center justify-center text-[10px] font-bold text-white"><Users size={14} /></div>
                                <div className="w-8 h-8 rounded-full border-2 border-slate-800 cl-bg-brand-primary-base flex items-center justify-center text-[10px] font-bold text-white"><Cpu size={14} /></div>
                            </div>
                            <span className="text-[10px] font-mono cl-text-neutral-text-low-contrast">Human + AI Synergy</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

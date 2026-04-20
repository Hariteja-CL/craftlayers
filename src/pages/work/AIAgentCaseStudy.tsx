import { V2CaseStudyTemplate } from '../../components/portfolio/V2CaseStudyTemplate';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Brain, Sparkles, Layers, Cpu, ArrowRight } from 'lucide-react';

export function AIAgentCaseStudy() {

    const sections = [
        {
            id: "context",
            title: "Research Context",
            content: (
                <div className="space-y-4">
                    <p>
                        This research is grounded in my <strong>Enculture Hackathon 2025</strong> winning project. It explores the transition from static SaaS dashboards to <strong>Generative UI (GenUI)</strong> agents designed specifically for user retention and behavioral alignment.
                    </p>
                    <p className="text-sm border-l-2 cl-border-border-color-default pl-4 italic">
                        "Winner: Enculture Hackathon 2025 — Built a live GenUI agent for account-level retention strategies."
                    </p>
                </div>
            )
        },
        {
            id: "system-thinking",
            title: "Architectural Orchestration",
            content: (
                <div className="space-y-6">
                    <p>
                        The core innovation is the <strong>"Action Engine"</strong> orchestration model. Instead of traditional hard-coded views, the system interprets intent streams to assemble validated components from the CraftLayers design system in real-time.
                    </p>
                    <div className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default p-8 rounded-3xl">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-3">
                                <Brain className="w-5 h-5 mx-auto opacity-50 text-indigo-500" />
                                <div className="font-bold text-sm">Retention Agent</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Growth Logic</p>
                            </div>
                            <div className="space-y-3">
                                <Cpu className="w-5 h-5 mx-auto opacity-50" />
                                <div className="font-bold text-sm">Orchestrator</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">GenUI Assembly</p>
                            </div>
                            <div className="space-y-3">
                                <Layers className="w-5 h-5 mx-auto text-indigo-400" />
                                <div className="font-bold text-sm">Action Stream</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Intent Output</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "proof",
            title: "The Retention Guardrail (Simulation)",
            content: (
                <div className="space-y-8 py-4">
                    <p className="text-sm cl-text-neutral-text-medium-contrast">
                        Experience the logic that won the 2025 Hackathon. This simulation demonstrates how a GenUI agent identifies a churn signal and proactively regenerates the 'Action Feed' to offer a prescriptive recovery plan.
                    </p>
                    <Card className="p-12 cl-bg-neutral-surface-level-1 border cl-border-border-color-default rounded-[3rem] bg-indigo-950 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-bold tracking-tight">Active Simulation: Retention Agent</h4>
                            </div>
                            <div className="space-y-6 mb-10">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl font-mono text-[11px] text-indigo-300">
                                    [AGENT] {"->"} Detected: High-latency churn signal in Sector 07. <br/>
                                    [ORCHESTRATOR] {"->"} Mutating 'BillingUI' to 'RecoveryGuide'... <br/>
                                    [SYSTEM] {"->"} Injecting Prescriptive Intervention Plan...
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-full h-32 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-pulse flex items-center justify-center text-[10px] text-indigo-400 uppercase tracking-widest">
                                        Generating Adaptive Intervention UI
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-neutral-200 justify-between">
                                Trigger Retention Flow
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                    </Card>
                </div>
            )
        },
        {
            id: "impact",
            title: "Impact on SaaS Growth",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
                    <div className="p-8 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default text-center">
                        <div className="text-3xl font-bold cl-text-brand-primary-base">Zero</div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3">Manual Layouts</p>
                    </div>
                    <div className="p-8 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default text-center">
                        <div className="text-3xl font-bold cl-text-brand-primary-base">Win</div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3">Hackathon 2025</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <V2CaseStudyTemplate
            title="The AI Orchestrator (System-Driven UX)"
            subtitle="Autonomous GenUI agents for enterprise dashboard & data visualization UX."
            impactValue="Growth"
            impactLabel="Strategic Focus"
            role="Research & Systems Lead"
            duration="2025 Research"
            badges={["Generative UI", "Retention AI", "Hackathon Winner"]}
            sections={sections}
        />
    );
}


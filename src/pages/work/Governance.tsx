import { V2CaseStudyTemplate } from '../../components/portfolio/V2CaseStudyTemplate';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, Zap, Code2, Search } from 'lucide-react';

export function Governance() {
    const sections = [
        {
            id: "context",
            title: "Context",
            content: (
                <div className="space-y-4">
                    <p>
                        Redesigning a fragmented governance platform formed by the acquisition of three independent SaaS modules. The focus was to transition from a collection of individual tools into a unified, scalable governance ecosystem, managing deep system complexity context.
                    </p>
                </div>
            )
        },
        {
            id: "experience-gap",
            title: "Experience Gap",
            content: (
                <div className="space-y-4">
                    <p>
                        Critical fragmentation: Users faced three disparate login flows, 0% data synchronization between modules, and "dashboards" that were merely navigation lists. The cognitive load for compliance officers managing security audits across these silos was unsustainable.
                    </p>
                </div>
            )
        },
        {
            id: "role",
            title: "Role",
            content: (
                <p className="font-medium cl-text-neutral-text-high-contrast">
                    Experience Translator: transforming technical debt and acquisition complexity into a unified, usable product architecture.
                </p>
            )
        },
        {
            id: "constraints",
            title: "Constraints",
            content: (
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Metrics:</strong> Stakeholder mandate for 15% reduction in churn via platform unification.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Technical Debt:</strong> 6 different date picker implementations and 12 shades of corporate blue across modules.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Dependencies:</strong> Existing AWS/Python stack with high latency in cross-module data syncing.</p>
                    </li>
                </ul>
            )
        },
        {
            id: "system-thinking",
            title: "System Thinking",
            content: (
                <div className="space-y-6">
                    <p>
                        Introduced "The Compiler": A central processing engine that ingests signals from all three modules to produce a single health score.
                    </p>
                    <div className="p-8 border cl-border-border-color-default rounded-3xl cl-bg-neutral-surface-level-1">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-center flex-1">
                                <div className="w-12 h-12 rounded-xl cl-bg-neutral-surface-level-2 flex items-center justify-center mx-auto mb-2">
                                    <Search className="w-6 h-6" />
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest">Signal</div>
                            </div>
                            <div className="h-px bg-border-color-default flex-1" />
                            <div className="text-center flex-1">
                                <div className="w-12 h-12 rounded-xl cl-bg-brand-primary-base cl-text-brand-primary-on-base flex items-center justify-center mx-auto mb-2">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest">Process</div>
                            </div>
                            <div className="h-px bg-border-color-default flex-1" />
                            <div className="text-center flex-1">
                                <div className="w-12 h-12 rounded-xl cl-bg-neutral-surface-level-2 flex items-center justify-center mx-auto mb-2">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest">Insight</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "execution",
            title: "Execution",
            content: (
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <CheckIcon />
                        <p><strong>AI-Assisted Workflow:</strong> Performed a heuristic design audit of 150+ legacy screens in 72 hours using AI agents, leveraging taste-driven decisions to align UI.</p>
                    </li>
                    <li className="flex gap-3">
                        <CheckIcon />
                        <p><strong>Design Systems Architecture:</strong> Engineered a token-based system to replace 14 disparate style files, creating scalable UI systems with AI-compatible components.</p>
                    </li>
                    <li className="flex gap-3">
                        <CheckIcon />
                        <p><strong>Frontend Awareness:</strong> Implemented Automated Governance protocols directly into the UI logic.</p>
                    </li>
                </ul>
            )
        },
        {
            id: "design-decisions",
            title: "Design Decisions",
            content: (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 cl-bg-neutral-surface-level-1 border-none shadow-sm">
                            <h4 className="font-bold mb-2">Why Semantic Tokens</h4>
                            <p className="text-sm cl-text-neutral-text-medium-contrast">Because they prevent UI drift by anchoring colors to roles (e.g., `text-success`) rather than static hex codes.</p>
                        </Card>
                        <Card className="p-6 cl-bg-neutral-surface-level-1 border-none shadow-sm">
                            <h4 className="font-bold mb-2">Why Bento Modularity</h4>
                            <p className="text-sm cl-text-neutral-text-medium-contrast">Because it restricts AI-generated UI variants into predefined, valid containers, ensuring system integrity.</p>
                        </Card>
                    </div>
                </div>
            )
        },
        {
            id: "trade-offs",
            title: "Trade-offs",
            content: (
                <div className="p-6 border cl-border-border-color-default rounded-2xl">
                    <p className="font-bold cl-text-neutral-text-high-contrast mb-2">Universal Uniformity vs. Module-specific Depth</p>
                    <p className="text-sm">Standardizing the interface required oversimplifying some niche legacy configurations to ensure the "Compiler" logic remained scalable across the ecosystem.</p>
                </div>
            )
        },
        {
            id: "output",
            title: "Output",
            content: (
                <div className="space-y-4">
                    <p>
                        A unified Health Score Dashboard and persistent Compliance Linter for frontend-ready UX delivery. 
                        <strong> What this enables:</strong> Real-time risk mitigation and outcome-driven UX across a multi-acquisition enterprise stack.
                    </p>
                </div>
            )
        },
        {
            id: "proof",
            title: "Proof",
            content: (
                <div className="p-8 cl-bg-neutral-surface-level-1 border-2 border-dashed cl-border-border-color-default rounded-3xl text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Requirement → System → UI</div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                        <div className="space-y-2">
                            <div className="text-sm font-bold">Raw Input</div>
                            <div className="text-xs cl-text-neutral-text-medium-contrast">3 Disparate Tools</div>
                        </div>
                        <Zap className="w-4 h-4 cl-text-brand-primary-base rotate-90 md:rotate-0" />
                        <div className="space-y-2">
                            <div className="text-sm font-bold">System</div>
                            <div className="text-xs cl-text-neutral-text-medium-contrast">Unified Token Layer</div>
                        </div>
                        <Zap className="w-4 h-4 cl-text-brand-primary-base rotate-90 md:rotate-0" />
                        <div className="space-y-2">
                            <div className="text-sm font-bold">UI Output</div>
                            <div className="text-xs cl-text-neutral-text-medium-contrast">Centralized Dashboard</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "impact",
            title: "Impact",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl cl-bg-emerald-50 cl-text-emerald-900 border cl-border-emerald-100">
                        <div className="text-2xl font-bold mb-1">Reduced Load</div>
                        <p className="text-xs opacity-80">Cognitive load reduction across workflows.</p>
                    </div>
                    <div className="p-6 rounded-2xl cl-bg-indigo-50 cl-text-indigo-900 border cl-border-indigo-100">
                        <div className="text-2xl font-bold mb-1">65% Save</div>
                        <p className="text-xs opacity-80">Reduced refactoring costs.</p>
                    </div>
                    <div className="p-6 rounded-2xl cl-bg-amber-50 cl-text-amber-900 border cl-border-amber-100">
                        <div className="text-2xl font-bold mb-1">100%</div>
                        <p className="text-xs opacity-80">Compliance with design tokens.</p>
                    </div>
                </div>
            )
        },
        {
            id: "ai-in-execution",
            title: "AI in Execution",
            content: (
                <div className="grid md:grid-cols-2 gap-8 border-t cl-border-border-color-default pt-8">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest cl-text-brand-primary-base mb-4">AI Role</h4>
                        <ul className="space-y-2 text-sm">
                            <li>• Large-scale heuristic auditing</li>
                            <li>• UI variant generation</li>
                            <li>• Rapid boilerplate production</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-high-contrast mb-4">Human Role</h4>
                        <ul className="space-y-2 text-sm">
                            <li>• Architectural logic definition</li>
                            <li>• Semantic vocabulary structuring</li>
                            <li>• Usability refinement & QA</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "next-improvements",
            title: "Next Improvements",
            content: (
                <p>
                    Developing cross-company benchmark signals and automated "one-click" remediation workflows for identified compliance breaches.
                </p>
            )
        }
    ];

    return (
        <V2CaseStudyTemplate
            title="System-Driven UX: Architecting Governance"
            subtitle="Transforming acquisition chaos into a unified, token-based system architecture."
            impactValue="65% Cost Save"
            impactLabel="Refactor Reduction"
            role="Product System Designer"
            duration="3 Months"
            badges={["System Thinking", "Design Systems", "AI Execution"]}
            sections={sections}
        />
    );
}

function CheckIcon() {
    return <Zap className="w-4 h-4 cl-text-brand-primary-base mt-1 shrink-0" />;
}

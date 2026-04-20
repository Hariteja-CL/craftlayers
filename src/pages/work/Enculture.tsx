import { useNavigate } from 'react-router-dom';
import { V2CaseStudyTemplate } from '../../components/portfolio/V2CaseStudyTemplate';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Zap, Brain, ArrowRight, Activity } from 'lucide-react';

export function Enculture() {
    const navigate = useNavigate();

    const sections = [
        {
            id: "context",
            title: "Context",
            content: (
                <div className="space-y-4">
                    <p>
                        Enculture is an enterprise B2B SaaS platform where I served as Senior UX Designer with a heavy focus on Growth. I architected the <strong>"Enculture Action Engine"</strong>, a system that transforms passive metrics into prescriptive AI-driven insights, navigating deep system complexity context for leadership teams.
                    </p>
                    <p className="text-sm border-l-2 cl-border-border-color-default pl-4 italic">
                        "Winner of the Enculture Hackathon 2025 for building a live GenUI agent focused on retention strategies."
                    </p>
                </div>
            )
        },
        {
            id: "experience-gap",
            title: "Experience Gap",
            content: (
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Dashboard Stagnation:</strong> Traditional analytics provided data but no direction, leading to high churn rates in enterprise accounts.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Friction-Heavy Funnels:</strong> Disconnection between marketing acquisition and product retention created a leaky user journey.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Slow Dev Velocity:</strong> Bridging engineering requirements and user-centric prototypes was taking too many cycles, slowing down market validation.</p>
                    </li>
                </ul>
            )
        },
        {
            id: "role",
            title: "Role",
            content: (
                <p className="font-medium cl-text-neutral-text-high-contrast">
                    Senior UX Designer (Growth Focus): responsible for bridging complex engineering requirements with data-driven design strategies to drive retention.
                </p>
            )
        },
        {
            id: "constraints",
            title: "Constraints",
            content: (
                <ul className="space-y-4">
                    <li className="flex gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Engineering:</strong> Deploy live React/TypeScript prototypes to validate marketing hypotheses efficiently.</p>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Execution:</strong> Must scale prescriptive insights across diverse B2B organizational structures.</p>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Market:</strong> Goal to reduce development cycles by ~45% while optimizing for user retention.</p>
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
                        Moved from passive analytics to an <strong>Action-First Architecture</strong>. Instead of asking managers to interpret charts, the system uses agentic workflows to suggest specific interventions.
                    </p>
                    <div className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default p-8 rounded-3xl">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-3">
                                <Activity className="w-5 h-5 mx-auto opacity-50 transition-colors group-hover:text-blue-500" />
                                <div className="font-bold text-sm">Signal Synthesis</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Real-time Stream</p>
                            </div>
                            <div className="space-y-3">
                                <Brain className="w-5 h-5 mx-auto opacity-50" />
                                <div className="font-bold text-sm">Prescriptive AI</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Action Mapping</p>
                            </div>
                            <div className="space-y-3">
                                <Zap className="w-5 h-5 mx-auto cl-text-brand-primary-base" />
                                <div className="font-bold text-sm">Action Engine</div>
                                <p className="text-[10px] opacity-60 uppercase tracking-widest">Growth Guardrails</p>
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
                        <p><strong>Live Prototyping:</strong> Designed and deployed React/TypeScript frontends directly into the dev cycle, reducing time-to-market validation by 45%.</p>
                    </li>
                    <li className="flex gap-3">
                        <CheckIcon />
                        <p><strong>Agentic Retention:</strong> Built GenUI agents within an AI-assisted workflow that mutate based on user intent to proactively address churn signals.</p>
                    </li>
                    <li className="flex gap-3">
                        <CheckIcon />
                        <p><strong>Marketing Alignment:</strong> Synchronized product interfaces with digital marketing funnels to create a seamless acquisition-to-retention journey.</p>
                    </li>
                </ul>
            )
        },
        {
            id: "trade-offs",
            title: "Trade-offs",
            content: (
                <div className="p-6 border cl-border-border-color-default rounded-2xl">
                    <p className="font-bold cl-text-neutral-text-high-contrast mb-2">Automation vs. Interpretability</p>
                    <p className="text-sm">In B2B growth, we chose "Prescriptive Actions" over generic "Drill-Downs". While it reduces total data visibility, it significantly increases decision-making speed for managers, which was the primary driver for retention.</p>
                </div>
            )
        },
        {
            id: "output",
            title: "Output",
            content: (
                <div className="space-y-4 text-center py-4">
                    <div className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default p-10 rounded-[3rem] max-w-lg mx-auto">
                        <Zap className="w-12 h-12 mx-auto mb-6 cl-text-brand-primary-base" />
                        <p className="text-2xl font-bold mb-2">The Action Engine</p>
                        <p className="text-sm cl-text-neutral-text-medium-contrast">A prescriptive SaaS growth system designed for outcome-driven UX, transforming behavioral signals into revenue-protecting actions.</p>
                    </div>
                </div>
            )
        },
        {
            id: "simulations",
            title: "System Proof: Interactive Action Engine",
            content: (
                <div className="space-y-8 py-4">
                    <p className="text-sm cl-text-neutral-text-medium-contrast">
                        Experience the "Action Engine" live. Launch the functional dashboard to see how the prescriptive AI-driven insights are synthesized from raw behavioral metrics.
                    </p>
                    <div className="group relative max-w-2xl mx-auto">
                        <div className="absolute -inset-0.5 cl-bg-brand-primary-base rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition duration-500"></div>
                        <Card className="relative p-10 cl-bg-neutral-surface-level-1 border cl-border-border-color-default rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center gap-8">
                            <div className="p-5 cl-bg-brand-primary-surface rounded-3xl cl-text-brand-primary-base shrink-0">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h4 className="text-2xl font-bold cl-text-primary mb-2">Launch Action Engine</h4>
                                <p className="text-sm cl-text-secondary mb-6">
                                    Functional simulation of the prescriptive logic layer. Features real-time retention monitoring and automated intervention drafting.
                                </p>
                                <Button 
                                    onClick={() => navigate('/dashboard/culture')}
                                    className="w-full md:w-fit justify-between gap-4"
                                >
                                    Enter Action Engine
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )
        },
        {
            id: "impact",
            title: "Impact",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                    <div className="p-8 rounded-3xl cl-bg-emerald-50 cl-text-emerald-900 border cl-border-emerald-100 text-center">
                        <div className="text-3xl font-bold">~45%</div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3">Dev Cycle Reduction</p>
                    </div>
                    <div className="p-8 rounded-3xl cl-bg-indigo-50 cl-text-indigo-900 border cl-border-indigo-100 text-center">
                        <div className="text-3xl font-bold">High</div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3">User Retention</p>
                    </div>
                    <div className="p-8 rounded-3xl cl-bg-amber-50 cl-text-amber-900 border cl-border-amber-100 text-center">
                        <div className="text-3xl font-bold">Live</div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-3">GenUI Prototypes</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <V2CaseStudyTemplate
            title="Enculture—The Action Engine (System-Driven UX)"
            subtitle="Bridging engineering requirements with Human-in-the-Loop workflows."
            impactValue="~45%"
            impactLabel="Dev Velocity"
            role="Senior UX Designer"
            duration="Jan 2024 - Present"
            badges={["B2B SaaS", "Growth Design", "Agentic UI"]}
            sections={sections}
        />
    );
}

function CheckIcon() {
    return <Zap className="w-4 h-4 cl-text-brand-primary-base mt-1 shrink-0" />;
}

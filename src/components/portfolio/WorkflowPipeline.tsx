import { BookOpen, Compass, Grid, Settings, BarChart2 } from 'lucide-react';
import { cn } from '../ui/Button';

interface Step {
    id: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    output?: string;
    isAI?: boolean;
    tags?: string[];
}

const steps: Step[] = [
    {
        id: "01",
        title: "Understand",
        desc: "I study users, workflows, business context, product constraints, and decision points before moving into interface design.",
        icon: <BookOpen className="w-5 h-5" />,
        output: "Mental Models & Flow Maps"
    },
    {
        id: "02",
        title: "Define",
        desc: "I translate product understanding into UX goals, hierarchy, interaction priorities, and design principles.",
        icon: <Compass className="w-5 h-5" />,
        output: "UX Strategy & Hierarchy"
    },
    {
        id: "03",
        title: "Systemize",
        desc: "I align screens with reusable components, tokens, patterns, accessibility rules, and product-level consistency.",
        icon: <Grid className="w-5 h-5" />,
        output: "Design System Guidelines"
    },
    {
        id: "04",
        title: "LLM-Driven UI Generation",
        output: "Functional UI structure",
        desc: "AI-Assisted Design Workflows",
        isAI: true,
        icon: (
            <svg viewBox="0 0 24 24"><path d="M15 3l6 6-12 12H3v-6L15 3z"/></svg>
        ),
        tags: ["developer collab"]
    },
    {
        id: "05",
        title: "Handoff",
        desc: "I support implementation with clear design intent, component guidance, and design-system alignment.",
        icon: <Settings className="w-5 h-5" />,
        output: "Developer Handoff Packages"
    },
    {
        id: "06",
        title: "Improve",
        desc: "I use analytics, user feedback, client interviews, QA findings, and product signals to refine the experience.",
        icon: <BarChart2 className="w-5 h-5" />,
        output: "QA Audits & Iterations"
    }
];

export function WorkflowPipeline() {
    return (
        <section id="process" className="py-24 cl-bg-neutral-surface-level-0 border-t cl-border-border-color-default font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="max-w-3xl mb-16">
                    <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-4 tracking-tight">
                        Design Thinking, Extended for Product Execution
                    </h2>
                    <p className="text-[14px] cl-text-neutral-text-medium-contrast mb-1.5 leading-relaxed">
                        An AI-accelerated design-to-code workflow that transforms complexity into production-ready UI.
                    </p>
                    <p className="mono text-[11px] cl-text-neutral-text-low-contrast tracking-wider">
                        <span className="cl-text-neutral-text-medium-contrast">Research</span> → 
                        <span className="cl-text-neutral-text-medium-contrast"> System design</span> → 
                        <span className="cl-text-neutral-text-medium-contrast"> AI-assisted execution</span> → 
                        <span className="cl-text-neutral-text-medium-contrast"> Shipped frontend</span>
                    </p>
                </div>

                {/* Grid Layout for Process Flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <div 
                            key={step.id} 
                            className={cn(
                                "group p-8 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md",
                                "hover:cl-border-brand-primary-base transition-all duration-300 flex flex-col justify-between"
                            )}
                        >
                            <div>
                                {/* Header with Icon and ID */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 rounded-2xl cl-bg-brand-primary-background cl-text-brand-primary-base flex items-center justify-center">
                                        {step.icon}
                                    </div>
                                    <span className="text-xs font-mono font-bold cl-text-neutral-text-low-contrast tracking-widest">
                                        PHASE {step.id}
                                    </span>
                                </div>

                                {/* Card Copy */}
                                <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-3 group-hover:cl-text-brand-primary-base transition-colors">
                                    {step.title}
                                </h3>
                                <p className="cl-text-neutral-text-medium-contrast text-sm leading-relaxed mb-6">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Phase Output label */}
                            {step.output && (
                                <div className="pt-4 border-t cl-border-border-color-default">
                                    <div className="text-[10px] font-bold uppercase tracking-wider cl-text-neutral-text-low-contrast mb-1">
                                        Focus Output
                                    </div>
                                    <div className="text-xs font-semibold cl-text-neutral-text-high-contrast">
                                        {step.output}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Public Execution Note */}
                <div className="mt-16 p-6 rounded-2xl cl-bg-neutral-surface-level-2 border cl-border-border-color-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider cl-text-brand-primary-base mb-1">
                            Process Philosophy
                        </div>
                        <p className="text-sm cl-text-neutral-text-medium-contrast max-w-2xl">
                            UX is approved and validated before execution, ensuring that development support is guided by strict system rules and human-centered design strategy.
                        </p>
                    </div>
                    <div className="text-xs font-mono cl-text-neutral-text-low-contrast whitespace-nowrap self-end sm:self-center">
                        Strategy First → Implementation Clarity
                    </div>
                </div>

            </div>
        </section>
    );
}

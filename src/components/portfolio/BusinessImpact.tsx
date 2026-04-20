import { BarChart3, Clock, DollarSign, Repeat } from 'lucide-react';
import { cn } from '../ui/Button';

const metrics = [
    {
        icon: <Clock className="w-6 h-6" />,
        stat: "Efficiency",
        label: "Reduced Iteration Cycles",
        desc: "Achieved through structured AI-assisted workflows and reduced iteration cycles.",
        color: "cl-text-brand-primary-base"
    },
    {
        icon: <DollarSign className="w-6 h-6" />,
        stat: "Velocity",
        label: "Idea to Frontend Speed",
        desc: "Accelerated design execution and high-velocity UX delivery for faster transition to production.",
        color: "cl-text-semantic-success-text"
    },
    {
        icon: <Repeat className="w-6 h-6" />,
        stat: "Alignment",
        label: "Reduced Handoff Friction",
        desc: "Less dependency on traditional handoffs by delivering frontend-ready UX.",
        color: "cl-text-semantic-warning-text"
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        stat: "Precision",
        label: "Stakeholder Directness",
        desc: "Improved decision clarity and alignment with core requirements early in development.",
        color: "cl-text-info-text"
    }
];

export function BusinessImpact() {
    return (
        <section className="py-24 cl-bg-neutral-surface-level-1">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-4 tracking-tight">
                        Why This Process Matters
                    </h2>
                    <p className="cl-text-neutral-text-medium-contrast max-w-2xl mx-auto text-lg leading-relaxed">
                        Precision engineering mixed with human-centered design produces measurable business outcomes.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {metrics.map((m, i) => (
                        <div key={i} className="flex flex-col items-center p-8 rounded-3xl cl-bg-neutral-surface-level-0 border cl-border-border-color-default shadow-sm hover:shadow-md transition-shadow">
                            <div className={cn("mb-4", m.color)}>
                                {m.icon}
                            </div>
                            <div className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-2">
                                {m.stat}
                            </div>
                            <h4 className="font-bold cl-text-neutral-text-high-contrast text-sm mb-3">
                                {m.label}
                            </h4>
                            <p className="text-xs cl-text-neutral-text-low-contrast leading-relaxed">
                                {m.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

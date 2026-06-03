import { Layout, GitPullRequest, ToggleLeft, ShieldAlert, Heart, Activity } from 'lucide-react';

interface BenefitCard {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const benefits: BenefitCard[] = [
    {
        title: "Visual-to-System Mapping",
        description: "Translate visual design decisions into reusable system guidance and variables that developers can import directly.",
        icon: <Layout className="w-5 h-5" />
    },
    {
        title: "Implementation Intent",
        description: "Connect Figma components with implementation intent, documenting edge cases, responsive rules, and interaction states.",
        icon: <GitPullRequest className="w-5 h-5" />
    },
    {
        title: "Unified Spacing & Typography",
        description: "Improve token, spacing, typography, and component consistency across multiple engineering frameworks.",
        icon: <ToggleLeft className="w-5 h-5" />
    },
    {
        title: "Clear Component Rules",
        description: "Support designers and developers with clearer component usage guidelines, preventing drift on complex grids.",
        icon: <ShieldAlert className="w-5 h-5" />
    },
    {
        title: "Reduced Mismatch & Gaps",
        description: "Reduce visual and structural interpretation gaps during handoff, making developer estimation much more accurate.",
        icon: <Heart className="w-5 h-5" />
    },
    {
        title: "SaaS Dashboard Scale",
        description: "Keep the design language scalable across dense enterprise screens, filters, tables, and dashboards.",
        icon: <Activity className="w-5 h-5" />
    }
];

export function FigmaToProductSystem() {
    return (
        <section id="figma-to-system" className="py-24 cl-bg-neutral-surface-level-0 border-t cl-border-border-color-default font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-4 tracking-tight">
                        From Figma Library to Product System
                    </h2>
                    <p className="cl-text-neutral-text-medium-contrast text-lg leading-relaxed">
                        Many teams maintain design systems only inside Figma. My work extends the system into reusable tokens, component guidance, accessibility rules, and implementation-aware documentation so the design language can survive beyond static screens.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, i) => (
                        <div 
                            key={i}
                            className="p-8 rounded-3xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md hover:cl-border-brand-primary-base transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl cl-bg-brand-primary-background cl-text-brand-primary-base flex items-center justify-center mb-6">
                                {benefit.icon}
                            </div>
                            <h3 className="text-md font-bold cl-text-neutral-text-high-contrast mb-2">
                                {benefit.title}
                            </h3>
                            <p className="cl-text-neutral-text-medium-contrast text-sm leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

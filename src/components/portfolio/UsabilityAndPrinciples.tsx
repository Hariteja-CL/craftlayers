import { ShieldCheck, Compass, Eye, ShieldAlert, FileText, LayoutGrid, HeartPulse } from 'lucide-react';

export function UsabilityAndPrinciples() {
    const usabilityAreas = [
        { label: "Task Clarity", icon: <Compass className="w-4 h-4" /> },
        { label: "Information Hierarchy", icon: <LayoutGrid className="w-4 h-4" /> },
        { label: "Empty States", icon: <FileText className="w-4 h-4" /> },
        { label: "Error & Feedback States", icon: <ShieldAlert className="w-4 h-4" /> },
        { label: "Dashboard Comprehension", icon: <Eye className="w-4 h-4" /> },
        { label: "Accessibility Standards", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "Permission & Trust Flows", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "Decision-Support UX", icon: <HeartPulse className="w-4 h-4" /> }
    ];

    const principles = [
        "Clarity before complexity",
        "Reusable before custom",
        "Evidence before assumption",
        "Accessible by default",
        "Trust through transparency",
        "Design intent must survive handoff"
    ];

    return (
        <section className="py-24 cl-bg-neutral-surface-level-1 border-t cl-border-border-color-default font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
                    
                    {/* Usability Section */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-4 tracking-tight">
                                Usability & Product Clarity
                            </h2>
                            <p className="cl-text-neutral-text-medium-contrast text-lg leading-relaxed mb-6">
                                I review and structure product experiences for task clarity, hierarchy, empty states, feedback, accessibility, dashboard comprehension, and user decision support.
                            </p>
                        </div>

                        {/* Usability Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {usabilityAreas.map((area, idx) => (
                                <div 
                                    key={idx}
                                    className="flex items-center gap-3 p-4 rounded-2xl cl-bg-neutral-surface-level-0 border cl-border-border-color-default shadow-sm hover:cl-border-brand-primary-base transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg cl-bg-brand-primary-background cl-text-brand-primary-base flex items-center justify-center shrink-0">
                                        {area.icon}
                                    </div>
                                    <span className="text-sm font-semibold cl-text-neutral-text-high-contrast">
                                        {area.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Working Principles Section */}
                    <div className="lg:pl-10 space-y-8 self-center">
                        <div>
                            <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-4 tracking-tight">
                                Working Principles
                            </h2>
                            <p className="cl-text-neutral-text-medium-contrast text-base leading-relaxed">
                                Core design values that guide every layout decision, token system, and execution handoff.
                            </p>
                        </div>

                        {/* Principles Chips List */}
                        <div className="flex flex-wrap gap-3">
                            {principles.map((pr, idx) => (
                                <div 
                                    key={idx}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full cl-bg-neutral-surface-level-0 border cl-border-border-color-default hover:cl-border-brand-primary-base transition-colors shadow-sm"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base" />
                                    <span className="text-xs font-bold uppercase tracking-wider cl-text-neutral-text-high-contrast">
                                        {pr}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

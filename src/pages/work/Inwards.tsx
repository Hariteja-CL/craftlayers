import { useNavigate } from 'react-router-dom';
import { V2CaseStudyTemplate } from '../../components/portfolio/V2CaseStudyTemplate';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Zap, Search, LayoutTemplate, Activity, Users, ShieldCheck, ArrowRight, Monitor, Smartphone } from 'lucide-react';

export function Inwards() {
    const navigate = useNavigate();

    const sections = [
        {
            id: "context",
            title: "Context",
            content: (
                <div className="space-y-4">
                    <p>
                        Inwards is a specialized mental health platform where I led the design strategy for emotional connection features. The goal was to transform clinical requirements into a high-engagement ecosystem that drives repeat usage and patient trust through intuitive data-driven UX.
                    </p>
                    <p className="text-sm border-l-2 cl-border-border-color-default pl-4 italic">
                        "Enabling users to visualize ROI and health performance metrics effectively within a SaaS environment."
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
                        <p><strong>Clinical Disconnection:</strong> Existing health apps felt cold and transactional, resulting in poor user retention and low repeat usage.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Metric Vagueness:</strong> Users and therapists lacked a way to visualize the qualitative ROI of their mental health journey.</p>
                    </li>
                    <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2 shrink-0" />
                        <p><strong>Interface Friction:</strong> Clinicians spent too much time on session prep instead of care due to unoptimized analytical dashboards.</p>
                    </li>
                </ul>
            )
        },
        {
            id: "role",
            title: "Role",
            content: (
                <p className="font-medium cl-text-neutral-text-high-contrast">
                    UX Design Consultant: responsible for engagement optimization and ROI-focused analytical dashboards for SaaS healthcare products.
                </p>
            )
        },
        {
            id: "system-thinking",
            title: "System Thinking",
            content: (
                <div className="space-y-6">
                    <p>
                        Developed an <strong>Emotional Connection Layer</strong> that works in tandem with a <strong>Data-Driven ROI Engine</strong>. This ensures that the qualitative 'feeling' of progress is supported by quantitative clinical metrics.
                    </p>
                    <div className="p-8 cl-bg-neutral-surface-level-1 border cl-border-border-color-default rounded-3xl">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <Users className="w-5 h-5 mx-auto mb-2 opacity-50" />
                                <div className="text-md font-bold">User Trust</div>
                                <div className="text-[10px] mt-1 opacity-60">Emotional Loops</div>
                            </div>
                            <div className="text-center">
                                <Activity className="w-5 h-5 mx-auto mb-2 opacity-50" />
                                <div className="text-md font-bold">ROI Dashboard</div>
                                <div className="text-[10px] mt-1 opacity-60">Growth Metrics</div>
                            </div>
                            <div className="text-center">
                                <ShieldCheck className="w-5 h-5 mx-auto mb-2 opacity-50" />
                                <div className="text-md font-bold">Clinical Care</div>
                                <div className="text-[10px] mt-1 opacity-60">Outcome Visualization</div>
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
                        <p><strong>Retention-Focused Interaction:</strong> Built the Lotus animation engine to reward consistent mood logging, directly impacting repeat usage rates.</p>
                    </li>
                    <li className="flex gap-3">
                        <CheckIcon />
                        <p><strong>ROI visualization:</strong> Delivered high-resolution dashboards for clinicians to see patient trends at a glance, enabling faster ROI demonstration for healthcare providers.</p>
                    </li>
                    <li className="flex gap-3">
                        <CheckIcon />
                        <p><strong>Mobile Engagement:</strong> Focused on mobile-first touchpoints that encourage daily reflection through frictionless gesture-based input.</p>
                    </li>
                </ul>
            )
        },
        {
            id: "trade-offs",
            title: "Trade-offs",
            content: (
                <div className="p-6 border cl-border-border-color-default rounded-2xl">
                    <p className="font-bold cl-text-neutral-text-high-contrast mb-2">Engagement vs. Clinical Depth</p>
                    <p className="text-sm">In healthtech SaaS, we chose to prioritize **Emotional Resonance** over purely clinical metrics for the user view. While this hides some medical complexity, it ensures users actually return to the platform, making the clinical data higher quality over time.</p>
                </div>
            )
        },
        {
            id: "impact",
            title: "Impact",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                    <div className="p-6 rounded-2xl cl-bg-emerald-50 cl-text-emerald-900 border cl-border-emerald-100 text-center">
                        <div className="text-2xl font-bold">High</div>
                        <p className="text-[10px] uppercase font-bold tracking-widest mt-2">User Engagement</p>
                    </div>
                    <div className="p-6 rounded-2xl cl-bg-indigo-50 cl-text-indigo-900 border cl-border-indigo-100 text-center">
                        <div className="text-2xl font-bold">SaaS</div>
                        <p className="text-[10px] uppercase font-bold tracking-widest mt-2">ROI Visualization</p>
                    </div>
                    <div className="p-6 rounded-2xl cl-bg-amber-50 cl-text-amber-900 border cl-border-amber-100 text-center">
                        <div className="text-2xl font-bold">Repeat</div>
                        <p className="text-[10px] uppercase font-bold tracking-widest mt-2">Usage Growth</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <V2CaseStudyTemplate
            title="Inwards—Emotional Connection Engine"
            subtitle="Optimizing retention and ROI through human-centered health systems."
            impactValue="High"
            impactLabel="User Engagement"
            role="UX Design Consultant"
            duration="Nov 2019 - Jul 2022"
            badges={["HealthTech", "ROI Dashboard", "Retention Strategy"]}
            sections={sections}
        />
    );
}

function CheckIcon() {
    return <Zap className="w-4 h-4 cl-text-brand-primary-base mt-1 shrink-0" />;
}

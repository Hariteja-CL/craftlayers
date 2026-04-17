import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Zap, Shield } from 'lucide-react';
import { ServiceCard } from '../../components/portfolio/ServiceCard';

export function Works() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen cl-pt-scale-800 cl-pb-scale-1500">
            <div className="cl-max-w-container-wide mx-auto cl-px-scale-300">
                {/* Header */}
                <header className="cl-mb-scale-400 cl-pt-scale-600">
                    <div className="flex flex-col md:flex-row md:items-end justify-between cl-gap-scale-400">
                        <div className="cl-max-w-container-text">
                            <h1 className="cl-text-600 cl-weight-bold cl-text-neutral-text-high-contrast cl-mb-scale-250 tracking-tight">
                                Workspace.
                            </h1>
                            <p className="cl-text-neutral-text-medium-contrast cl-text-200 cl-leading-150">
                                A choice selection of product systems focused on <span className="cl-text-neutral-text-high-contrast cl-weight-semibold">human cognition</span>, <span className="cl-text-neutral-text-high-contrast cl-weight-semibold">agentic AI</span>, and <span className="cl-text-neutral-text-high-contrast cl-weight-semibold">secure architecture</span>.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Section 1: Layer Explanation */}
                <div className="cl-mb-scale-500 flex flex-col cl-gap-scale-200 cl-max-w-container-text cl-border-l-medium cl-border-border-color-default cl-pl-scale-400 cl-py-scale-050">
                    <p className="cl-text-neutral-text-medium-contrast cl-text-100 cl-weight-medium cl-leading-150">
                        This workspace is structured into three layers:
                    </p>
                    <ul className="flex flex-col cl-gap-scale-150">
                        <li className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-high-contrast cl-weight-bold tracking-tight">Design</span> — where complexity is translated into usable systems
                        </li>
                        <li className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-high-contrast cl-weight-bold tracking-tight">AI</span> — where workflows are accelerated through agent-driven execution
                        </li>
                        <li className="cl-text-neutral-text-medium-contrast">
                            <span className="cl-text-neutral-text-high-contrast cl-weight-bold tracking-tight">Security</span> — where systems are hardened for real-world risks
                        </li>
                    </ul>
                    <p className="cl-text-neutral-text-medium-contrast cl-mt-scale-200 opacity-80 cl-text-075 italic">
                        Each layer contains case studies and working systems that demonstrate how these connect in real products.
                    </p>
                </div>

                {/* Gateway View - Only the 3 cards requested */}
                <div className="grid grid-cols-1 md:grid-cols-3 cl-gap-scale-400 cl-mb-scale-1000">
                    <ServiceCard
                        title="Design Layer"
                        description="UX for complex enterprise systems, focused on cognitive load and mental models."
                        icon={<Layers className="w-6 h-6 cl-text-brand-primary-base" />}
                        variant="light"
                        className="h-full cl-radius-xl border cl-border-border-color-default cl-p-scale-200 hover:shadow-xl transition-all"
                        onClick={() => navigate('/work/design')}
                    />
                    <ServiceCard
                        title="AI Layer"
                        description="Generative UI and agentic workflows that bridge human intent and machine execution."
                        icon={<Zap className="w-6 h-6 text-amber-500" />}
                        variant="light"
                        className="h-full cl-radius-xl border cl-border-border-color-default cl-p-scale-200 hover:shadow-xl transition-all"
                        onClick={() => navigate('/work/ai')}
                    />
                    <ServiceCard
                        title="Security Layer"
                        description="Defensive architecture and zero-trust design patterns for high-stakes environments."
                        icon={<Shield className="w-6 h-6 text-emerald-500" />}
                        variant="light"
                        className="h-full cl-radius-xl border cl-border-border-color-default cl-p-scale-200 hover:shadow-xl transition-all"
                        onClick={() => navigate('/work/security')}
                    />
                </div>

                {/* Section 2: What You'll Find Inside */}
                <div className="cl-mt-scale-900 cl-pt-scale-800 border-t cl-border-border-color-default">
                    <h2 className="cl-text-050 cl-weight-bold uppercase tracking-[0.3em] cl-text-neutral-text-low-contrast cl-mb-scale-200">Inside each layer :</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 cl-gap-scale-600">
                        <div className="flex flex-col cl-gap-scale-200">
                            <h3 className="cl-text-200 cl-weight-bold cl-text-neutral-text-high-contrast tracking-tight underline decoration-neutral-200 underline-offset-8">Case Studies</h3>
                            <p className="cl-text-neutral-text-medium-contrast cl-leading-150 cl-text-075">Real product problems and system-level solutions.</p>
                        </div>
                        <div className="flex flex-col cl-gap-scale-200">
                            <h3 className="cl-text-200 cl-weight-bold cl-text-neutral-text-high-contrast tracking-tight underline decoration-neutral-200 underline-offset-8">Working Systems</h3>
                            <p className="cl-text-neutral-text-medium-contrast cl-leading-150 cl-text-075">AI agents and workflows demonstrating execution.</p>
                        </div>
                        <div className="flex flex-col cl-gap-scale-200">
                            <h3 className="cl-text-200 cl-weight-bold cl-text-neutral-text-high-contrast tracking-tight underline decoration-neutral-200 underline-offset-8">Design Decisions</h3>
                            <p className="cl-text-neutral-text-medium-contrast cl-leading-150 cl-text-075">How complexity is structured into clarity.</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: How I Work (Pipeline) */}
                <div className="cl-mt-scale-800 flex flex-col">
                    <h2 className="cl-text-050 cl-weight-bold uppercase tracking-[0.3em] cl-text-neutral-text-low-contrast cl-mb-scale-200">Methodology :</h2>
                    <div className="flex flex-wrap items-center cl-gap-scale-250 cl-text-neutral-text-high-contrast cl-text-200 cl-weight-semibold tracking-tight">
                        <span>Research</span>
                        <span className="cl-text-neutral-text-low-contrast cl-weight-light opacity-50">/</span>
                        <span>System Design</span>
                        <span className="cl-text-neutral-text-low-contrast cl-weight-light opacity-50">/</span>
                        <span>AI-assisted generation</span>
                        <span className="cl-text-neutral-text-low-contrast cl-weight-light opacity-50">/</span>
                        <span>Refinement</span>
                        <span className="cl-text-neutral-text-low-contrast cl-weight-light opacity-50">/</span>
                        <span>Production UI</span>
                    </div>
                    <p className="cl-text-neutral-text-medium-contrast cl-max-w-container-text cl-leading-150 opacity-80 cl-mt-scale-200">
                        This ensures every output is not just designed, but built and usable.
                    </p>
                </div>

                {/* Section 4: Final Proof Line */}
                <div className="cl-mt-scale-600 text-center border-t cl-border-border-color-default cl-pt-scale-600 cl-pb-scale-500">
                    <p className="cl-text-050 cl-weight-bold uppercase tracking-[0.4em] cl-text-neutral-text-low-contrast opacity-40">
                        From concept to working system — not just screens.
                    </p>
                </div>
            </div>
        </div>
    );
}

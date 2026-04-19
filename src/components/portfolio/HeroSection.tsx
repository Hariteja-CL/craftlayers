import { useNavigate } from 'react-router-dom';
import { ChevronDown, Zap, Target, Shield, Rocket } from 'lucide-react';
import { cn } from '../ui/Button';

export function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative py-20 lg:py-32 overflow-hidden cl-bg-neutral-surface-level-0">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-primary-background rounded-full blur-[120px] opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-info-background rounded-full blur-[100px] opacity-30 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase mb-8 border",
                    "cl-bg-neutral-surface-level-1 cl-border-border-color-default cl-text-brand-primary-base"
                )}>
                    <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full cl-bg-brand-primary-base opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 cl-bg-brand-primary-base"></span>
                    </span>
                    Available for Q3 2026 Projects
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold cl-text-neutral-text-high-contrast mb-6 tracking-tight leading-[1.1]">
                    Design <span className="cl-text-neutral-text-medium-contrast">→</span> Code <span className="cl-text-neutral-text-medium-contrast">→</span> Ship.<br />
                    <span className="cl-text-brand-primary-base">One pipeline.</span>
                </h1>

                <p className="text-lg md:text-xl cl-text-neutral-text-medium-contrast mb-2 leading-relaxed max-w-2xl mx-auto font-medium">
                    Senior Product Designer | UX Architect | AI Workflow Builder | Cybersecurity Practitioner
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-10">
                    System-first. Code-aware. AI-accelerated.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <button 
                        onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}
                        className={cn(
                            "w-full sm:w-auto px-8 py-4 rounded-xl text-md font-semibold transition-all duration-300 cl-focus-ring flex items-center justify-center gap-2 shadow-lg",
                            "cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction hover:-translate-y-0.5"
                        )}
                    >
                        Explore My Work Process
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => navigate('/work')}
                        className={cn(
                            "w-full sm:w-auto px-8 py-4 rounded-xl text-md font-semibold transition-all duration-300 cl-focus-ring border",
                            "cl-bg-neutral-surface-level-1 cl-border-border-color-default cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2"
                        )}
                    >
                        Explore Work
                    </button>
                </div>

                {/* Proof Points */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {[
                        { icon: <Zap className="w-5 h-5" />, label: "AI-Assisted Rapid Delivery" },
                        { icon: <Shield className="w-5 h-5" />, label: "Security-Aware UX" },
                        { icon: <Target className="w-5 h-5" />, label: "Design Systems @ Scale" },
                        { icon: <Rocket className="w-5 h-5" />, label: "Production Frontend Output" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md transition-shadow">
                            <div className="cl-text-brand-primary-base">
                                {item.icon}
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider cl-text-neutral-text-medium-contrast leading-tight">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

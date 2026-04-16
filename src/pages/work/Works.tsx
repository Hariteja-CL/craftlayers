import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceCard } from '../../components/portfolio/ServiceCard';
import { ArrowLeft } from 'lucide-react';
import designIcon from '../../assets/images/icon-design.svg';
import aiIcon from '../../assets/images/icon-ai.svg';
import securityIcon from '../../assets/images/icon-security.svg';

export function Works() {
    const { hash } = useLocation();
    const navigate = useNavigate();
    const activeLayer = hash.replace('#', '');


    useEffect(() => {
        if (activeLayer) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeLayer]);

    const handleBack = () => {
        navigate('/work');
    };

    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pt-24 pb-40">
            <AnimatePresence mode="wait">
                {!activeLayer ? (
                    <motion.div 
                        key="gateway"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto px-6"
                    >
                        <header className="mb-20 text-center pt-12">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-bold cl-text-neutral-text-high-contrast mb-6 tracking-tight"
                            >
                                My System Layers
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="cl-text-neutral-text-medium-contrast text-xl max-w-2xl mx-auto"
                            >
                                A unified gallery of my work across product design, autonomous agents, and defensive architecture.
                            </motion.p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ServiceCard
                                title="Design Layer"
                                description="Case studies in enterprise UX and cognitive ergonomics."
                                icon={<img src={designIcon} alt="Design" className="w-5 h-5" />}
                                onClick={() => navigate('/work#design')}
                                className="hover:scale-[1.02] transition-transform h-auto py-8"
                            />
                            <ServiceCard
                                title="AI Layer"
                                description="Research in generative UI and agentic workflows."
                                icon={<img src={aiIcon} alt="AI" className="w-5 h-5 grayscale opacity-70" />}
                                onClick={() => navigate('/work#ai')}
                                className="hover:scale-[1.02] transition-transform h-auto py-8"
                            />
                            <ServiceCard
                                title="Security Layer"
                                description="Defensive design and zero-trust UI patterns."
                                icon={<img src={securityIcon} alt="Security" className="w-5 h-5" />}
                                onClick={() => navigate('/work#security')}
                                className="hover:scale-[1.02] transition-transform h-auto py-8"
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="layer-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        {/* Sticky Sub-nav */}
                        <div className="sticky top-24 z-40 bg-white/80 backdrop-blur-md border-b cl-border-border-color-default py-4 mb-16">
                            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                                <button 
                                    onClick={handleBack}
                                    className="group flex items-center gap-3 text-sm font-bold cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full border cl-border-border-color-default flex items-center justify-center group-hover:cl-bg-neutral-surface-level-2 transition-colors">
                                        <ArrowLeft className="w-4 h-4" />
                                    </div>
                                    Back to Workspace
                                </button>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Active System</span>
                                    <div className="px-4 py-1.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest">
                                        {activeLayer} Layer
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-6">
                            {activeLayer === 'design' && (
                                <Section 
                                    id="design" 
                                    title="Design Layer" 
                                    subtitle="Orchestrating complex information systems into intuitive product experiences."
                                    accent="bg-blue-500/10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <CaseStudyCard 
                                            title="Inwards" 
                                            description="A wellness ecosystem for cognitive health and therapist-patient transparency."
                                            type="Ecosystem Design"
                                            tags={["UX Architecture", "Enterprise", "HealthTech"]}
                                            path="/work/inwards"
                                            image="/assets/images/inwards-hero.png"
                                        />
                                        <CaseStudyCard 
                                            title="Enculture" 
                                            description="AI-integrated culture monitoring and ethical feedback loops."
                                            type="System Design"
                                            tags={["AI Ethics", "Real-time Data", "B2B SaaS"]}
                                            path="/work/enculture"
                                            image="/assets/images/enculture_hero.png"
                                        />
                                    </div>
                                </Section>
                            )}

                            {activeLayer === 'ai' && (
                                <Section 
                                    id="ai" 
                                    title="AI Layer" 
                                    subtitle="Exploring autonomous frontends and generative interface orchestration."
                                    accent="bg-purple-500/10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <AgentDemoCard 
                                            title="The Orchestrator" 
                                            description="A generative UI agent that mutates interface components based on user intent streams."
                                            type="Interactive Proof"
                                            status="Live Proof"
                                            path="/work/agent-ai"
                                        />
                                    </div>
                                </Section>
                            )}

                            {activeLayer === 'security' && (
                                <Section 
                                    id="security" 
                                    title="Security Layer" 
                                    subtitle="Hardening user trust through defensive UI architecture and zero-trust patterns."
                                    accent="bg-emerald-500/10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <AgentDemoCard 
                                            title="The Sentinel" 
                                            description="Implementing zero-trust feedback triggers to prevent data leakage in shared workspaces."
                                            type="Security Research"
                                            status="Security Research"
                                            path="/work/agent-security"
                                        />
                                    </div>
                                </Section>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Section({ id, title, subtitle, children, accent }: { id: string, title: string, subtitle: string, children: React.ReactNode, accent?: string }) {
    return (
        <section id={id} className="scroll-mt-48">
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] cl-text-neutral-text-medium-contrast ${accent}`}>
                        Core System Layer
                    </span>
                </div>
                <h2 className="text-4xl font-bold cl-text-neutral-text-high-contrast mb-4">{title}</h2>
                <p className="cl-text-neutral-text-medium-contrast text-xl max-w-2xl leading-relaxed">{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

function CaseStudyCard({ title, description, type, tags, path }: { title: string, description: string, type: string, tags: string[], path: string, image?: string }) {
    return (
        <Link 
            to={path}
            className="group block p-8 lg:p-12 rounded-[3.5rem] cl-bg-neutral-surface-level-1 border cl-border-border-color-default hover:cl-bg-neutral-surface-level-2 transition-all duration-500 relative overflow-hidden"
        >
            <div className="mb-12">
                <div className="text-xs font-bold uppercase tracking-[0.2em] cl-text-neutral-text-medium-contrast mb-6 opacity-60">
                    {type}
                </div>
                <h3 className="text-3xl font-bold cl-text-neutral-text-high-contrast mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {title}
                </h3>
                <p className="cl-text-neutral-text-medium-contrast text-lg leading-relaxed mb-8">
                    {description}
                </p>
                <div className="flex flex-wrap gap-3">
                    {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white border cl-border-border-color-default rounded-full text-xs font-medium cl-text-neutral-text-medium-contrast">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="flex items-center text-sm font-bold cl-text-brand-primary-base tracking-wide">
                Launch System Case Study
                <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </Link>
    );
}

function AgentDemoCard({ title, description, type, status, path }: { title: string, description: string, type: string, status: string, path: string }) {
    return (
        <Link 
            to={path}
            className="group block p-8 lg:p-12 rounded-[3.5rem] bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-500 relative overflow-hidden h-full"
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 opacity-80">
                        {type}
                    </div>
                    <span className="px-3 py-1 bg-neutral-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-700">
                        {status}
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {title}
                </h3>
                <p className="text-neutral-400 text-lg leading-relaxed mb-10">
                    {description}
                </p>
                
                <div className="flex items-center text-sm font-bold text-white tracking-wide">
                    Interact with Agent
                    <div className="ml-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-emerald-500/0 group-hover:from-indigo-500/5 group-hover:to-emerald-500/5 transition-all duration-700" />
        </Link>
    );
}

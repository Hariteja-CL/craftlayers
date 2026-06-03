import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MoveRight } from 'lucide-react';
import { HeroSection } from '../components/portfolio/HeroSection';
import { ActionFooter } from '../components/portfolio/ActionFooter';
import profileHero from '../assets/images/profile.png';
import linkedinIcon from '../assets/images/linkedin.svg';
import { FileText } from 'lucide-react';

// ─── About Strip ──────────────────────────────────────────────────────────────
function AboutStrip() {
    return (
        <section className="py-16 border-t cl-border-border-color-default cl-bg-neutral-surface-level-1">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
                    {/* Photo + identity */}
                    <div className="flex items-center gap-5 shrink-0">
                        <div className="w-14 h-14 rounded-full border-2 cl-border-neutral-surface-level-2 overflow-hidden shadow-sm">
                            <img src={profileHero} alt="Hariteja Nandipati" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="text-sm font-bold cl-text-neutral-text-high-contrast">Hariteja Nandipati</div>
                            <div className="text-xs cl-text-neutral-text-low-contrast font-mono">Hyderabad, India · 12+ yrs</div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-12 cl-bg-border-color-default opacity-40" />

                    {/* Bio */}
                    <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                        Lead UX Designer specialised in enterprise SaaS, design systems, and AI-assisted product execution.
                        8+ years at the intersection of design, usability, and production frontend code.
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 ml-auto shrink-0">
                        <a
                            href="/resume.html"
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-all cl-focus-ring"
                        >
                            <FileText size={13} />
                            Resume
                        </a>
                        <a
                            href="https://linkedin.com/in/hariteja-nandipati"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border cl-border-border-color-default cl-bg-neutral-surface-level-0 cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-all cl-focus-ring"
                        >
                            <img src={linkedinIcon} alt="in" className="w-3.5 h-3.5" />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── The Two Flows ────────────────────────────────────────────────────────────
function ApproachSection() {
    const flowA = [
        "Business requirements come in",
        "I create vibe coding formats & structure",
        "Design system — tokens, components, patterns",
        "Prototype & user testing",
        "Stakeholder sign-off",
        "I build the frontend myself",
    ];

    const flowB = [
        "Developer ships vibe-coded frontend",
        "I audit the UX and usability",
        "Map friction points & design system drift",
        "Fix directly in the codebase",
        "Validate changes with users",
        "Align with design system standards",
    ];

    return (
        <section id="approach" className="py-20 border-t cl-border-border-color-default cl-bg-neutral-surface-level-0">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast">How I engage</span>
                    <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mt-2">
                        Two ways I operate.
                    </h2>
                    <p className="cl-text-neutral-text-medium-contrast mt-3 max-w-xl text-base leading-relaxed">
                        Unlike most UX designers, I stay end-to-end — either leading the design system from scratch
                        or stepping into an existing codebase and fixing it directly.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Flow A */}
                    <div className="border cl-border-border-color-default rounded-2xl p-8 cl-bg-neutral-surface-level-0 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] cl-text-brand-primary-base">Flow 01</span>
                            <span className="text-[10px] md:text-xs font-mono cl-text-neutral-text-low-contrast">UX-Led</span>
                        </div>
                        <h3 className="text-lg font-bold cl-text-neutral-text-high-contrast mb-2">
                            I lead from requirements to production.
                        </h3>
                        <p className="text-sm cl-text-neutral-text-medium-contrast mb-8 leading-relaxed">
                            I take raw business requirements, structure the problem space, design and test,
                            then build the frontend myself — closing the loop between intention and implementation.
                        </p>
                        <ol className="space-y-3">
                            {flowA.map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-[10px] md:text-xs font-mono cl-text-neutral-text-low-contrast w-5 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-sm cl-text-neutral-text-high-contrast font-medium leading-snug">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Design Layer */}
                        <ServiceCard
                            title="Design Layer"
                            description="Human-centered UX for complex enterprise platforms. Focus on cognitive load reduction and human-in-the-loop workflows."
                            icon={<img src={designIcon} alt="Design" className="w-5 h-5" />}
                            variant="light"
                            onClick={() => navigate('/work#design')}
                            className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md h-full rounded-3xl"
                        />

                        {/* AI Layer */}
                        <ServiceCard
                            title="AI Layer"
                            description="Generative UI & Adaptive flows. Orchestrating agents for autonomous frontends."
                            icon={<img src={aiIcon} alt="AI" className="w-5 h-5 opacity-90 grayscale" />}
                            variant="light"
                            onClick={() => navigate('/work#ai')}
                            className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md h-full rounded-3xl"
                        />

                        {/* Security Layer */}
                        <ServiceCard
                            title="Security Layer"
                            description="Implementing zero-trust design patterns and defensive UI architectures."
                            icon={<img src={securityIcon} alt="Security" className="w-5 h-5" />}
                            variant="light"
                            onClick={() => navigate('/work#security')}
                            className="cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md h-full rounded-3xl"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px border cl-border-border-color-default rounded-2xl overflow-hidden">
                    {areas.map((area, i) => (
                        <div
                            key={i}
                            className="p-6 cl-bg-neutral-surface-level-0 hover:cl-bg-neutral-surface-level-1 transition-colors group"
                        >
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 cl-text-brand-primary-base mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-sm font-bold cl-text-neutral-text-high-contrast mb-1 group-hover:cl-text-brand-primary-base transition-colors">
                                        {area.label}
                                    </div>
                                    <div className="text-xs cl-text-neutral-text-medium-contrast leading-relaxed">
                                        {area.desc}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Selected Work ────────────────────────────────────────────────────────────
function SelectedWorkSection() {
    const navigate = useNavigate();

    const projects = [
        {
            index: "01",
            title: "Inwards",
            category: "Mental Wellness SaaS",
            tags: ["Design System", "SaaS Dashboard", "Usability"],
            desc: "Dual-role dashboard system for users and therapists — mood tracking, AI recommendations, and sentiment analysis.",
            path: "/work/inwards",
            year: "2024",
        },
        {
            index: "02",
            title: "Enculture",
            category: "Culture Analytics Platform",
            tags: ["AI-Assisted", "Enterprise UX", "Frontend"],
            desc: "Prescriptive AI engine and action cards for culture data — turning survey signals into human-readable interventions.",
            path: "/work/enculture",
            year: "2024",
        },
        {
            index: "03",
            title: "Architecturing Governance",
            category: "Design System Overhaul",
            tags: ["Token System", "Design QA", "Governance"],
            desc: "End-to-end design system rebuild — 3-layer token architecture, component standards, and implementation handoff documentation.",
            path: "/work/architecturing-governance",
            year: "2024",
        },
    ];

    return (
        <section id="work" className="py-20 border-t cl-border-border-color-default cl-bg-neutral-surface-level-0">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast">Case Studies</span>
                        <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mt-2">
                            Selected work.
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/work')}
                        className="hidden md:flex items-center gap-2 text-xs font-semibold cl-text-brand-primary-base hover:gap-3 transition-all"
                    >
                        All projects <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="space-y-px border cl-border-border-color-default rounded-2xl overflow-hidden">
                    {projects.map((p) => (
                        <button
                            key={p.index}
                            onClick={() => navigate(p.path)}
                            className="w-full text-left p-6 cl-bg-neutral-surface-level-0 hover:cl-bg-neutral-surface-level-1 transition-colors group flex flex-col md:flex-row md:items-center gap-4"
                        >
                            {/* Index */}
                            <span className="text-[10px] md:text-xs font-mono cl-text-neutral-text-low-contrast w-8 shrink-0">
                                {p.index}
                            </span>

                            {/* Main content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                    <span className="text-base font-bold cl-text-neutral-text-high-contrast group-hover:cl-text-brand-primary-base transition-colors">
                                        {p.title}
                                    </span>
                                    <span className="text-xs cl-text-neutral-text-low-contrast md:ml-1">— {p.category}</span>
                                </div>
                                <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed line-clamp-1">
                                    {p.desc}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="hidden lg:flex items-center gap-2 shrink-0">
                                {p.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider cl-bg-neutral-surface-level-2 cl-text-neutral-text-low-contrast"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Year + arrow */}
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs font-mono cl-text-neutral-text-low-contrast">{p.year}</span>
                                <MoveRight className="w-4 h-4 cl-text-neutral-text-low-contrast group-hover:cl-text-brand-primary-base group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/work')}
                    className="mt-4 md:hidden flex items-center gap-2 text-xs font-semibold cl-text-brand-primary-base"
                >
                    All projects <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </section>
    );
}

// ─── Process ──────────────────────────────────────────────────────────────────
function ProcessSection() {
    const steps = [
        {
            id: "01",
            title: "Understand",
            desc: "User workflows, business context, product constraints, and decision-making surfaces.",
        },
        {
            id: "02",
            title: "Systemize",
            desc: "Tokens, components, accessibility rules, patterns — the design system as a living product.",
        },
        {
            id: "03",
            title: "Validate",
            desc: "Prototypes, usability reviews, stakeholder feedback — before a line of production code.",
        },
        {
            id: "04",
            title: "Ship",
            desc: "I write the frontend. React, TypeScript, Tailwind — design intent stays intact to production.",
        },
    ];

    return (
        <section className="py-20 border-t cl-border-border-color-default cl-bg-neutral-surface-level-1">
            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-10">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast">Process</span>
                    <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mt-2">
                        How every project moves.
                    </h2>
                </div>

                {/* Horizontal steps */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((step, i) => (
                        <div key={step.id} className="relative">
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-5 left-[calc(100%_-_8px)] w-4 h-px cl-bg-border-color-default opacity-60 z-10" />
                            )}
                            <div className="p-5 rounded-xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 h-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] md:text-xs font-mono cl-text-neutral-text-low-contrast">{step.id}</span>
                                    <div className="h-px flex-1 cl-bg-border-color-default opacity-40" />
                                </div>
                                <div className="text-sm font-bold cl-text-neutral-text-high-contrast mb-1.5">
                                    {step.title}
                                </div>
                                <div className="text-xs cl-text-neutral-text-medium-contrast leading-relaxed">
                                    {step.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Principle strip */}
                <div className="mt-6 px-5 py-4 rounded-xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 flex flex-wrap items-center gap-x-6 gap-y-1">
                    {[
                        "Clarity before complexity",
                        "Reusable before custom",
                        "Evidence before assumption",
                        "Accessible by default",
                        "Design intent must survive handoff",
                    ].map((p, i, arr) => (
                        <span key={p} className="flex items-center gap-6">
                            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest cl-text-neutral-text-low-contrast">
                                {p}
                            </span>
                            {i < arr.length - 1 && (
                                <span className="cl-text-neutral-text-low-contrast opacity-30 text-base">·</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── System Layers ────────────────────────────────────────────────────────────
function LayersSection() {
    const navigate = useNavigate();

    const layers = [
        {
            id: "Design",
            desc: "Human-centred UX for complex enterprise platforms. Cognitive load reduction, mental models, design system governance.",
            path: "/work/design",
        },
        {
            id: "AI",
            desc: "Generative UI and agentic workflows. Vibe coding formats, AI-assisted execution, autonomous frontends.",
            path: "/work/ai",
        },
        {
            id: "Security",
            desc: "Zero-trust design patterns, defensive UI architecture, data least-privilege, and privacy-first UX.",
            path: "/work/security",
        },
    ];

    return (
        <section className="py-20 border-t cl-border-border-color-default cl-bg-neutral-surface-level-0">
            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-10">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast">Workspace</span>
                    <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight mt-2">
                        Three layers. Every product.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {layers.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => navigate(l.path)}
                            className="text-left p-6 rounded-xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 hover:cl-border-brand-primary-base hover:cl-bg-neutral-surface-level-0 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-base font-bold cl-text-neutral-text-high-contrast group-hover:cl-text-brand-primary-base transition-colors">
                                    {l.id} Layer
                                </span>
                                <ArrowRight className="w-4 h-4 cl-text-neutral-text-low-contrast group-hover:cl-text-brand-primary-base group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-sm cl-text-neutral-text-medium-contrast leading-relaxed">
                                {l.desc}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export function Home() {
    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen">
            <HeroSection />
            <AboutStrip />
            <ApproachSection />
            <FocusSection />
            <SelectedWorkSection />
            <ProcessSection />
            <LayersSection />
            <ActionFooter />
        </div>
    );
}

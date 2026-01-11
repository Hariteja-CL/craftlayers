import { ArrowLeft, Sparkles, Brain, Zap, MousePointerClick, ShieldCheck, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { DesignerNoteChip } from '../../components/ui/DesignerNoteChip';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

import { PasswordGate } from '../../components/ui/PasswordGate';

export function Enculture() {
    const navigate = useNavigate();

    return (
        <PasswordGate scope="enculture_casestudy">
            <article className="pb-20">
                {/* Case Study Hero */}
                <section className="bg-surface-subtle border-b border-border-muted pt-12 pb-20 relative overflow-hidden">
                    {/* Background Atmosphere */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob opacity-50 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000 opacity-50 pointer-events-none" />

                    <div className="container mx-auto px-6 max-w-container relative z-10">
                        <Link to="/work/ai" className="inline-flex items-center text-sm font-medium text-content-secondary hover:text-indigo-600 mb-8 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to AI Layers
                        </Link>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="flex flex-col md:flex-row gap-8 items-start justify-between mb-12"
                        >
                            <div className="max-w-3xl">
                                <div className="flex gap-2 mb-4">
                                    <Badge variant="warning">AI Governance</Badge>
                                    <Badge variant="secondary">Legacy Modernization</Badge>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-content-primary mb-6 leading-tight tracking-tight">
                                    AI-Mediated Governance: Solving Leadership Cognitive Drain
                                </h1>
                                <p className="text-xl text-content-secondary leading-relaxed">
                                    Increasing <span className="text-indigo-600 font-semibold">Decision Velocity by 40%</span> via an AI-Driven "Action Engine."
                                </p>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                                <div>
                                    <h4 className="font-bold text-content-primary mb-1">Impact</h4>
                                    <p className="text-indigo-600 font-bold">+40% Velocity</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-content-primary mb-1">Role</h4>
                                    <p className="text-content-secondary">Lead UX & Architect</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-content-primary mb-1">Duration</h4>
                                    <p className="text-content-secondary">4 Months</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-content-primary mb-1">Key Result</h4>
                                    <p className="text-content-secondary">Viewing to Executing <br />&lt; 5 Minutes</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="rounded-[2rem] overflow-hidden border border-indigo-100 shadow-xl bg-neutral-900 relative aspect-[21/9] flex items-center justify-center"
                        >
                            <img
                                src="/assets/images/enculture_hero.png"
                                alt="Enculture Action Engine UI"
                                className="absolute inset-0 w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
                        </motion.div>
                    </div>
                </section>

                {/* Content Container */}
                <div className="container mx-auto px-6 max-w-3xl mt-20 space-y-24">

                    {/* Strategic Overview (The Hook) */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Strategic Overview</h2>
                            <p className="text-lg text-content-secondary leading-relaxed">
                                Most organizational leaders were unable to use culture dashboards effectively. While the dashboards were data-rich, they were <strong>utility-poor</strong>. Leaders faced massive <strong>Cognitive Drain</strong> trying to analyze raw sentiment scores and brainstorm interventions while managing daily operations.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-red-50/50 border-red-100 p-6">
                                <h3 className="font-bold text-lg text-red-900 mb-4">The Problem</h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-2 items-start text-red-800/80 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                        Dashboards provided "What" but left the "How" to the user.
                                    </li>
                                    <li className="flex gap-2 items-start text-red-800/80 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                        Blank Page Syndrome halted action.
                                    </li>
                                </ul>
                            </Card>
                            <Card className="bg-indigo-50/50 border-indigo-100 p-6">
                                <h3 className="font-bold text-lg text-indigo-900 mb-4">Business Goals (KPIs)</h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-2 items-start text-indigo-800/80 text-sm">
                                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                        <strong>Reduce Energy Depletion:</strong> Minimize mental steps.
                                    </li>
                                    <li className="flex gap-2 items-start text-indigo-800/80 text-sm">
                                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                        <strong>Increase Actionability:</strong> Alerts Viewed vs Plans Created.
                                    </li>
                                    <li className="flex gap-2 items-start text-indigo-800/80 text-sm">
                                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                        <strong>Scalability:</strong> Logic across diverse units.
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </motion.section>

                    {/* Discovery & Research */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="text-3xl font-bold mb-6">Discovery & Research Insights</h2>
                        <div className="bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm">
                            <h4 className="font-bold text-neutral-900 mb-2">Methodology: Energy-Mapping Sessions</h4>
                            <p className="text-content-secondary mb-6">
                                I conducted sessions with executives to identify exactly where in their workflow "Decision Fatigue" was peaking.
                            </p>

                            <div className="p-6 bg-neutral-900 rounded-2xl text-white">
                                <h4 className="font-bold text-indigo-400 mb-2 text-sm uppercase tracking-wider">Key Insight</h4>
                                <p className="text-lg font-medium leading-relaxed">
                                    "The primary friction wasn't understanding the data—it was the <strong>Blank Page Syndrome</strong> that followed. Leaders knew a 50% drop in sentiment was bad, but they didn't have the energy to draft a recovery plan from scratch."
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Design Process: OOUX */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="text-3xl font-bold mb-6">Design Process: OOUX Architecture</h2>
                        <p className="text-lg text-content-secondary mb-8">
                            To solve for energy depletion, I mapped the "Energy Flow." I defined "Sentiment" not as a number, but as a <strong>Trigger Object</strong> directly linked to an <strong>Action Object</strong>.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 border border-neutral-200 rounded-2xl text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6 text-red-600" />
                                </div>
                                <h4 className="font-bold text-neutral-900">1. Trigger Object</h4>
                                <p className="text-sm text-neutral-500 mt-2">Sentiment (The Signal)</p>
                            </div>
                            <div className="p-6 border border-neutral-200 rounded-2xl text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MousePointerClick className="w-6 h-6 text-green-600" />
                                </div>
                                <h4 className="font-bold text-neutral-900">2. Action Object</h4>
                                <p className="text-sm text-neutral-500 mt-2">The Instructional Plan</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Final Solution: AI Translation Layer */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <Badge variant="secondary" className="mb-4">Final Solution</Badge>
                            <h2 className="text-3xl font-bold mb-4">The Bento-Task Hybrid</h2>
                            <p className="text-lg text-content-secondary leading-relaxed">
                                When the AI detects a critical drop, the data card transforms into a <strong>Task Card</strong>.
                            </p>
                        </div>

                        {/* Interactive Link (The Demo) */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-12 bg-indigo-600 rounded-[3rem] text-center text-white cursor-pointer shadow-xl shadow-indigo-200 relative overflow-hidden group"
                            onClick={() => navigate('/dashboard/culture')}
                        >
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-4">Launch 'Zero-Energy' Workflow</h2>
                                <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                                    See how the system detects a sentiment drop and automatically drafts a three-step intervention plan for validation.
                                </p>
                                <Button variant="solid" className="bg-white text-indigo-600 hover:bg-neutral-50 px-8 py-4 h-auto text-lg rounded-full">
                                    Open Action Engine
                                </Button>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                        </motion.div>

                        <div className="grid gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                                <h3 className="text-xl font-bold text-neutral-900 mb-4">The Three Levels</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start">
                                        <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0"><Search className="w-5 h-5" /></div>
                                        <div>
                                            <strong className="block text-neutral-900">Level 1: The Alert</strong>
                                            <p className="text-neutral-600 text-sm">Visualized data anomaly.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><Brain className="w-5 h-5" /></div>
                                        <div>
                                            <strong className="block text-neutral-900">Level 2: The Context</strong>
                                            <p className="text-neutral-600 text-sm">AI-generated summary of <em>why</em>.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0"><ShieldCheck className="w-5 h-5" /></div>
                                        <div>
                                            <strong className="block text-neutral-900">Level 3: The Resolution</strong>
                                            <p className="text-neutral-600 text-sm">Pre-filled checklist for the leader.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.section>

                    {/* Results & Reflection */}
                    <div className="bg-neutral-900 text-white p-8 rounded-[2rem] relative overflow-hidden">
                        <DesignerNoteChip avatarSrc="/assets/images/profile.png" label="Lead UX & System Architect" className="mb-6 bg-white/10 text-white border-white/20" />

                        <div className="grid md:grid-cols-3 gap-6 mb-8 border-b border-white/10 pb-8">
                            <div>
                                <div className="text-3xl font-bold text-indigo-400 mb-1">40%</div>
                                <div className="text-sm text-neutral-400">Increase in Proactive Interventions</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-indigo-400 mb-1">70%</div>
                                <div className="text-sm text-neutral-400">Reduction in Analysis Time</div>
                            </div>
                        </div>

                        <p className="text-xl font-medium leading-relaxed mb-4 text-white/90">
                            "In 2026, great design is a <strong>Cognitive Subsidy.</strong> My value was in recognizing that a leader’s most precious resource isn't their time—it's their <strong>energy</strong>. By building an 'Action Engine,' I protected that energy."
                        </p>
                    </div>

                </div>
            </article>
        </PasswordGate>
    );
}

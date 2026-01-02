import { ArrowLeft, Sparkles, Brain, Zap, UserCircle2, Timer, BellRing, MousePointerClick, ShieldCheck, Search, LayoutGrid } from 'lucide-react';
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

export function Enculture() {
    const navigate = useNavigate();

    return (
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
                        <div className="max-w-2xl">
                            <div className="flex gap-2 mb-4">
                                <Badge variant="warning">Enterprise Agentic UX</Badge>
                                <Badge variant="secondary">SaaS</Badge>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-content-primary mb-6 leading-tight tracking-tight">
                                Closing the Loop
                            </h1>
                            <p className="text-xl text-content-secondary leading-relaxed">
                                Transforming a passive analytics dashboard into a proactive <span className="text-indigo-600 font-semibold">Agentic Design</span> system that tells users <em>what to do</em>, not just what happened.
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Time to Action</h4>
                                <p className="text-indigo-600 font-bold">-90% Reduced</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">My Role</h4>
                                <p className="text-content-secondary">Lead AX Strategy</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Tech Stack</h4>
                                <p className="text-content-secondary">Groq (Llama 3), React</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Context</h4>
                                <p className="text-content-secondary">Project OMNI</p>
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
                            alt="Enculture Agentic Dashboard UI"
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* Content Container */}
            <div className="container mx-auto px-6 max-w-3xl mt-20 space-y-24">

                {/* The Problem */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="space-y-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold mb-6">The Insight Gap</h2>
                        <p className="text-lg text-content-secondary leading-relaxed">
                            Users were drowning in dashboards. They saw a red score but had to manually dig through thousands of rows to find the root cause. This "Analysis Paralysis" meant that insights rarely turned into action.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-red-50/50 border-red-100 p-6">
                            <h3 className="font-bold text-lg text-red-900 mb-4">Pain Points</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-2 items-start text-red-800/80 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                    Passive Consumption: Users had to log in to find problems.
                                </li>
                                <li className="flex gap-2 items-start text-red-800/80 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                    Cognitive Load: Translating scores to actions required expertise.
                                </li>
                            </ul>
                        </Card>
                        <Card className="bg-indigo-50/50 border-indigo-100 p-6">
                            <h3 className="font-bold text-lg text-indigo-900 mb-4">The AX Opportunity</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-2 items-start text-indigo-800/80 text-sm">
                                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                    <strong>Ambient Intelligence:</strong> Configure "Smoke Alarms" (triggers) instead of thermometers.
                                </li>
                                <li className="flex gap-2 items-start text-indigo-800/80 text-sm">
                                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                    <strong>Generative UI:</strong> Render executable actions, not just text.
                                </li>
                            </ul>
                        </Card>
                    </div>
                </motion.section>

                {/* --- INSERTED SECTION 1: The User (Single Persona) --- */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2 className="text-3xl font-bold mb-8">The User: Alex, Organizational Admin</h2>
                    <div className="relative overflow-hidden rounded-3xl bg-white border border-neutral-100 p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Profile */}
                            <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
                                    <UserCircle2 className="w-12 h-12" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="font-bold text-xl text-neutral-900">Alex</h3>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Scale Monitor</p>
                                </div>
                            </div>

                            {/* Context */}
                            <div className="space-y-6 flex-grow">
                                <div>
                                    <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                        <LayoutGrid className="w-4 h-4 text-neutral-400" /> The Problem
                                    </h4>
                                    <p className="text-content-secondary leading-relaxed">
                                        Alex oversees culture for <strong>50+ departments</strong>.
                                        "I have 50 dashboards to check. I can't manually find the one team that is burning out until it's too late."
                                    </p>
                                </div>
                                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-indigo-500" /> The Solution
                                    </h4>
                                    <p className="text-indigo-800/80">
                                        The Agent acts as a <strong>"24/7 Monitor,"</strong> scanning every department and only alerting Alex when a specific threshold is breached.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* --- INSERTED SECTION 2: Workflow Shift (Scale) --- */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">From Manual Audits to Instant Action</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent transform -translate-x-1/2" />

                        {/* Passive Workflow */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-neutral-400 mb-2">
                                <Timer className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">The Old Way (Impossible at Scale)</h3>
                            </div>
                            <div className="space-y-0">
                                {[
                                    { step: 1, text: "Login to Platform" },
                                    { step: 2, text: "Open 50 different Department reports" },
                                    { step: 3, text: 'Compare spreadsheets manually' },
                                    { step: 4, text: "Identify risk patterns" },
                                    { step: 5, text: "Email Dept Head" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 border-l-2 border-neutral-100 hover:bg-neutral-50 transition-colors">
                                        <div className="text-xs font-bold text-neutral-300 w-4 pt-1">{item.step}</div>
                                        <div className="text-neutral-600 text-sm">{item.text}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold text-center">
                                Time: Days (High Friction)
                            </div>
                        </div>

                        {/* Agentic Workflow */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="font-bold uppercase tracking-wider text-sm">The Agentic Way (Instant)</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-white shadow-sm border border-indigo-100 rounded-xl flex gap-3 items-center">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Search className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium">System monitors all 50 Depts</span>
                                </div>
                                <div className="p-4 bg-white shadow-sm border border-indigo-100 rounded-xl flex gap-3 items-center">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><BellRing className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium">Alerts Alex to "Engineering Risk"</span>
                                </div>
                                <div className="p-4 bg-white shadow-md border-l-4 border-l-indigo-500 border border-indigo-50 rounded-xl flex gap-3 items-center">
                                    <div className="p-2 bg-indigo-600 text-white rounded-lg"><MousePointerClick className="w-4 h-4" /></div>
                                    <span className="text-sm font-bold text-indigo-900">Alex clicks "Approve Plan"</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-green-50 text-green-700 text-center flex items-center justify-center gap-2 font-bold shadow-sm">
                                <Zap className="w-4 h-4 fill-current" /> Time: 2 Minutes (Zero Friction)
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* --- INSERTED SECTION 3: The Intelligence Layer --- */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2 className="text-3xl font-bold mb-8">The Intelligence Layer</h2>

                    {/* Diagram */}
                    <div className="p-8 md:p-12 bg-neutral-900 rounded-[3rem] text-white">
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative">
                            {/* Connectors (Desktop Only) */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-neutral-800 -z-0 transform -translate-y-1/2" />
                            {/* Connectors (Mobile Vertical Line) */}
                            <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-800 -z-0 transform -translate-x-1/2" />

                            {/* Step 1 */}
                            <div className="relative z-10 flex flex-col items-center text-center gap-4 w-full md:w-1/4 bg-neutral-900 py-4">
                                <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-lg">
                                    <Search className="w-6 h-6 text-neutral-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">1. The Sensor</h4>
                                    <p className="text-xs text-neutral-400">Tracks "Engagement Metric"</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative z-10 flex flex-col items-center text-center gap-4 w-full md:w-1/4 bg-neutral-900 py-4">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/50 flex items-center justify-center shadow-lg shadow-red-900/20">
                                    <Zap className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-400 text-sm mb-1">2. The Trigger</h4>
                                    <p className="text-xs text-neutral-400">Any Dept &lt; 50 Activates</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative z-10 flex flex-col items-center text-center gap-4 w-full md:w-1/4 bg-neutral-900 py-4">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/50 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-300 text-sm mb-1">3. Privacy Firewall</h4>
                                    <p className="text-xs text-neutral-400">Strictly Aggregated Data</p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative z-10 flex flex-col items-center text-center gap-4 w-full md:w-1/4 bg-neutral-900 py-4">
                                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/50 flex items-center justify-center shadow-lg shadow-green-900/20">
                                    <MousePointerClick className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-400 text-sm mb-1">4. The Action</h4>
                                    <p className="text-xs text-neutral-400">Generates Governance Plan</p>
                                </div>
                            </div>
                        </div>

                        {/* v4.0 Callout */}
                        <div className="mt-12 pt-8 border-t border-neutral-800 text-center">
                            <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
                                <strong className="text-white">Conversational Refinement:</strong> The system uses "Intent Mapping" to convert text inputs into variable updates (e.g., "no time" → Low Effort), ensuring the user always stays in the execution workflow.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* The Solution (Existing) */}
                <section className="py-12">
                    <div className="space-y-12">
                        <div>
                            <Badge variant="secondary" className="mb-4">The Solution</Badge>
                            <h2 className="text-3xl font-bold mb-4">The Intervention Assistant</h2>
                            <p className="text-lg text-content-secondary leading-relaxed">
                                I designed an AX layer that sits on top of the architecture. It monitors aggregated metrics in the background and only intervenes when specific Department-Level thresholds are breached.
                            </p>
                        </div>

                        <div className="grid gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex gap-6 items-start">
                                <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">1. System-Initiated Trigger</h3>
                                    <p className="text-neutral-600 leading-relaxed mb-4">
                                        Instead of waiting for the user, the system pushes a Global Alert ("The Red Banner") when critical thresholds are crossed.
                                    </p>
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl inline-flex items-center gap-3 text-sm text-red-800 font-medium">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        Alert: Design Team Sentiment &lt; 50%
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex gap-6 items-start">
                                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl shrink-0">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">2. Generative UI (Start to Finish)</h3>
                                    <p className="text-neutral-600 leading-relaxed mb-4">
                                        We moved beyond chatbots. The Agent generates a <strong>Kanban Board of Actions</strong>. I used Structured Outputs (Zod Schema) to force the LLM to return executable UI components (Cards/Buttons) instead of chat text.
                                    </p>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="bg-white">Tool Calling</Badge>
                                        <Badge variant="outline" className="bg-white">Llama 3</Badge>
                                        <Badge variant="outline" className="bg-white">Vercel SDK</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Designer Note */}
                <div className="bg-neutral-900 text-white p-8 rounded-[2rem] relative overflow-hidden">
                    <DesignerNoteChip avatarSrc="/assets/images/profile.png" label="AX Strategy" className="mb-6 bg-white/10 text-white border-white/20" />
                    <p className="text-xl font-medium leading-relaxed mb-4 text-white/90">
                        "The hardest part wasn't the AI—it was the Privacy. We had to ensure the Agent only 'saw' aggregated department-level data to prevent reliable hallucinations about individual employees. Privacy is a design constraint, not just compliance."
                    </p>
                </div>

                {/* Interactive Link Again */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-12 bg-indigo-600 rounded-[3rem] text-center text-white cursor-pointer shadow-xl shadow-indigo-200"
                    onClick={() => navigate('/dashboard/culture')}
                >
                    <h2 className="text-3xl font-bold mb-4">See the Agent in Action</h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                        Trigger the alert yourself by manipulating the data tables in our live prototype.
                    </p>
                    <Button variant="solid" className="bg-white text-indigo-600 hover:bg-neutral-50 px-8 py-4 h-auto text-lg rounded-full">
                        Launch Dashboard
                    </Button>
                </motion.div>

            </div>
        </article>
    );
}

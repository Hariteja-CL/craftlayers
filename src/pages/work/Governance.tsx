import { ArrowLeft, LayoutTemplate, Activity, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { DesignerNoteChip } from '../../components/ui/DesignerNoteChip';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Governance() {
    return (
        <article className="pb-20">
            {/* Case Study Hero */}
            <section className="bg-surface-subtle border-b border-border-muted pt-12 pb-20 relative overflow-hidden">
                {/* Background Atmosphere */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000 opacity-50 pointer-events-none" />

                <div className="container mx-auto px-6 max-w-container relative z-10">
                    <Link to="/work/design" className="inline-flex items-center text-sm font-medium text-content-secondary hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Design Layers
                    </Link>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="flex flex-col md:flex-row gap-8 items-start justify-between mb-12"
                    >
                        <div className="max-w-2xl">
                            <div className="flex gap-2 mb-4">
                                <Badge variant="warning">Design Systems</Badge>
                                <Badge variant="secondary">AI Governance</Badge>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-content-primary mb-6 leading-tight tracking-tight">
                                Architectural Governance
                            </h1>
                            <p className="text-xl text-content-secondary leading-relaxed">
                                Managing <span className="text-indigo-600 font-semibold">"Vibe Coding" Debt</span> and Reducing Global UI Refactoring Costs by 65%.
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Refactoring</h4>
                                <p className="text-indigo-600 font-bold">-65% Costs</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">My Role</h4>
                                <p className="text-content-secondary">System Architect</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Tech Stack</h4>
                                <p className="text-content-secondary">Figma, Style Dictionary</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Compliance</h4>
                                <p className="text-content-secondary">100% Brand Align</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="rounded-[2rem] overflow-hidden border border-indigo-100 shadow-xl bg-slate-900 relative aspect-[21/9] flex items-center justify-center p-8"
                    >
                        {/* Abstract System Vis using CSS/SVG since we don't have an image yet */}
                        <div className="flex gap-8 items-center text-slate-300">
                            <div className="p-8 border border-slate-700 rounded-2xl bg-slate-800/50 flex flex-col items-center gap-4">
                                <span className="font-mono text-xs text-slate-500">LAYER 1</span>
                                <strong className="text-blue-400">Foundation</strong>
                                <div className="flex gap-2"><div className="w-4 h-4 bg-blue-500 rounded sm"></div><div className="w-4 h-4 bg-slate-500 rounded sm"></div></div>
                            </div>
                            <div className="h-px w-12 bg-slate-700"></div>
                            <div className="p-8 border border-slate-700 rounded-2xl bg-slate-800/50 flex flex-col items-center gap-4">
                                <span className="font-mono text-xs text-slate-500">LAYER 2</span>
                                <strong className="text-purple-400">Semantics</strong>
                                <div className="px-3 py-1 bg-purple-900/30 text-purple-200 text-xs rounded border border-purple-800">action.primary</div>
                            </div>
                            <div className="h-px w-12 bg-slate-700"></div>
                            <div className="p-8 border border-slate-700 rounded-2xl bg-slate-800/50 flex flex-col items-center gap-4">
                                <span className="font-mono text-xs text-slate-500">LAYER 3</span>
                                <strong className="text-green-400">Component</strong>
                                <div className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg shadow-lg">Button</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Container */}
            <div className="container mx-auto px-6 max-w-3xl mt-20 space-y-24">

                {/* Strategic Overview */}
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
                            In the 2026 market shift toward <strong>"Vibe Coding"</strong>, stakeholders were excited about AI speed. However, this created massive <strong>Sub-system Fragmentation</strong>. Because the AI lacked a centralized "memory" of our brand logic, it began generating "Shadow CSS" and non-standard components.
                        </p>
                    </div>

                    {/* Vibe Coding Comparison Image */}
                    <div className="rounded-[2rem] overflow-hidden border border-neutral-800 shadow-2xl">
                        <img
                            src="/assets/images/governance_comparison.png"
                            alt="Unregulated AI Output vs Token-Governed Output"
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-red-50/50 border-red-100 p-6">
                            <h3 className="font-bold text-lg text-red-900 mb-4">The Problem</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-2 items-start text-red-800/80 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                    Unregulated AI Output.
                                </li>
                                <li className="flex gap-2 items-start text-red-800/80 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                    Shadow CSS & Inconsistent UI.
                                </li>
                            </ul>
                        </Card>
                        <Card className="bg-indigo-50/50 border-indigo-100 p-6">
                            <h3 className="font-bold text-lg text-indigo-900 mb-4">Discovery: Technical Debt Audit</h3>
                            <p className="text-indigo-800/80 text-sm">
                                Developers weren't breaking the design on purpose; the system was simply not <strong>"machine-ready."</strong> The AI couldn't choose between Blue-500 and Primary-Action without a logic layer.
                            </p>
                        </Card>
                    </div>
                </motion.section>

                {/* The Decision: Compiler Mindset */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2 className="text-3xl font-bold mb-8">The "Compiler" Mindset</h2>
                    <p className="text-lg text-content-secondary leading-relaxed mb-12">
                        I re-architected the Design System into three strict layers of access. I moved our library into a <strong>Machine-Readable JSON Schema</strong> so the AI would be physically constrained by our design tokens.
                    </p>

                    {/* Architecture Diagram Image */}
                    <div className="rounded-[2rem] overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
                        <img
                            src="/assets/images/governance_architecture.png"
                            alt="3-Tier Architecture Stack: Vault, API, Contract"
                            className="w-full h-auto"
                        />
                    </div>
                </motion.section>

                {/* Final Solution: Automated Compliance */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="space-y-8"
                >
                    <div className="space-y-6">
                        <Badge variant="secondary" className="mb-4">Final Solution</Badge>
                        <h2 className="text-3xl font-bold mb-4">Automated Compliance</h2>
                        <p className="text-lg text-content-secondary leading-relaxed">
                            Instead of manual reviews, I defined the logic for Automated Governance.
                        </p>
                    </div>

                    {/* Bento Grid Linter Image */}
                    <div className="rounded-[2rem] overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900 mb-8">
                        <img
                            src="/assets/images/governance_linter.png"
                            alt="Bento Grid Modularity & Linter Logic"
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="grid gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex gap-6 items-start">
                            <div className="p-4 bg-green-100 text-green-600 rounded-2xl shrink-0">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">Semantic Token Enforcement</h3>
                                <p className="text-neutral-600 leading-relaxed mb-4">
                                    The AI is constrained to our semantic vocabulary.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex gap-6 items-start">
                            <div className="p-4 bg-sky-100 text-sky-600 rounded-2xl shrink-0">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">Design Linting</h3>
                                <p className="text-neutral-600 leading-relaxed mb-4">
                                    A custom linter scans code and rejects any unauthorized hex codes.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex gap-6 items-start">
                            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl shrink-0">
                                <LayoutTemplate className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">Bento Grid Modularity</h3>
                                <p className="text-neutral-600 leading-relaxed mb-4">
                                    AI output is restricted to predefined "containers."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Results & Reflection */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-neutral-900 text-white p-8 rounded-[2rem] relative overflow-hidden"
                >
                    <DesignerNoteChip avatarSrc="/assets/images/profile.png" label="System Architect" className="mb-6 bg-white/10 text-white border-white/20" />
                    <div className="grid md:grid-cols-2 gap-6 mb-8 border-b border-white/10 pb-8">
                        <div>
                            <div className="text-3xl font-bold text-indigo-400 mb-1">65%</div>
                            <div className="text-sm text-neutral-400">Reduction in Refactoring Costs</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-400 mb-1">100%</div>
                            <div className="text-sm text-neutral-400">Brand Compliance</div>
                        </div>
                    </div>
                </motion.section>



            </div>
        </article>
    );
}

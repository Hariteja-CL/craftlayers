import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ArrowRight, Sparkles, Bot } from 'lucide-react';

export function AILayers() {
    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-6 max-w-container">

                {/* Header */}
                <div className="mb-16 max-w-2xl">
                    <Badge variant="warning" className="mb-4">AI & Agentic Design</Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-content-primary mb-6 leading-tight">
                        Designing <span className="text-orange-500">Intelligent</span> Interfaces.
                    </h1>
                    <p className="text-xl text-content-secondary leading-relaxed">
                        Moving beyond static screens to adaptive, generative, and proactive experiences.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <Link to="/work/enculture" className="group md:col-span-2">
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-neutral-800 p-6 md:p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-900/20 group-hover:-translate-y-1">
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen opacity-40 group-hover:opacity-60 transition-opacity" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start">
                                <div className="max-w-xl">
                                    <div className="flex gap-2 mb-6">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500 text-white border border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                            Featured Case Study
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10">
                                            Enterprise SaaS
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                        Enculture: From Passive Dashboards to <br />
                                        <span className="text-indigo-400">Agentic Action</span>
                                    </h2>
                                    <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                                        How we used Generative UI and Proactive Alerts to reduce "Insight to Action" time by 90% for HR Directors.
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-white font-medium group-hover:translate-x-1 transition-transform">
                                        Read Case Study <ArrowRight className="w-5 h-5 ml-1" />
                                    </div>
                                </div>

                                {/* Visual Graphic Representation */}
                                <div className="relative w-full md:w-80 h-64 bg-neutral-800/50 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />

                                    {/* Abstract Interface Elements */}
                                    <div className="space-y-3 w-48 relative z-10">
                                        {/* Alert Banner */}
                                        <div className="h-10 w-full bg-red-500/20 border border-red-500/30 rounded-lg flex items-center px-3 gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <div className="h-2 w-20 bg-red-500/40 rounded-full" />
                                        </div>
                                        {/* Chat Bubble */}
                                        <div className="h-16 w-full bg-neutral-700/50 rounded-xl rounded-tl-sm p-3 space-y-2">
                                            <div className="h-2 w-32 bg-white/20 rounded-full" />
                                            <div className="h-2 w-24 bg-white/10 rounded-full" />
                                        </div>
                                        {/* Action Card */}
                                        <div className="h-20 w-full bg-indigo-600 rounded-xl shadow-lg shadow-indigo-900/50 p-3 flex flex-col justify-between transform translate-x-4 translate-y-2">
                                            <div className="h-2 w-16 bg-white/40 rounded-full" />
                                            <div className="self-end px-3 py-1 bg-white/20 rounded-full text-[10px] text-white font-medium">Execute</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Other Concepts */}
                    <Link to="#" className="group">
                        <Card className="h-full bg-white hover:border-orange-200 transition-colors p-8 rounded-[2rem]">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">Generative UI Systems</h3>
                            <div className="mb-4">
                                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                            </div>
                            <p className="text-content-secondary leading-relaxed mb-6">
                                Exploring how LLMs can stream tailored UI components instead of just text responses.
                            </p>
                            <div className="flex items-center text-sm font-medium text-neutral-400 cursor-not-allowed">
                                Explore Concept <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                            </div>
                        </Card>
                    </Link>

                    <Link to="#" className="group">
                        <Card className="h-full bg-white hover:border-purple-200 transition-colors p-8 rounded-[2rem]">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-3">Voice-First Interfaces</h3>
                            <div className="mb-4">
                                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                            </div>
                            <p className="text-content-secondary leading-relaxed mb-6">
                                Prototyping ambient computing experiences that don't rely on screens.
                            </p>
                            <div className="flex items-center text-sm font-medium text-neutral-400 cursor-not-allowed">
                                Explore Concept <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                            </div>
                        </Card>
                    </Link>

                </div>
            </div>
        </div>
    );
}

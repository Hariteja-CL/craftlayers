import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../ui/Button';
import profileHero from '../../assets/images/profile.png'; // Assuming same path as ProfileSection
import { Brain, ShieldCheck, MousePointerClick, CheckCircle2 } from 'lucide-react';

type LayerType = 'UX' | 'AI' | 'Security';

interface Insight {
    category: LayerType;
    title: string;
    points: {
        heading: string;
        body: string;
    }[];
}

const INSIGHTS: Insight[] = [
    {
        category: 'UX',
        title: 'The Agentic Experience',
        points: [
            { heading: "System-Initiated Triggers", body: "The dashboard shifts users from passive viewing to active resolution via automatic 'Red Alert Banners'." },
            { heading: "Generative UI (GenUI)", body: "Instead of chat, the AI renders Interactive Action Cards (React components) for one-click governance." },
            { heading: "Contextual Scenario Selectors", body: "Changing the 'Mission Brief' instantly recalibrates data visualization and AI context." },
            { heading: "Role-Based Adaptation", body: "The UI adapts layout and actions based on user role (e.g., Org Admin vs. Manager)." },
            { heading: "Conversational Refinement", body: "Natural language instructions force a re-render of UI cards without breaking visual flow." }
        ]
    },
    {
        category: 'AI',
        title: 'The Action Engine',
        points: [
            { heading: "Prescriptive over Descriptive", body: "Moving beyond 'What happened?' to 'What should we do?' with ranked interventions." },
            { heading: "RAG Context", body: "Live, aggregated table data is injected into the System Prompt, preventing hallucinations." },
            { heading: "Strict 'Rule Book' Persona", body: "Forbids anthropomorphism ('I think') and enforces an objective, operational tone." },
            { heading: "Logic Rule Elements", body: "Composable logic defines exactly when AI triggers (e.g., Score < 50) for efficiency." }
        ]
    },
    {
        category: 'Security',
        title: 'Security & Governance',
        points: [
            { heading: "Privacy Firewall", body: "Data is aggregated to Department level. No row-level PII is ever passed to the LLM." },
            { heading: "Anonymity Thresholds", body: "Minimum Response Rule (n < 5) suppresses data to protect individual identity." },
            { heading: "Multi-Tenant Isolation", body: "Queries and AI contexts are strictly scoped by TenantID to prevent data leaks." },
            { heading: "Bias Mitigation", body: "System Prompt includes rules against demographic assumptions or inequitable interventions." },
            { heading: "RBAC Data Access", body: "Only users with specific permission bits can trigger the AI analysis." }
        ]
    }
];

export function LayerInsightTabs() {
    const [activeTab, setActiveTab] = useState<LayerType>('UX');

    const activeInsight = INSIGHTS.find(i => i.category === activeTab)!;

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
            {/* Header / Tabs */}
            <div className="border-b border-neutral-100 bg-neutral-50/50 p-2 flex items-center justify-center gap-2">
                {(['UX', 'AI', 'Security'] as LayerType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            activeTab === tab
                                ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200"
                                : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/50"
                        )}
                    >
                        {tab === 'UX' && <MousePointerClick className="w-4 h-4" />}
                        {tab === 'AI' && <Brain className="w-4 h-4" />}
                        {tab === 'Security' && <ShieldCheck className="w-4 h-4" />}
                        {tab} Layer
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Column */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden relative ring-2 ring-indigo-100">
                            <img src={profileHero} alt="Hariteja" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Hariteja</h4>
                            <p className="text-[10px] text-neutral-500 font-medium">Architect Note</p>
                        </div>
                    </div>

                    {/* Speech Bubble / Content */}
                    <div className="flex-1 relative">
                        {/* Speech Bubble Triangle */}
                        <div className="hidden md:block absolute top-6 -left-3 w-4 h-4 bg-indigo-50 border-l border-b border-indigo-100 transform rotate-45" />

                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 md:p-8"
                            >
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2">{activeInsight.title}</h3>
                                    <p className="text-indigo-700/80 text-sm">Key architectural decisions driving this layer.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeInsight.points.map((point, idx) => (
                                        <div key={idx} className="flex gap-3 items-start group">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5 group-hover:text-indigo-600 transition-colors" />
                                            <div>
                                                <h4 className="font-bold text-neutral-900 text-sm mb-1">{point.heading}</h4>
                                                <p className="text-sm text-neutral-600 leading-relaxed">
                                                    {point.body}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

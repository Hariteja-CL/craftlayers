import { useState } from 'react';
import { DataView } from './DataView';
import { VisualView } from './VisualView';
import { AlertSystem } from './AlertSystem';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { LayerInsightTabs } from './LayerInsightTabs';
import profileHero from '../../assets/images/profile.png';

export interface DepartmentMetric {
    id: string;
    department: string;
    headcount: number;
    sentiment: number;
    topThemes: string[];
}

const INITIAL_DATA: DepartmentMetric[] = [
    { id: '1', department: 'Engineering', headcount: 24, sentiment: 62, topThemes: ['Legacy Code', 'Siloed Teams', 'Knowledge Gap'] }, // Merger Context
    { id: '2', department: 'Design', headcount: 12, sentiment: 42, topThemes: ['Burnout', 'Feedback Loops', 'Overtime'] }, // Burnout Context (Critical)
    { id: '3', department: 'Product Management', headcount: 8, sentiment: 78, topThemes: ['Strategy Clarity', 'Alignment'] },
    { id: '4', department: 'Sales & Marketing', headcount: 18, sentiment: 55, topThemes: ['Budget Cuts', 'Travel Freeze', 'Morale'] }, // Budget Context
    { id: '5', department: 'Customer Support', headcount: 15, sentiment: 88, topThemes: ['Autonomy', 'Mastery'] },
];

export function CultureDashboard() {
    const [data, setData] = useState<DepartmentMetric[]>(INITIAL_DATA);

    const averageSentiment = data.reduce((acc, curr) => acc + curr.sentiment, 0) / data.length;
    const totalHeadcount = data.reduce((acc, curr) => acc + curr.headcount, 0);

    const handleUpdate = (id: string, field: keyof DepartmentMetric, value: any) => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50/50 p-8 space-y-8 relative">
            <HotspotOverlay />
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Proactive Culture Dashboard</h1>
                    <p className="text-neutral-500 mt-2">Monitor implementation of AI ethics and employee well-being in real-time.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/work/enculture'}
                    className="bg-white"
                >
                    Back to Case Study
                </Button>
            </header>

            <AlertSystem averageSentiment={averageSentiment} data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DataView data={data} onUpdate={handleUpdate} />
                <VisualView averageSentiment={averageSentiment} totalHeadcount={totalHeadcount} />
            </div>

            <LayerInsightTabs />
        </div>
    );
}

// Hotspots Data
const hotspots = [
    {
        id: 1,
        title: "Dynamic Signal Detection",
        body: "The system monitors data streams in real-time. A drop in sentiment (e.g., to 42/100) autonomously triggers the 'Burnout Protocol'.",
        top: "48%", // Moved down to Row 2
        left: "19%", // Moved left to Sentiment Col
        align: 'left'
    },
    {
        id: 2,
        title: "Contextual Analysis",
        body: "The AI correlate scores with themes (like 'Overtime') to diagnose root causes before prescribing solutions.",
        top: "40%",
        left: "45%",
        align: 'center'
    }
];

function HotspotOverlay() {
    const [activeId, setActiveId] = useState<number | null>(null);

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {hotspots.map((spot) => (
                <div
                    key={spot.id}
                    className="absolute pointer-events-auto"
                    style={{ top: spot.top, left: spot.left }}
                    onMouseEnter={() => setActiveId(spot.id)}
                    onMouseLeave={() => setActiveId(null)}
                >
                    {/* Pulse Ring */}
                    <div className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 border-2 border-white group-hover:scale-125 transition-transform duration-300 shadow-lg"></span>
                    </div>

                    {/* Tooltip Card */}
                    <AnimatePresence>
                        {activeId === spot.id && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute mt-4 w-72 z-50 ${spot.align === 'left'
                                    ? 'left-0'
                                    : 'left-1/2 -translate-x-1/2'
                                    }`}
                            >
                                <div className="bg-white/90 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl text-left ring-1 ring-black/5">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                            <img src={profileHero} alt="Hariteja" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mt-1">
                                                {spot.title}
                                            </h3>
                                            <p className="text-[10px] text-neutral-500 font-medium">Architect Note</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-neutral-600 leading-relaxed pl-11 -mt-2">
                                        {spot.body}
                                    </p>
                                </div>

                                {/* Arrow Logic */}
                                <div
                                    className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white/90 absolute -top-2 ${spot.align === 'left'
                                        ? 'left-4' // Arrow near the start for left-aligned
                                        : 'left-1/2 -translate-x-1/2' // Centered
                                        }`}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}

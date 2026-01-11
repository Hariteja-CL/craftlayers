import { useState, useEffect } from 'react';
import { DataView } from './DataView';
import { VisualView } from './VisualView';
import { ActionCard } from './ActionCard';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { LayerInsightTabs } from './LayerInsightTabs';
import profileHero from '../../assets/images/profile.png';
import { PasswordGate } from '../ui/PasswordGate';


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

    const handleUpdate = (id: string, field: keyof DepartmentMetric, value: any) => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const [, setSelectedDept] = useState<string | null>(null);

    return (
        <PasswordGate scope="enculture_dashboard">
            <div className="min-h-screen bg-neutral-50/50 p-8 space-y-8">
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

                {/* Action Card (Conditional) */}
                <ActionCard averageSentiment={averageSentiment} data={data} />

                {/* Dashboard Content - Grid Area with Hotspots */}
                <div className="relative ml-10 lg:ml-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Data Table with Hotspots */}
                        <div className="relative h-full">
                            <HotspotOverlay />
                            <DataView
                                data={data}
                                onUpdate={handleUpdate}
                                onSelectDept={setSelectedDept}
                            />
                        </div>

                        {/* Right: Visual Chart */}
                        <div className="h-full flex flex-col">
                            <VisualView averageSentiment={averageSentiment} />
                        </div>
                    </div>
                </div>

                {/* NEW: Layer Insight Pointers - OUTSIDE relative grid container */}
                <div className="pt-8 ml-10 lg:ml-0">
                    <LayerInsightTabs />
                </div>
            </div>
        </PasswordGate>
    );
}

// Hotspot Overlay Component
function HotspotOverlay() {
    const [activeId, setActiveId] = useState<number | null>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => setActiveId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // We hardcode positions to align with the DataView column headers
    const hotspots = [
        {
            id: 1,
            title: "Dynamic Signal Detection",
            body: "The system monitors raw feedback streams in real-time, detecting sentiment dips below the 'Safety Threshold' (50%).",
            top: "84px", // Aligns with 'Sentiment' header (approx 24px padding + 28px title + 16px margin + 16px header center)
            left: "62%", // Aligns with Sentiment column
            align: 'center'
        },
        {
            id: 2,
            title: "Contextual Analysis",
            body: "Identifying key friction points (e.g., 'Burnout', 'Overtime') without revealing individual employee identities.",
            top: "84px", // Aligns with 'Top Themes' header
            left: "88%", // Aligns with Top Themes column
            align: 'right' // Tooltip shifts left to stay on screen
        }
    ];

    return (
        <div className="absolute inset-0 pointer-events-none z-40 hidden lg:block">
            <AnimatePresence>
                {hotspots.map((spot) => (
                    <motion.div
                        key={spot.id}
                        className="absolute"
                        style={{ top: spot.top, left: spot.left, zIndex: activeId === spot.id ? 50 : 10 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + spot.id * 0.2 }}
                    >
                        <div
                            className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveId(activeId === spot.id ? null : spot.id);
                            }}
                        >
                            {/* Pulsing Dot */}
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 ${activeId === spot.id ? 'hidden' : ''}`}></span>
                            <span className={`relative inline-flex rounded-full h-4 w-4 bg-indigo-600 border-2 border-white shadow-md transition-transform duration-300 ${activeId === spot.id ? 'scale-125' : ''}`}></span>

                            {/* Tooltip */}
                            <AnimatePresence>
                                {activeId === spot.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className={`absolute mt-4 w-72 cursor-default ${spot.align === 'left'
                                            ? 'left-0'
                                            : 'left-1/2 -translate-x-1/2'
                                            }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="bg-white/90 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl text-left ring-1 ring-black/5 relative">


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
                                                ? 'left-4'
                                                : 'left-1/2 -translate-x-1/2'
                                                }`}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

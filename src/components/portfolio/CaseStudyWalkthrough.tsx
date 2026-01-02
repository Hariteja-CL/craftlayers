import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../ui/Button';

interface Hotspot {
    id: number;
    title: string;
    body: string;
    top: string; // % value
    left: string; // % value
}

// Data from user request
const hotspots: Hotspot[] = [
    {
        id: 1,
        title: "Dynamic Signal Detection",
        body: "The system monitors data streams in real-time. A drop in sentiment (e.g., to 42/100) autonomously triggers the 'Burnout Protocol'—no manual input required.",
        top: "25%", // Placeholder - user to adjust
        left: "20%", // Placeholder - Over "42" area approx
    },
    {
        id: 2,
        title: "Contextual Analysis",
        body: "The AI Agent correlates quantitative scores with qualitative tags (like 'Overtime') to diagnose the root cause before prescribing solutions.",
        top: "45%", // Center
        left: "50%",
    },
    {
        id: 3,
        title: "Generative UI Resolution",
        body: "The system executes a 'Tool Call' to render interactive React components, giving managers actionable steps to resolve the specific crisis.",
        top: "75%", // Bottom/Action area
        left: "80%",
    }
];

interface CaseStudyWalkthroughProps {
    imageSrc: string;
    className?: string;
}

export function CaseStudyWalkthrough({ imageSrc, className }: CaseStudyWalkthroughProps) {
    const [activeId, setActiveId] = useState<number | null>(null);

    return (
        <div className={cn("w-full max-w-5xl mx-auto", className)}>

            {/* Desktop/Tablet Interactive View */}
            <div className="hidden md:block relative bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
                {/* Dashboard Image */}
                <img
                    src={imageSrc}
                    alt="Enculture Dashboard AI Walkthrough"
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />

                {/* Dark Overlay for better dot visibility (optional, subtle) */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent pointer-events-none" />

                {/* Hotspots */}
                {hotspots.map((spot) => (
                    <div
                        key={spot.id}
                        className="absolute z-20"
                        style={{ top: spot.top, left: spot.left }}
                        onMouseEnter={() => setActiveId(spot.id)}
                        onMouseLeave={() => setActiveId(null)}
                    >
                        {/* Pulse Ring */}
                        <div className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-white group-hover:scale-125 transition-transform duration-300"></span>
                        </div>

                        {/* Tooltip Card */}
                        <AnimatePresence>
                            {activeId === spot.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-1/2 -translate-x-1/2 mt-4 w-72 z-30 pointer-events-none"
                                >
                                    {/* Glassmorphism Card */}
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                                {spot.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-200 leading-relaxed">
                                            {spot.body}
                                        </p>
                                    </div>
                                    {/* Arrow */}
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white/10 absolute -top-2 left-1/2 -translate-x-1/2 backdrop-blur-md" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Mobile Stacked View */}
            <div className="md:hidden space-y-6">
                <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
                    <img src={imageSrc} alt="Dashboard Preview" className="w-full h-auto" />
                </div>

                <div className="space-y-4">
                    {hotspots.map((spot, index) => (
                        <div key={spot.id} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold border border-orange-200">
                                    {index + 1}
                                </span>
                                <h3 className="text-base font-bold text-neutral-900">
                                    {spot.title}
                                </h3>
                            </div>
                            <p className="text-sm text-neutral-600 leading-relaxed pl-9">
                                {spot.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

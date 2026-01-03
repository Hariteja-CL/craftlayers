import { useState } from 'react';
import { AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import profileHero from '../../assets/images/profile.png';
import { InterventionChat, type Message } from './InterventionChat';
import type { DepartmentMetric } from './CultureDashboard';

interface AlertSystemProps {
    averageSentiment: number;
    data: DepartmentMetric[];
}

export function AlertSystem({ averageSentiment, data }: AlertSystemProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    // Lifted state to persist chat context
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [showHotspot, setShowHotspot] = useState(false);

    // Only show alert if critical
    const visible = averageSentiment < 50;

    return (
        <>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[50] w-[90%] max-w-2xl"
                    >
                        <div className="bg-red-50/90 backdrop-blur-md border border-red-200 rounded-lg p-3 shadow-lg flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-full text-red-600 animate-pulse">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-red-800">Culture metrics are critical</h3>
                                    <p className="text-xs text-red-600 mt-0.5">Average sentiment has dropped below 50%. Immediate action is recommended.</p>
                                </div>
                            </div>

                            {/* Button with Hotspot Beacon */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsSheetOpen(true)}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                    <Sparkles size={16} />
                                    Create Intervention Plan
                                </button>

                                {/* Generative UI Hotspot Beacon */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 z-20">
                                    <div className="absolute z-50">
                                        <div
                                            onClick={(e) => { e.stopPropagation(); setShowHotspot(!showHotspot); }}
                                            className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                        >
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 border-2 border-white transition-transform duration-300 shadow-lg"></span>
                                        </div>

                                        {/* Tooltip Card (Click to show) */}
                                        <AnimatePresence>
                                            {showHotspot && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute top-8 right-0 w-72 z-[60]"
                                                >
                                                    <div className="bg-white/95 backdrop-blur-md border border-neutral-200 p-5 rounded-2xl shadow-xl text-left relative">
                                                        {/* Close Button */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setShowHotspot(false); }}
                                                            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                        </button>

                                                        <div className="flex items-start gap-3 mb-3 pr-6">
                                                            <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                                                <img src={profileHero} alt="Hariteja" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mt-1">
                                                                    Generative UI Resolution
                                                                </h3>
                                                                <p className="text-[10px] text-neutral-500 font-medium">Architect Note</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-neutral-600 leading-relaxed pl-11 -mt-2">
                                                            The AI doesn't just chat; it renders interactive "Action Plan Widgets" directly in the interface, reducing cognitive load.
                                                        </p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white/95 absolute -top-2 right-4" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title="AI Intervention Assistant"
            >


                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-700 font-medium flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    AI Agent connected to Live Data
                </div>
                {/* We pass the data and the persisted history */}
                <InterventionChat
                    currentData={data}
                    messages={chatHistory}
                    setMessages={setChatHistory}
                />
            </Sheet>
        </>
    );
}


import { useState } from 'react';
import { AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
import profileHero from '../../assets/images/profile.png';
import { InterventionChat, type Message } from './InterventionChat';
import type { DepartmentMetric } from './CultureDashboard';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface AlertSystemProps {
    averageSentiment: number;
    data: DepartmentMetric[];
}

export function AlertSystem({ averageSentiment, data }: AlertSystemProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    // Lifted state to persist chat context
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    return (
        <>
            <div className="space-y-6">
                {/* Alert Banner */}
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-red-900 font-semibold">Culture metrics are critical</h3>
                            <p className="text-red-700 text-sm mt-1">Average sentiment has dropped to {averageSentiment.toFixed(1)}%. Immediate action is recommended.</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => setIsSheetOpen(true)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm relative z-10"
                        >
                            <Sparkles className="w-4 h-4" />
                            Create Intervention Plan
                        </button>

                        {/* Hotspot Bubble (Attached to Button) */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 z-20">
                            <div className="absolute z-50">
                                <div className="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 border-2 border-white group-hover:scale-125 transition-transform duration-300 shadow-lg"></span>

                                    {/* Tooltip Card (Show on group hover) */}
                                    <div className="absolute top-8 right-0 w-72 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[60]">
                                        <div className="bg-white/90 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl text-left ring-1 ring-black/5">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                                    <img src={profileHero} alt="Hariteja" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mt-1">
                                                        Generative UI Resolution
                                                    </h3>
                                                    <p className="text-[10px] text-neutral-500 font-medium">Architect Note</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-neutral-600 leading-relaxed font-normal pl-11 -mt-2">
                                                The system executes a 'Tool Call' to render interactive components, giving managers actionable steps.
                                            </p>
                                        </div>
                                        {/* Arrow adjusted to right side roughly over center of typical button */}
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white/90 absolute -top-2 right-8" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                <ErrorBoundary>
                    <InterventionChat
                        currentData={data}
                        messages={chatHistory}
                        setMessages={setChatHistory}
                    />
                </ErrorBoundary>
            </Sheet>
        </>
    );
}


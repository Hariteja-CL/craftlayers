import { useState } from 'react';
import { AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet } from '../ui/Sheet';
import { InterventionChat, type Message } from './InterventionChat';
import type { DepartmentMetric } from './CultureDashboard';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface AlertSystemProps {
    averageSentiment: number;
    data: DepartmentMetric[];
}

export function ActionCard({ averageSentiment, data }: AlertSystemProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    // Lifted state to persist chat context
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    // Only show critical alert if sentiment is low (< 50%)
    if (averageSentiment >= 50 && !isSheetOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-8 right-8 z-50 bg-white border border-red-200 shadow-xl rounded-2xl p-4 flex items-center gap-6 w-auto min-w-[320px]"
            >
                <div className="p-3 bg-red-50 rounded-full text-red-600 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 whitespace-nowrap">
                    <h3 className="text-sm font-bold text-neutral-900">Culture metrics are critical</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        Sentiment dropped to <span className="font-bold text-red-600">{averageSentiment.toFixed(0)}%</span>
                    </p>
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md font-medium text-xs whitespace-nowrap"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Take Action</span>
                    </button>
                    {/* Pulse Effect */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
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
                    <ErrorBoundary>
                        <InterventionChat
                            currentData={data}
                            messages={chatHistory}
                            setMessages={setChatHistory}
                        />
                    </ErrorBoundary>
                </Sheet>
            </motion.div>
        </AnimatePresence>
    );
}


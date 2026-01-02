import { useState } from 'react';
import { AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';
import { Sheet } from '../ui/Sheet';
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

    // Only show alert if critical
    if (averageSentiment >= 50) {
        return null;
    }

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
                            <p className="text-red-700 text-sm mt-1">Average sentiment has dropped below 50%. Immediate action is recommended.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSheetOpen(true)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        Create Intervention Plan
                    </button>
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
                <InterventionChat
                    currentData={data}
                    messages={chatHistory}
                    setMessages={setChatHistory}
                />
            </Sheet>
        </>
    );
}


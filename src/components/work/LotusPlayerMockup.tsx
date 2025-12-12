import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Flower2, BarChart2, Home, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock Data
const SESSIONS = [
    { id: 1, title: "Day 1", sub: "Affirmation, Incantation", time: "10:00", duration: 600 },
    { id: 2, title: "Day 2", sub: "Gratitude & Focus", time: "15:00", duration: 900 },
    { id: 3, title: "Day 3", sub: "Deep Breathing", time: "20:00", duration: 1200 },
];

export function LotusPlayerMockup({ className = "" }: { className?: string }) {
    // Phone State
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'home' | 'activity' | 'settings'>('activity');
    const [currentSessionId, setCurrentSessionId] = useState(1);

    // Derived State
    const currentSession = SESSIONS.find(s => s.id === currentSessionId) || SESSIONS[0];

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className={`w-full max-w-[380px] bg-white h-[800px] rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden flex flex-col relative shrink-0 transition-all duration-500 mx-auto ${className}`}>
            {/* Status Bar */}
            <div className="h-6 bg-white w-full flex justify-between px-6 items-center text-[10px] font-medium text-gray-900 z-10 mt-2 shrink-0">
                <span>9:41</span>
                <div className="flex gap-1">
                    <span>5G</span>
                    <div className="w-4 h-2.5 border border-gray-400 rounded-sm relative">
                        <div className="absolute inset-0.5 bg-gray-900 rounded-[1px] w-3/4"></div>
                    </div>
                </div>
            </div>

            {/* App Content */}
            {activeTab === 'activity' ? (
                <div className="flex-1 flex flex-col px-6 pt-4 pb-8 overflow-y-auto no-scrollbar animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Activity</p>
                            <h2 className="text-xl font-bold text-gray-900">Training Statistics</h2>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-full">
                            <BarChart2 className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>



                    {/* Total Duration Visual */}
                    <div className="text-center mb-8 relative">
                        <div className={`w-64 h-64 mx-auto rounded-full border-4 border-orange-100 flex items-center justify-center relative bg-orange-50 transition-all duration-[2000ms] ${isPlaying ? 'scale-105 shadow-[0_0_40px_rgba(251,146,60,0.3)]' : ''}`}>
                            {/* Abstract Lotus Visual - Rotating when playing */}
                            <div className={`absolute inset-0 flex items-center justify-center opacity-20 transition-transform duration-[10s] ease-linear ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                                <Flower2 className="w-48 h-48 text-orange-400" />
                            </div>
                            <div className="relative z-10 text-center">
                                <span className="text-4xl font-bold text-gray-900 block transition-all">{isPlaying ? '01:05' : '01:00'}</span>
                                <span className="text-xs text-gray-400 uppercase">Hrs Meditated</span>
                            </div>
                        </div>
                        {/* Current Track Info */}
                        <div className="mt-6">
                            <h3 className="font-bold text-lg text-gray-900">{currentSession.title}</h3>
                            <p className="text-gray-400 text-sm">{currentSession.sub}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-8 mb-10">
                        <button className="text-gray-300 hover:text-orange-500 transition-colors active:scale-90 transform"><SkipBack className="w-6 h-6" /></button>
                        <button
                            onClick={togglePlay}
                            className={`w-16 h-16 ${isPlaying ? 'bg-gray-900' : 'bg-orange-500'} text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all`}
                        >
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                        <button className="text-gray-300 hover:text-orange-500 transition-colors active:scale-90 transform"><SkipForward className="w-6 h-6" /></button>
                    </div>

                    {/* Session List */}
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-gray-900 px-1">Session Breakdowns</p>
                        {SESSIONS.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => {
                                    setCurrentSessionId(session.id);
                                    setIsPlaying(true);
                                }}
                                className={`p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all border border-transparent ${currentSessionId === session.id ? 'bg-white border-l-4 border-l-orange-400 shadow-md scale-[1.02]' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <div>
                                    <h4 className={`text-sm font-bold ${currentSessionId === session.id ? 'text-gray-900' : 'text-gray-400'}`}>{session.title}</h4>
                                    <p className="text-xs text-gray-400">{session.sub}</p>
                                </div>
                                <span className="text-xs text-gray-300 font-mono">{session.time} mins</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                    {activeTab === 'home' && <Home className="w-16 h-16 text-gray-200 mb-4" />}
                    {activeTab === 'settings' && <Settings className="w-16 h-16 text-gray-200 mb-4" />}
                    <h3 className="text-xl font-bold text-gray-400 capitalize">{activeTab} View</h3>
                    <p className="text-gray-400 text-sm mt-2">Interactive placeholder for demo purposes.</p>
                    <Button variant="outline" className="mt-6" onClick={() => setActiveTab('activity')}>Return to Player</Button>
                </div>
            )}

            {/* Tab Bar */}
            <div className="h-20 border-t border-gray-100 bg-white flex justify-around items-center px-6 shrink-0 relative z-20">
                <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-300 hover:text-gray-400'}`}>
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button onClick={() => setActiveTab('activity')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'activity' ? 'text-orange-500' : 'text-gray-300 hover:text-gray-400'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Activity</span>
                </button>
                <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-orange-500' : 'text-gray-300 hover:text-gray-400'}`}>
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
}

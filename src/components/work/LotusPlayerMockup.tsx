import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Flower2, BarChart2, Home, LayoutDashboard, Settings, User, Bell, Moon, LogOut, ChevronRight, HelpCircle, CreditCard } from 'lucide-react';

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
        <div className={`w-full md:max-w-[380px] bg-surface-DEFAULT h-full md:h-[800px] md:rounded-[3rem] shadow-none md:shadow-2xl border-0 md:border-[8px] border-black overflow-hidden flex flex-col relative shrink-0 transition-all duration-500 mx-auto ${className}`}>
            {/* Status Bar */}
            <div className="h-6 bg-surface-DEFAULT w-full flex justify-between px-6 items-center text-[10px] font-medium text-neutral-text-high-contrast z-10 mt-2 shrink-0">
                <span>9:41</span>
                <div className="flex gap-1">
                    <span>5G</span>
                    <div className="w-4 h-2.5 border border-neutral-text-medium-contrast rounded-sm relative">
                        <div className="absolute inset-0.5 bg-neutral-text-high-contrast rounded-[1px] w-3/4"></div>
                    </div>
                </div>
            </div>

            {/* App Content */}
            {activeTab === 'activity' ? (
                <div className="flex-1 flex flex-col px-6 pt-6 pb-20 overflow-y-auto no-scrollbar animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-xs text-neutral-text-medium-contrast uppercase tracking-wider font-semibold">Activity</p>
                            <h2 className="text-xl font-bold text-neutral-text-high-contrast">Training Statistics</h2>
                        </div>
                        <div className="p-2 bg-surface-subtle rounded-full">
                            <BarChart2 className="w-5 h-5 text-neutral-text-medium-contrast" />
                        </div>
                    </div>



                    {/* Total Duration Visual */}
                    <div className="text-center mb-8 relative">
                        <div className={`w-64 h-64 mx-auto rounded-full border-4 cl-border-color-brand-primary-surface flex items-center justify-center relative cl-bg-color-brand-primary-background transition-all duration-[2000ms] ${isPlaying ? 'scale-105 shadow-[0_0_40px_rgba(255,107,0,0.3)]' : ''}`}>
                            {/* Abstract Lotus Visual - Rotating when playing */}
                            <div className={`absolute inset-0 flex items-center justify-center opacity-20 transition-transform duration-[10s] ease-linear ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                                <Flower2 className="w-48 h-48 cl-text-color-brand-primary-base" />
                            </div>
                            <div className="relative z-10 text-center">
                                <span className="text-4xl font-bold text-neutral-text-high-contrast block transition-all">{isPlaying ? '01:05' : '01:00'}</span>
                                <span className="text-xs text-neutral-text-medium-contrast uppercase">Hrs Meditated</span>
                            </div>
                        </div>
                        {/* Current Track Info */}
                        <div className="mt-6">
                            <h3 className="font-bold text-lg text-neutral-text-high-contrast">{currentSession.title}</h3>
                            <p className="text-neutral-text-medium-contrast text-sm">{currentSession.sub}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-8 mb-10">
                        <button className="text-neutral-text-medium-contrast hover:cl-text-color-brand-primary-base transition-colors active:scale-90 transform"><SkipBack className="w-6 h-6" /></button>
                        <button
                            onClick={togglePlay}
                            className={`w-16 h-16 ${isPlaying ? 'bg-neutral-text-high-contrast text-neutral-text-inverse' : 'cl-bg-color-brand-primary-base text-white'} rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all`}
                        >
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                        <button className="text-neutral-text-medium-contrast hover:cl-text-color-brand-primary-base transition-colors active:scale-90 transform"><SkipForward className="w-6 h-6" /></button>
                    </div>

                    {/* Session List */}
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-neutral-text-high-contrast px-1">Session Breakdowns</p>
                        {SESSIONS.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => {
                                    setCurrentSessionId(session.id);
                                    setIsPlaying(true);
                                }}
                                className={`p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all border border-transparent ${currentSessionId === session.id ? 'bg-surface-subtle border-l-4 cl-border-color-brand-primary-base shadow-md scale-[1.02]' : 'bg-surface-subtle/50 hover:bg-surface-subtle'}`}
                            >
                                <div>
                                    <h4 className={`text-sm font-bold ${currentSessionId === session.id ? 'text-neutral-text-high-contrast' : 'text-neutral-text-medium-contrast'}`}>{session.title}</h4>
                                    <p className="text-xs text-neutral-text-medium-contrast">{session.sub}</p>
                                </div>
                                <span className="text-xs text-neutral-text-low-contrast font-mono">{session.time} mins</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col pt-6 pb-20 px-6 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200">
                    {activeTab === 'home' && (
                        <div className="space-y-5">
                            {/* Greeting */}
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="text-neutral-900 font-bold text-lg">Good Morning, Hariteja</h4>
                                    <p className="text-neutral-500 text-xs">Here's your wellness summary</p>
                                </div>
                                <div className="w-10 h-10 rounded-full cl-bg-color-brand-primary-base flex items-center justify-center text-white font-bold shadow-lg shadow-orange-200">
                                    H
                                </div>
                            </div>

                            {/* Mood Indicator Card */}
                            <div className="w-full bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm cl-elevation-surface">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-neutral-900 text-sm font-bold">Today's Mood</p>
                                    <div className="px-3 py-1 cl-bg-color-brand-primary-surface rounded-full">
                                        <p className="cl-text-color-brand-primary-base text-[10px] font-bold">Feeling Calm</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="relative w-32 h-32 mb-2">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="64" cy="64" r="56" stroke="#f5f5f5" strokeWidth="10" fill="none" />
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="none"
                                                strokeDasharray={`${2 * Math.PI * 56}`}
                                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - 78 / 100)}`}
                                                strokeLinecap="round"
                                                className="cl-text-color-brand-primary-base"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl mb-1">😊</span>
                                            <p className="text-neutral-900 text-xl font-bold">78</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Meditation Streak */}
                            <div className="w-full bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm cl-elevation-surface">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 cl-bg-color-brand-primary-surface rounded-xl">
                                        <div className="cl-text-color-brand-primary-base font-bold text-lg">🔥</div>
                                    </div>
                                    <div>
                                        <p className="text-neutral-900 text-sm font-bold">Meditation Streak</p>
                                        <p className="text-neutral-500 text-xs">5 days in a row</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-1">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                        <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${i < 5 ? 'cl-bg-color-brand-primary-base text-white shadow-md shadow-orange-200' : 'bg-neutral-100 text-neutral-400'
                                            }`}>
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Journal Sentiment */}
                            <div className="w-full bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm cl-elevation-surface">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-50 rounded-xl">
                                        <div className="text-blue-500 font-bold text-lg">📖</div>
                                    </div>
                                    <p className="text-neutral-900 text-sm font-bold">Journal Sentiment</p>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Positive', val: 67, color: 'bg-green-400' },
                                        { label: 'Neutral', val: 23, color: 'bg-neutral-400' },
                                        { label: 'Negative', val: 10, color: 'bg-red-400' }
                                    ].map((s) => (
                                        <div key={s.label}>
                                            <div className="flex justify-between text-[10px] mb-1 font-medium">
                                                <span className="text-neutral-500">{s.label}</span>
                                                <span className="text-neutral-900">{s.val}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.val}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="cl-bg-color-brand-primary-surface p-5 rounded-3xl border cl-border-color-brand-primary-surface relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">✨</span>
                                        <p className="cl-text-color-brand-primary-base text-xs font-bold uppercase tracking-wide">Recommended</p>
                                    </div>
                                    <p className="text-neutral-900 text-sm font-bold mb-1">Deep Sleep Release</p>
                                    <p className="text-neutral-600 text-xs mb-3 line-clamp-2">Try a 10-minute guided meditation for stress relief before bed.</p>
                                    <button className="w-full py-2.5 cl-bg-color-brand-primary-base text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] transition-transform">
                                        Start Session
                                    </button>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 cl-bg-color-brand-primary-background rounded-full opacity-50 blur-xl" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex-1 flex flex-col pt-6 pb-20 px-6 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-5">
                                {/* Profile Card */}
                                <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm cl-elevation-surface">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full cl-bg-color-brand-primary-base flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg shadow-orange-100">
                                            H
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-900">Hariteja</h3>
                                            <p className="text-neutral-500 text-sm">hari@craftlayers.com</p>
                                            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border border-amber-200">
                                                PRO MEMBER
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account */}
                                <div className="space-y-2">
                                    <p className="px-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">Account</p>
                                    <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm cl-elevation-surface">
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><User className="w-5 h-5" /></div>
                                                <span className="text-sm font-medium text-neutral-700">Personal Info</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-neutral-300" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-50 rounded-xl text-purple-500"><CreditCard className="w-5 h-5" /></div>
                                                <span className="text-sm font-medium text-neutral-700">Subscription</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-neutral-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div className="space-y-2">
                                    <p className="px-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">Preferences</p>
                                    <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm cl-elevation-surface">
                                        <div className="flex items-center justify-between p-4 border-b border-neutral-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-50 rounded-xl text-orange-500"><Bell className="w-5 h-5" /></div>
                                                <span className="text-sm font-medium text-neutral-700">Notifications</span>
                                            </div>
                                            <div className="w-10 h-6 bg-neutral-200 rounded-full relative cursor-pointer hover:bg-neutral-300 transition-colors">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 rounded-xl text-slate-500"><Moon className="w-5 h-5" /></div>
                                                <span className="text-sm font-medium text-neutral-700">Dark Mode</span>
                                            </div>
                                            <div className="w-10 h-6 cl-bg-color-brand-primary-base rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Support */}
                                <div className="space-y-2">
                                    <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm cl-elevation-surface">
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-50 rounded-xl text-green-500"><HelpCircle className="w-5 h-5" /></div>
                                                <span className="text-sm font-medium text-neutral-700">Help & Support</span>
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 rounded-xl text-red-500 group-hover:bg-red-100 transition-colors"><LogOut className="w-5 h-5" /></div>
                                                <span className="text-sm font-medium text-red-500">Log Out</span>
                                            </div>
                                        </button>
                                    </div>
                                    <p className="text-center text-[10px] text-neutral-300 pt-4 pb-4">Version 2.4.0 (145)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tab Bar */}
            <div className="h-20 border-t border-border-muted bg-surface-DEFAULT flex justify-around items-center px-6 shrink-0 relative z-20">
                <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'cl-text-color-brand-primary-base' : 'text-neutral-text-medium-contrast hover:text-neutral-text-high-contrast'}`}>
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button onClick={() => setActiveTab('activity')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'activity' ? 'cl-text-color-brand-primary-base' : 'text-neutral-text-medium-contrast hover:text-neutral-text-high-contrast'}`}>
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Activity</span>
                </button>
                <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'cl-text-color-brand-primary-base' : 'text-neutral-text-medium-contrast hover:text-neutral-text-high-contrast'}`}>
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
}

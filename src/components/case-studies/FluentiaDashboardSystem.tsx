
import { BookOpen, Headphones, PenTool, Mic, ArrowUpRight, MessageSquare } from 'lucide-react';

export function FluentiaDashboardSystem() {
    return (
        <div className="w-full cl-bg-neutral-surface-level-0 cl-p-scale-500 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between cl-mb-scale-500 gap-4">
                <div>
                    <div className="cl-text-semantic-success-text text-[10px] font-bold tracking-[0.1em] uppercase cl-mb-scale-100">
                        Student Performance
                    </div>
                    <h1 className="text-3xl font-bold cl-text-neutral-text-high-contrast tracking-tight">
                        Fluentia Mastery
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="cl-bg-neutral-surface-level-2 hover:cl-bg-neutral-surface-level-3 cl-text-neutral-text-high-contrast px-5 py-2.5 cl-radius-full font-semibold text-sm transition-colors border cl-border-border-color-subtle">
                        Export Report
                    </button>
                    <button className="cl-bg-semantic-success-500 hover:cl-bg-semantic-success-900 text-white px-5 py-2.5 cl-radius-full font-semibold text-sm transition-colors shadow-sm">
                        Retake Assessment
                    </button>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 cl-mb-scale-500">
                {/* Left Big Card */}
                <div className="cl-bg-neutral-surface-level-1 cl-radius-2xl cl-p-scale-500 shadow-sm border cl-border-border-color-default flex flex-col items-center hover:shadow-md transition-shadow">
                    <div className="cl-text-neutral-text-medium-contrast text-xs font-bold tracking-[0.15em] uppercase cl-mb-scale-400">
                        Predicted Band Score
                    </div>
                    
                    <div className="relative w-40 h-40 flex items-center justify-center cl-mb-scale-400 group">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                className="stroke-neutral-100 fill-none transition-all duration-500"
                                strokeWidth="12"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out group-hover:stroke-emerald-400"
                                strokeWidth="12"
                                strokeDasharray="439.8"
                                strokeDashoffset={439.8 * (1 - 0.83)}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="flex flex-col items-center justify-center z-10">
                            <span className="text-5xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-none">
                                7.5
                            </span>
                            <span className="text-[10px] font-bold cl-text-semantic-success-text tracking-widest mt-1">
                                EXPERT USER
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 cl-bg-semantic-success-background cl-text-semantic-success-text px-4 py-2 cl-radius-full text-xs font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                        +0.5 from last assessment
                    </div>
                </div>

                {/* Right Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { title: 'Reading', sub: 'Academic & General', score: '8.0', icon: BookOpen, progress: 90 },
                        { title: 'Listening', sub: 'Interactive Audio', score: '7.5', icon: Headphones, progress: 80 },
                        { title: 'Writing', sub: 'Cohesion & Lexical', score: '6.5', icon: PenTool, progress: 65 },
                        { title: 'Speaking', sub: 'Fluency & Pronunciation', score: '7.0', icon: Mic, progress: 75 },
                    ].map((item, i) => (
                        <button key={i} className="text-left w-full cl-bg-neutral-surface-level-1 cl-radius-xl cl-p-scale-400 shadow-sm border cl-border-border-color-default flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition-all group">
                            <div className="w-12 h-12 cl-bg-semantic-success-background cl-radius-full flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                                <item.icon className="w-5 h-5 cl-text-semantic-success-text" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-base font-bold cl-text-neutral-text-high-contrast truncate">
                                    {item.title}
                                </div>
                                <div className="text-xs cl-text-neutral-text-medium-contrast truncate mt-0.5">
                                    {item.sub}
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-2xl font-bold cl-text-neutral-text-high-contrast">
                                    {item.score}
                                </div>
                                <div className="w-10 h-1.5 cl-bg-neutral-surface-level-2 cl-radius-full mt-1.5 overflow-hidden">
                                    <div 
                                        className="h-full cl-bg-semantic-success-500 cl-radius-full transition-all duration-1000 ease-out group-hover:bg-emerald-400"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Chart */}
            <div className="cl-bg-neutral-surface-level-1 cl-radius-2xl cl-p-scale-500 shadow-sm border cl-border-border-color-default">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start cl-mb-scale-600 gap-4">
                    <div>
                        <h2 className="text-xl font-bold cl-text-neutral-text-high-contrast mb-1">
                            Historical Progression
                        </h2>
                        <p className="text-sm cl-text-neutral-text-medium-contrast">
                            Last 30 days performance across all modules
                        </p>
                    </div>
                    <div className="flex items-center cl-bg-neutral-surface-level-2 cl-radius-full p-1">
                        {['1 Month', '3 Months', 'All Time'].map((tab, i) => (
                            <button 
                                key={tab}
                                className={`px-4 py-1.5 cl-radius-full text-xs font-bold transition-all ${i === 0 ? 'cl-bg-neutral-surface-level-1 cl-text-neutral-text-high-contrast shadow-sm' : 'cl-text-neutral-text-medium-contrast hover:cl-text-neutral-text-high-contrast'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* System Chart rendering */}
                <div className="h-40 flex items-end justify-between gap-2 px-2 relative">
                    <div className="absolute bottom-0 left-0 w-full border-b cl-border-border-color-default" />
                    {[15, 25, 35, 30, 50, 65, 60, 40, 20, 85].map((h, i) => {
                        const isLast = i === 9;
                        return (
                            <div key={i} className="w-full relative h-full flex items-end group cursor-pointer">
                                {/* Ghost Bar */}
                                <div 
                                    className="absolute bottom-0 w-full cl-bg-neutral-surface-level-2 cl-radius-full opacity-50 transition-all duration-300 group-hover:h-full"
                                    style={{ height: `${Math.min(h + 20, 100)}%` }}
                                />
                                {/* Actual Bar */}
                                <div 
                                    className={`relative z-10 w-full transition-all duration-500 ease-out cl-radius-t-full ${isLast ? 'cl-bg-semantic-success-500' : 'bg-emerald-300'} group-hover:opacity-90`}
                                    style={{ height: `${h}%` }}
                                >
                                    {isLast && (
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 cl-bg-semantic-success-900 cl-radius-full flex items-center justify-center shadow-lg border-2 border-white transform translate-x-1/4 translate-y-1/4">
                                            <MessageSquare className="w-5 h-5 text-white" fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between items-center mt-6 text-[10px] font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast px-2">
                    <span>May 01</span>
                    <span>May 15</span>
                    <span className="cl-text-semantic-success-500">May 30 (Today)</span>
                </div>
            </div>
        </div>
    );
}

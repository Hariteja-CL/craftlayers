

export function FluentiaProgressionSystem() {
    return (
        <div className="w-full cl-p-scale-500 cl-radius-2xl cl-bg-neutral-surface-level-1 border cl-border-border-color-default shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Background Gradient Effect via Tokenized Utility */}
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-sm">
                <div className="inline-flex items-center cl-bg-semantic-success-background cl-text-semantic-success-text text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 cl-radius-full cl-mb-scale-300">
                    Current Progression
                </div>
                
                <h2 className="text-3xl font-bold cl-text-neutral-text-high-contrast cl-mb-scale-200 tracking-tight">
                    Level B2 French Mastery
                </h2>
                
                <p className="cl-text-neutral-text-medium-contrast text-sm leading-relaxed">
                    You're making excellent progress! Narrative structures and dialectical nuance await your exploration.
                </p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* System-aligned circular progress */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Background Track */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            className="stroke-neutral-200 fill-none"
                            strokeWidth="8"
                        />
                        {/* Progress Track */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            className="stroke-emerald-500 fill-none"
                            strokeWidth="8"
                            strokeDasharray="351.858"
                            strokeDashoffset={351.858 * (1 - 0.64)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="text-2xl font-bold cl-text-neutral-text-high-contrast tracking-tight">
                        64%
                    </span>
                </div>
                <span className="cl-mt-scale-300 text-sm font-semibold cl-text-neutral-text-medium-contrast">
                    Mastery Progress
                </span>
            </div>
        </div>
    );
}

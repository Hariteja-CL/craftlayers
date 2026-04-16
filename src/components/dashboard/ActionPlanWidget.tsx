import { useState } from 'react';
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../ui/Button';

interface Task {
    id: string;
    title: string;
    description: string;
    team: string;
    estimatedImpact: string;
}

interface ActionPlanProps {
    tasks: Task[];
}

export function ActionPlanWidget({ tasks }: ActionPlanProps) {
    const [scheduledTasks, setScheduledTasks] = useState<Set<string>>(new Set());

    const handleExecute = (taskId: string, taskTitle: string) => {
        setScheduledTasks(prev => new Set(prev).add(taskId));
        // Simulate integration
        toast.success(`Task '${taskTitle}' added to JIRA and Calendar.`);
    };

    if (!tasks || tasks.length === 0) return null;

    return (
        <div className="space-y-3 mt-2 w-full max-w-md">
            <div className="flex items-center gap-2 text-xs font-semibold cl-text-color-brand-primary-base uppercase tracking-wider mb-1">
                <SparklesIcon className="w-3 h-3" />
                Suggested Intervention Plan
            </div>

            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="cl-surface-card border cl-border-default rounded-xl p-4 shadow-sm hover:cl-elevation-raised transition-all group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-semibold cl-text-primary text-sm">{task.title}</h4>
                            <span className="inline-block mt-1 px-2 py-0.5 cl-bg-neutral-surface-level-2 cl-text-secondary text-[10px] rounded-full font-medium">
                                {task.team}
                            </span>
                        </div>
                        {scheduledTasks.has(task.id) ? (
                            <span className="cl-text-semantic-success-text cl-bg-semantic-success-background p-1 rounded-full">
                                <CheckCircle2 className="w-4 h-4" />
                            </span>
                        ) : (
                            <div className="cl-text-neutral-text-low-contrast">
                                <Clock className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <p className="text-xs cl-text-secondary mb-3 leading-relaxed">
                        {task.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t cl-border-subtle">
                        <span className="text-[10px] cl-text-neutral-text-medium-contrast font-medium flex items-center gap-1">
                            Impact over low sentiment:
                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border cl-border-subtle shadow-sm", getImpactStyles(task.estimatedImpact))}>
                                {task.estimatedImpact}
                            </span>
                        </span>

                        <button
                            onClick={() => handleExecute(task.id, task.title)}
                            disabled={scheduledTasks.has(task.id)}
                            className={cn("text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors",
                                scheduledTasks.has(task.id)
                                    ? 'cl-bg-semantic-success-background cl-text-semantic-success-text cursor-default'
                                    : 'cl-bg-color-brand-primary-base cl-text-color-brand-primary-on-base hover:opacity-90'
                            )}
                        >
                            {scheduledTasks.has(task.id) ? (
                                'Scheduled'
                            ) : (
                                <>
                                    Execute <ArrowRight className="w-3 h-3" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getImpactStyles(impact: string) {
    const lower = impact.toLowerCase();
    if (lower.includes('high')) return 'cl-bg-semantic-success-background cl-text-semantic-success-text cl-border-semantic-success-border';
    if (lower.includes('medium')) return 'cl-bg-semantic-warning-background cl-text-semantic-warning-text cl-border-semantic-warning-border';
    if (lower.includes('low')) return 'cl-bg-semantic-error-background cl-text-semantic-error-text cl-border-semantic-error-border';
    return 'cl-bg-color-brand-primary-background cl-text-color-brand-primary-base'; // default
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    );
}

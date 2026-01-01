import { useState } from 'react';
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'sonner';

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
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                <SparklesIcon className="w-3 h-3" />
                Suggested Intervention Plan
            </div>

            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-semibold text-neutral-900 text-sm">{task.title}</h4>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded-full font-medium">
                                {task.team}
                            </span>
                        </div>
                        {scheduledTasks.has(task.id) ? (
                            <span className="text-green-600 bg-green-50 p-1 rounded-full">
                                <CheckCircle2 className="w-4 h-4" />
                            </span>
                        ) : (
                            <div className="text-neutral-300">
                                <Clock className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                        {task.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-50">
                        <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                            Impact over low sentiment:
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r ${getImpactColor(task.estimatedImpact)} text-white shadow-sm`}>
                                {task.estimatedImpact}
                            </span>
                        </span>

                        <button
                            onClick={() => handleExecute(task.id, task.title)}
                            disabled={scheduledTasks.has(task.id)}
                            className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${scheduledTasks.has(task.id)
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
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

function getImpactColor(impact: string) {
    const lower = impact.toLowerCase();
    if (lower.includes('high')) return 'from-green-500 to-green-600';
    if (lower.includes('medium')) return 'from-orange-400 to-orange-500';
    if (lower.includes('low')) return 'from-red-500 to-red-600';
    return 'from-indigo-500 to-indigo-600'; // default
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

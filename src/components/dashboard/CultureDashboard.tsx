import { useState } from 'react';
import { DataView } from './DataView';
import { VisualView } from './VisualView';
import { AlertSystem } from './AlertSystem';
import { Button } from '../ui/Button';

export interface DepartmentMetric {
    id: string;
    department: string;
    headcount: number;
    sentiment: number;
    topThemes: string[];
}

const INITIAL_DATA: DepartmentMetric[] = [
    { id: '1', department: 'Engineering', headcount: 24, sentiment: 62, topThemes: ['Legacy Code', 'Siloed Teams', 'Knowledge Gap'] }, // Merger Context
    { id: '2', department: 'Design', headcount: 12, sentiment: 42, topThemes: ['Burnout', 'Feedback Loops', 'Overtime'] }, // Burnout Context (Critical)
    { id: '3', department: 'Product Management', headcount: 8, sentiment: 78, topThemes: ['Strategy Clarity', 'Alignment'] },
    { id: '4', department: 'Sales & Marketing', headcount: 18, sentiment: 55, topThemes: ['Budget Cuts', 'Travel Freeze', 'Morale'] }, // Budget Context
    { id: '5', department: 'Customer Support', headcount: 15, sentiment: 88, topThemes: ['Autonomy', 'Mastery'] },
];

export function CultureDashboard() {
    const [data, setData] = useState<DepartmentMetric[]>(INITIAL_DATA);

    const averageSentiment = data.reduce((acc, curr) => acc + curr.sentiment, 0) / data.length;

    const handleUpdate = (id: string, field: keyof DepartmentMetric, value: any) => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50/50 p-8 space-y-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Proactive Culture Dashboard</h1>
                    <p className="text-neutral-500 mt-2">Monitor implementation of AI ethics and employee well-being in real-time.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/work/enculture'}
                    className="bg-white"
                >
                    Back to Case Study
                </Button>
            </header>

            <AlertSystem averageSentiment={averageSentiment} data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DataView data={data} onUpdate={handleUpdate} />
                <VisualView averageSentiment={averageSentiment} />
            </div>
        </div>
    );
}

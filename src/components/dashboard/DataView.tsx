import type { DepartmentMetric } from './CultureDashboard';

interface DataViewProps {
    data: DepartmentMetric[];
    onUpdate: (id: string, field: keyof DepartmentMetric, value: any) => void;
}

export function DataView({ data, onUpdate }: DataViewProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/60 overflow-hidden">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Department Feedback Data</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-100 text-neutral-500 text-sm">
                            <th className="py-3 px-2 font-medium">Department</th>
                            <th className="py-3 px-2 font-medium">Team Size</th>
                            <th className="py-3 px-2 font-medium">Sentiment (0-100)</th>
                            <th className="py-3 px-2 font-medium">Top Themes</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.map((item) => (
                            <tr key={item.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                                <td className="py-3 px-2 text-neutral-900 font-bold">{item.department}</td>
                                <td className="py-3 px-2 text-neutral-600 font-mono text-xs">{item.headcount}</td>
                                <td className="py-3 px-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={item.sentiment}
                                        onChange={(e) => onUpdate(item.id, 'sentiment', parseInt(e.target.value) || 0)}
                                        className={`w-20 px-2 py-1 rounded border ${item.sentiment < 50 ? 'border-red-300 bg-red-50 text-red-700' : 'border-neutral-200 focus:border-neutral-400'
                                            } focus:outline-none transition-all`}
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <div className="flex flex-wrap gap-1">
                                        {item.topThemes.map((theme, i) => (
                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                {theme}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

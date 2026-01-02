import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VisualViewProps {
    averageSentiment: number;
    totalHeadcount: number;
}

export function VisualView({ averageSentiment, totalHeadcount }: VisualViewProps) {
    // Generate a mock history ending with the current average
    const chartData = useMemo(() => {
        const history = [];
        const now = new Date();
        // Generate 6 months of data
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(now.getMonth() - i);

            // Random fluctuation but ending exactly at the current average
            let value;
            if (i === 0) {
                value = averageSentiment;
            } else {
                // Randomize history around the current average with some variance
                const variance = Math.random() * 20 - 10;
                value = Math.max(0, Math.min(100, averageSentiment + variance));
            }

            history.push({
                month: date.toLocaleString('default', { month: 'short' }),
                sentiment: Math.round(value),
            });
        }
        return history;
    }, [averageSentiment]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200/60 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">Sentiment Trends</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">
                            {Math.round(averageSentiment)}%
                        </span>
                        <span className="text-sm font-medium text-neutral-500">Total Avg. (N={totalHeadcount})</span>
                    </div>
                </div>
                <div className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-600">
                    6 Month View
                </div>
            </div>

            <div className="flex-1 w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="sentiment"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorSentiment)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

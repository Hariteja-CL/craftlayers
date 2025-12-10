import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const weeklyData = [
  { date: 'Mon', mood: 72 },
  { date: 'Tue', mood: 78 },
  { date: 'Wed', mood: 75 },
  { date: 'Thu', mood: 82 },
  { date: 'Fri', mood: 80 },
  { date: 'Sat', mood: 85 },
  { date: 'Sun', mood: 88 },
];

const moodLogs = [
  { emoji: '😊', label: 'Happy', date: 'Sun' },
  { emoji: '😌', label: 'Calm', date: 'Sat' },
  { emoji: '😃', label: 'Excited', date: 'Fri' },
  { emoji: '😊', label: 'Content', date: 'Thu' },
  { emoji: '😐', label: 'Neutral', date: 'Wed' },
  { emoji: '😊', label: 'Good', date: 'Tue' },
  { emoji: '😌', label: 'Peaceful', date: 'Mon' },
];

const triggers = [
  { trigger: 'Exercise', impact: 'Positive', count: 5 },
  { trigger: 'Good Sleep', impact: 'Positive', count: 6 },
  { trigger: 'Work Stress', impact: 'Negative', count: 2 },
];

export function MoodTrends() {
  const [activeFilter, setActiveFilter] = useState<'day' | 'week' | 'month'>('week');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-1">Mood Trends</h2>
        <p className="text-neutral-500">Track your emotional patterns over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
          >
            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-neutral-900">Weekly Mood Chart</h3>
              <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
                {(['day', 'week', 'month'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all capitalize ${activeFilter === filter
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#a3a3a3"
                    style={{ fontSize: '14px' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a3a3a3"
                    style={{ fontSize: '14px' }}
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ fill: '#14b8a6', r: 6 }}
                    activeDot={{ r: 8, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Mood Log Chips */}
            <div>
              <p className="text-neutral-700 text-sm mb-4">Recent Mood Logs</p>
              <div className="flex flex-wrap gap-2">
                {moodLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200"
                  >
                    <span className="text-xl">{log.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-neutral-900 text-sm">{log.label}</span>
                      <span className="text-neutral-500 text-xs">{log.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Side Card: Mood Triggers */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="size-5 text-indigo-500" />
              <h3 className="text-neutral-900">Mood Triggers This Week</h3>
            </div>

            <div className="space-y-4">
              {triggers.map((item, index) => {
                const isPositive = item.impact === 'Positive';
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${isPositive
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm ${isPositive ? 'text-green-900' : 'text-red-900'
                          }`}
                      >
                        {item.trigger}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs ${isPositive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {item.impact}
                      </span>
                    </div>
                    <p
                      className={`text-xs ${isPositive ? 'text-green-700' : 'text-red-700'
                        }`}
                    >
                      {item.count} occurrences
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="size-4 text-teal-600" />
                <p className="text-neutral-700 text-sm">Overall Trend</p>
              </div>
              <p className="text-neutral-600 text-sm">
                Your mood has improved by{' '}
                <span className="text-teal-600">+12%</span> this week
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
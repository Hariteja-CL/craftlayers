import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft } from 'lucide-react';
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
  { emoji: '😊', note: 'Had a great workout', time: '2 hours ago' },
  { emoji: '😌', note: 'Feeling calm after meditation', time: '5 hours ago' },
  { emoji: '😃', note: 'Productive work day', time: 'Yesterday' },
  { emoji: '😐', note: 'Bit stressed about deadline', time: '2 days ago' },
  { emoji: '😊', note: 'Coffee with friends', time: '3 days ago' },
];

interface MobileMoodTrendsProps {
  onBack?: () => void;
}

export function MobileMoodTrends({ onBack }: MobileMoodTrendsProps) {
  const [activeFilter, setActiveFilter] = useState<'day' | 'week' | 'month'>('week');

  return (
    <div className="w-full max-w-[390px] mx-auto bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-neutral-200">
        <button onClick={onBack} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
          <ChevronLeft className="size-5 text-neutral-900" />
        </button>
        <div>
          <h4 className="text-neutral-900">Mood Trends</h4>
          <p className="text-neutral-500 text-xs">Track your emotions</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-5">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {(['day', 'week', 'month'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all capitalize flex-shrink-0 ${activeFilter === filter
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <p className="text-neutral-900 text-sm mb-4">Weekly Mood Chart</p>

          <div className="h-[200px] w-full -mx-2">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <XAxis
                  dataKey="date"
                  stroke="#a3a3a3"
                  style={{ fontSize: '10px' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#a3a3a3"
                  style={{ fontSize: '10px' }}
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#FF9933"
                  strokeWidth={2.5}
                  dot={{ fill: '#FF9933', r: 4 }}
                  activeDot={{ r: 6, fill: '#FF9933' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mood Log List */}
        <div>
          <p className="text-neutral-700 text-sm mb-3 px-1">Recent Mood Logs</p>

          <div className="space-y-2">
            {moodLogs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-white p-3 rounded-xl border border-neutral-200 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{log.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-900 text-sm mb-0.5">{log.note}</p>
                    <p className="text-neutral-500 text-xs">{log.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
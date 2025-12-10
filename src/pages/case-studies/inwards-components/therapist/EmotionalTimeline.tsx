import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, TrendingUp, AlertCircle, ZoomIn, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { useState } from 'react';

const fullTimelineData = [
  { date: 'Dec 1', mood: 68, marker: null },
  { date: 'Dec 5', mood: 72, marker: null },
  { date: 'Dec 8', mood: 55, marker: 'stress' },
  { date: 'Dec 12', mood: 60, marker: null },
  { date: 'Dec 15', mood: 75, marker: 'relax' },
  { date: 'Dec 18', mood: 78, marker: null },
  { date: 'Dec 22', mood: 65, marker: null },
  { date: 'Dec 26', mood: 48, marker: 'drop' },
  { date: 'Dec 29', mood: 52, marker: null },
  { date: 'Jan 2', mood: 62, marker: null },
  { date: 'Jan 5', mood: 70, marker: null },
  { date: 'Jan 9', mood: 73, marker: null },
  { date: 'Jan 12', mood: 68, marker: null },
  { date: 'Jan 16', mood: 76, marker: 'relax' },
  { date: 'Jan 19', mood: 72, marker: null },
  { date: 'Jan 23', mood: 58, marker: 'stress' },
  { date: 'Jan 26', mood: 64, marker: null },
  { date: 'Jan 30', mood: 70, marker: null },
  { date: 'Feb 2', mood: 75, marker: null },
  { date: 'Feb 6', mood: 78, marker: null },
];

const events = [
  { date: 'Dec 8', type: 'stress', title: 'High Stress Event', description: 'Work deadline pressure mentioned in journal', impact: 'negative' },
  { date: 'Dec 15', type: 'relax', title: 'Relaxation Period', description: 'Started new meditation routine', impact: 'positive' },
  { date: 'Dec 26', type: 'drop', title: 'Mood Drop', description: 'Holiday family conflict reported', impact: 'negative' },
  { date: 'Jan 16', type: 'relax', title: 'Relaxation Period', description: 'Vacation time - consistent meditation', impact: 'positive' },
  { date: 'Jan 23', type: 'stress', title: 'High Stress Event', description: 'Relationship concerns noted', impact: 'negative' },
];

export function EmotionalTimeline() {
  const [zoomLevel, setZoomLevel] = useState<'1M' | '3M' | 'ALL'>('3M');

  return (
    <div className="w-full min-h-screen bg-neutral-50 p-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="size-5" />
              <span>Back to Profile</span>
            </button>
            <div className="w-px h-6 bg-neutral-300" />
            <div>
              <h1 className="text-neutral-900 mb-1">Emotional Timeline</h1>
              <p className="text-neutral-600">Sarah Chen • Full History View</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-neutral-200">
              {(['1M', '3M', 'ALL'] as const).map((zoom) => (
                <button
                  key={zoom}
                  onClick={() => setZoomLevel(zoom)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${zoomLevel === zoom
                      ? 'bg-orange-500 text-white'
                      : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                >
                  {zoom}
                </button>
              ))}
            </div>
            <button className="p-2.5 bg-white rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <Calendar className="size-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Large Chart - 9 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-9 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-neutral-900">Mood Progression Over Time</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <span className="text-red-700 text-sm">High Stress</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                  <span className="text-green-700 text-sm">Relaxation</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                  <span className="text-orange-700 text-sm">Mood Drop</span>
                </div>
              </div>
            </div>

            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={fullTimelineData}>
                  <defs>
                    <linearGradient id="moodGradientFull" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF9933" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#FF9933" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#a3a3a3"
                    style={{ fontSize: '12px' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a3a3a3"
                    style={{ fontSize: '12px' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <ReferenceLine y={70} stroke="#d4d4d4" strokeDasharray="3 3" label="Baseline" />

                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#FF9933"
                    strokeWidth={3}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.marker === 'stress') {
                        return <circle cx={cx} cy={cy} r={8} fill="#ef4444" stroke="#fff" strokeWidth={2} />;
                      }
                      if (payload.marker === 'relax') {
                        return <circle cx={cx} cy={cy} r={8} fill="#10b981" stroke="#fff" strokeWidth={2} />;
                      }
                      if (payload.marker === 'drop') {
                        return <circle cx={cx} cy={cy} r={8} fill="#f97316" stroke="#fff" strokeWidth={2} />;
                      }
                      return <circle cx={cx} cy={cy} r={4} fill="#FF9933" />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Events Panel - 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-3 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="size-5 text-orange-500" />
              <h3 className="text-neutral-900">Influencing Events</h3>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${event.impact === 'negative'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-green-50 border-green-200'
                    }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {event.impact === 'negative' ? (
                      <TrendingDown className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <TrendingUp className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm mb-1 ${event.impact === 'negative' ? 'text-red-900' : 'text-green-900'
                        }`}>
                        {event.title}
                      </p>
                      <p className={`text-xs ${event.impact === 'negative' ? 'text-red-700' : 'text-green-700'
                        }`}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-current opacity-50">
                    <span className="text-xs">{event.date}</span>
                    <span className="text-xs">{event.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm">
              Add Event Note
            </button>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <p className="text-neutral-500 text-sm mb-2">Average Mood</p>
            <p className="text-neutral-900 text-3xl mb-1">67.8</p>
            <p className="text-green-600 text-sm">+5.2 from baseline</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <p className="text-neutral-500 text-sm mb-2">Stress Events</p>
            <p className="text-neutral-900 text-3xl mb-1">3</p>
            <p className="text-orange-600 text-sm">Last 2 months</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <p className="text-neutral-500 text-sm mb-2">Recovery Time</p>
            <p className="text-neutral-900 text-3xl mb-1">4.5d</p>
            <p className="text-neutral-600 text-sm">Avg after stress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <p className="text-neutral-500 text-sm mb-2">Peak Mood</p>
            <p className="text-neutral-900 text-3xl mb-1">78</p>
            <p className="text-blue-600 text-sm">Feb 6 (Recent)</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

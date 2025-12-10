import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, BookOpen, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const emotionalData = [
  { date: 'Jan 1', mood: 65, stress: 45 },
  { date: 'Jan 8', mood: 70, stress: 40 },
  { date: 'Jan 15', mood: 55, stress: 68 },
  { date: 'Jan 22', mood: 60, stress: 55 },
  { date: 'Jan 29', mood: 75, stress: 35 },
  { date: 'Feb 5', mood: 72, stress: 38 },
  { date: 'Feb 12', mood: 68, stress: 42 },
  { date: 'Feb 19', mood: 78, stress: 28 },
];

const sentimentData = [
  { day: 'Mon', score: 0.6 },
  { day: 'Tue', score: 0.4 },
  { day: 'Wed', score: 0.7 },
  { day: 'Thu', score: 0.3 },
  { day: 'Fri', score: 0.8 },
  { day: 'Sat', score: 0.5 },
  { day: 'Sun', score: 0.6 },
];

export function PatientProfileOverview() {
  return (
    <div className="w-full min-h-screen bg-neutral-50 p-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="size-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Patient Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8"
        >
          <div className="flex items-start gap-6">
            {/* Patient Photo */}
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
              SC
            </div>

            {/* Patient Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-neutral-900 mb-2">Sarah Chen</h1>
                  <p className="text-neutral-600 mb-3">Patient ID: #P-2847 • Age: 32 • Female</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-neutral-500" />
                      <span className="text-neutral-600 text-sm">Last session: 2 days ago</span>
                    </div>
                    <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm border border-orange-200">
                      Monitor
                    </div>
                  </div>
                </div>

                <button className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
                  Schedule Session
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-500 text-xs mb-1">Risk Score</p>
                  <p className="text-neutral-900 text-2xl">72</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-500 text-xs mb-1">Compliance</p>
                  <p className="text-neutral-900 text-2xl">85%</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-500 text-xs mb-1">Total Sessions</p>
                  <p className="text-neutral-900 text-2xl">24</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-neutral-500 text-xs mb-1">Current Mood</p>
                  <p className="text-neutral-900 text-2xl">Anxious</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Emotional Timeline - 8 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-orange-500" />
                <h3 className="text-neutral-900">Emotional Timeline</h3>
              </div>
              <button className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
                View Full Timeline →
              </button>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={emotionalData}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#moodGradient)"
                    name="Mood Score"
                  />
                  <Area
                    type="monotone"
                    dataKey="stress"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fill="url(#stressGradient)"
                    name="Stress Level"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-neutral-600 text-sm">Mood Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-neutral-600 text-sm">Stress Level</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - 4 cols */}
          <div className="col-span-4 space-y-6">
            {/* Meditation Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Activity className="size-5 text-blue-500" />
                <h3 className="text-neutral-900">Meditation Compliance</h3>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#f5f5f5"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#FF9933"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0.85)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl text-neutral-900">85%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Completed Sessions</span>
                  <span className="text-neutral-900">17/20</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Current Streak</span>
                  <span className="text-neutral-900">5 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Avg Duration</span>
                  <span className="text-neutral-900">12 min</span>
                </div>
              </div>
            </motion.div>

            {/* Journal Sentiment Mini */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-500" />
                  <h3 className="text-neutral-900">Journal Sentiment</h3>
                </div>
                <button className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
                  Details →
                </button>
              </div>

              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={sentimentData}>
                    <XAxis
                      dataKey="day"
                      stroke="#a3a3a3"
                      style={{ fontSize: '10px' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide domain={[0, 1]} />
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
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ fill: '#3b82f6', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-blue-700 text-sm">Trending slightly negative this week</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

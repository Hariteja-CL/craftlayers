import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { User, Mail, Phone, Calendar, Target, Brain } from 'lucide-react';
import { motion } from 'motion/react';

const emotionalTimelineData = [
  { date: 'Jan 1', mood: 65 },
  { date: 'Jan 8', mood: 70 },
  { date: 'Jan 15', mood: 68 },
  { date: 'Jan 22', mood: 75 },
  { date: 'Jan 29', mood: 72 },
  { date: 'Feb 5', mood: 78 },
  { date: 'Feb 12', mood: 82 },
  { date: 'Feb 19', mood: 80 },
];

const sentimentTrendData = [
  { week: 'W1', positive: 55, neutral: 30, negative: 15 },
  { week: 'W2', positive: 62, neutral: 25, negative: 13 },
  { week: 'W3', positive: 58, neutral: 28, negative: 14 },
  { week: 'W4', positive: 67, neutral: 23, negative: 10 },
];

export function PatientProfile() {
  const patient = {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+1 (555) 123-4567',
    age: 28,
    joined: 'Dec 15, 2024',
    diagnosis: 'Anxiety, Mild Depression',
    therapist: 'Dr. Emily Chen',
  };

  return (
    <div className="max-w-7xl">
      {/* Patient Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center">
            <User className="size-10 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-neutral-900 mb-1">{patient.name}</h2>
                <p className="text-neutral-500">Patient ID: #PAT-2847</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">
                  Schedule Session
                </button>
                <button className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors">
                  View History
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-neutral-400" />
                <div>
                  <p className="text-neutral-500 text-xs mb-1">Email</p>
                  <p className="text-neutral-900 text-sm">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-neutral-400" />
                <div>
                  <p className="text-neutral-500 text-xs mb-1">Phone</p>
                  <p className="text-neutral-900 text-sm">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-neutral-400" />
                <div>
                  <p className="text-neutral-500 text-xs mb-1">Member Since</p>
                  <p className="text-neutral-900 text-sm">{patient.joined}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="size-5 text-neutral-400" />
                <div>
                  <p className="text-neutral-500 text-xs mb-1">Age</p>
                  <p className="text-neutral-900 text-sm">{patient.age} years</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-neutral-500 text-sm mb-1">Diagnosis</p>
                  <p className="text-neutral-900">{patient.diagnosis}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm mb-1">Assigned Therapist</p>
                  <p className="text-neutral-900">{patient.therapist}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Timeline Chart */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-8">
        <h3 className="text-neutral-900 mb-6">Emotional Timeline (Last 2 Months)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={emotionalTimelineData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="date" stroke="#737373" style={{ fontSize: '14px' }} />
              <YAxis
                stroke="#737373"
                style={{ fontSize: '14px' }}
                domain={[0, 100]}
                label={{ value: 'Mood Score', angle: -90, position: 'insideLeft' }}
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
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meditation Compliance */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Brain className="size-5 text-purple-500" />
            <h3 className="text-neutral-900">Meditation Compliance</h3>
          </div>

          <div className="mb-6">
            <div className="flex items-end justify-between mb-2">
              <span className="text-neutral-600 text-sm">Weekly Goal Progress</span>
              <span className="text-neutral-900">5/7 sessions</span>
            </div>
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: '71%' }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div>
                <p className="text-neutral-900 text-sm mb-1">Total Minutes This Week</p>
                <p className="text-neutral-500 text-xs">Target: 150 min</p>
              </div>
              <span className="text-purple-600">125 min</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
              <div>
                <p className="text-neutral-900 text-sm mb-1">Current Streak</p>
                <p className="text-neutral-500 text-xs">Personal best: 18 days</p>
              </div>
              <span className="text-purple-600">12 days</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div>
                <p className="text-green-900 text-sm mb-1">Consistency Rate</p>
                <p className="text-green-700 text-xs">Above average</p>
              </div>
              <span className="text-green-600">83%</span>
            </div>
          </div>
        </motion.div>

        {/* Journal Sentiment Trend */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="size-5 text-indigo-500" />
            <h3 className="text-neutral-900">Journal Sentiment Trend</h3>
          </div>

          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="week" stroke="#737373" style={{ fontSize: '14px' }} />
                <YAxis stroke="#737373" style={{ fontSize: '14px' }} domain={[0, 100]} />
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
                  dataKey="positive"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="#a3a3a3"
                  strokeWidth={2}
                  dot={{ fill: '#a3a3a3', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around pt-4 border-t border-neutral-200">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-neutral-600 text-sm">Positive</span>
              </div>
              <span className="text-neutral-900">↗ Trending up</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-neutral-600 text-sm">Negative</span>
              </div>
              <span className="text-neutral-900">↘ Improving</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

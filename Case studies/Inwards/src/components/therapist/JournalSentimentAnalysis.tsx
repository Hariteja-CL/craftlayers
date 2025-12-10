import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';

const sentimentDistribution = [
  { name: 'Positive', value: 45, color: '#10b981' },
  { name: 'Neutral', value: 28, color: '#a3a3a3' },
  { name: 'Negative', value: 27, color: '#ef4444' },
];

const weeklyPattern = [
  { week: 'W1', positive: 50, neutral: 30, negative: 20 },
  { week: 'W2', positive: 48, neutral: 28, negative: 24 },
  { week: 'W3', positive: 42, neutral: 32, negative: 26 },
  { week: 'W4', positive: 45, neutral: 25, negative: 30 },
  { week: 'W5', positive: 40, neutral: 28, negative: 32 },
  { week: 'W6', positive: 45, neutral: 28, negative: 27 },
];

const wordClusters = [
  { word: 'anxious', frequency: 24, sentiment: 'negative' },
  { word: 'grateful', frequency: 18, sentiment: 'positive' },
  { word: 'stressed', frequency: 22, sentiment: 'negative' },
  { word: 'peaceful', frequency: 15, sentiment: 'positive' },
  { word: 'worried', frequency: 19, sentiment: 'negative' },
  { word: 'hopeful', frequency: 16, sentiment: 'positive' },
  { word: 'overwhelmed', frequency: 14, sentiment: 'negative' },
  { word: 'calm', frequency: 13, sentiment: 'positive' },
  { word: 'tired', frequency: 17, sentiment: 'neutral' },
  { word: 'motivated', frequency: 12, sentiment: 'positive' },
  { word: 'uncertain', frequency: 11, sentiment: 'negative' },
  { word: 'content', frequency: 10, sentiment: 'positive' },
];

const riskSpikes = [
  { date: 'Feb 15', concern: 'Multiple negative entries', severity: 'high', score: 85 },
  { date: 'Feb 12', concern: 'Isolation keywords detected', severity: 'medium', score: 68 },
  { date: 'Feb 8', concern: 'Sleep disruption mentioned', severity: 'medium', score: 72 },
];

export function JournalSentimentAnalysis() {
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
              <h1 className="text-neutral-900 mb-1">Journal Sentiment Analysis</h1>
              <p className="text-neutral-600">Sarah Chen • Last 6 Weeks</p>
            </div>
          </div>

          <button className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors">
            Export Report
          </button>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Donut Chart - 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <h3 className="text-neutral-900 mb-6">Overall Sentiment</h3>

            <div className="h-[240px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
              {sentimentDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-600 text-sm">{item.name}</span>
                  </div>
                  <span className="text-neutral-900 text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Word Clusters - 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-5 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <h3 className="text-neutral-900 mb-6">Frequently Used Words</h3>

            <div className="grid grid-cols-3 gap-3">
              {wordClusters.map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-xl border text-center ${
                    word.sentiment === 'positive'
                      ? 'bg-green-50 border-green-200'
                      : word.sentiment === 'negative'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <p className={`text-sm mb-1 ${
                    word.sentiment === 'positive'
                      ? 'text-green-900'
                      : word.sentiment === 'negative'
                      ? 'text-red-900'
                      : 'text-neutral-900'
                  }`}>
                    {word.word}
                  </p>
                  <p className="text-xs text-neutral-500">{word.frequency}×</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Risk Spikes - 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-3 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="size-5 text-red-500" />
              <h3 className="text-neutral-900">Risk Alerts</h3>
            </div>

            <div className="space-y-3">
              {riskSpikes.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    alert.severity === 'high'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      Risk: {alert.score}
                    </span>
                    <span className="text-neutral-500 text-xs">{alert.date}</span>
                  </div>
                  <p className={`text-sm ${
                    alert.severity === 'high' ? 'text-red-900' : 'text-orange-900'
                  }`}>
                    {alert.concern}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm">
              Review All Alerts
            </button>
          </motion.div>
        </div>

        {/* Weekly Pattern Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-neutral-900">Weekly Sentiment Pattern</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-neutral-600 text-sm">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neutral-400 rounded-full" />
                <span className="text-neutral-600 text-sm">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-neutral-600 text-sm">Negative</span>
              </div>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyPattern}>
                <XAxis
                  dataKey="week"
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
                  domain={[0, 60]}
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
                  dataKey="positive"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="#a3a3a3"
                  strokeWidth={3}
                  dot={{ fill: '#a3a3a3', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-start gap-3">
            <TrendingDown className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-900 text-sm mb-1">Trend Alert</p>
              <p className="text-orange-700 text-sm">
                Negative sentiment has increased by 35% over the last 3 weeks. Consider scheduling an additional session.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <p className="text-neutral-500 text-sm mb-2">Total Entries</p>
            <p className="text-neutral-900 text-3xl mb-1">42</p>
            <p className="text-neutral-600 text-sm">Last 6 weeks</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <p className="text-neutral-500 text-sm mb-2">Avg Entry Length</p>
            <p className="text-neutral-900 text-3xl mb-1">156</p>
            <p className="text-neutral-600 text-sm">words</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <p className="text-neutral-500 text-sm mb-2">Consistency</p>
            <p className="text-neutral-900 text-3xl mb-1">87%</p>
            <p className="text-green-600 text-sm">Daily journaling</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <p className="text-neutral-500 text-sm mb-2">Unique Words</p>
            <p className="text-neutral-900 text-3xl mb-1">482</p>
            <p className="text-neutral-600 text-sm">Vocabulary range</p>
          </div>
        </div>
      </div>
    </div>
  );
}

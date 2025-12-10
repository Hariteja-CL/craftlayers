import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const sentimentData = [
  { name: 'Positive', value: 67, color: '#86efac' },
  { name: 'Neutral', value: 23, color: '#d4d4d8' },
  { name: 'Negative', value: 10, color: '#fca5a5' },
];

const emotionalWords = [
  { word: 'grateful', size: 32, color: '#10b981' },
  { word: 'peaceful', size: 28, color: '#14b8a6' },
  { word: 'happy', size: 26, color: '#22c55e' },
  { word: 'anxious', size: 24, color: '#f59e0b' },
  { word: 'hopeful', size: 22, color: '#6366f1' },
  { word: 'calm', size: 20, color: '#14b8a6' },
  { word: 'content', size: 18, color: '#10b981' },
  { word: 'tired', size: 16, color: '#a3a3a3' },
];

const journalEntries = [
  { date: 'Feb 20', title: 'Feeling accomplished today', sentiment: 'positive' },
  { date: 'Feb 19', title: 'Stressed about work deadline', sentiment: 'negative' },
  { date: 'Feb 18', title: 'Nice walk in the park', sentiment: 'positive' },
  { date: 'Feb 17', title: 'Regular day, nothing special', sentiment: 'neutral' },
  { date: 'Feb 16', title: 'Great time with friends', sentiment: 'positive' },
  { date: 'Feb 15', title: 'Meditation helped me relax', sentiment: 'positive' },
];

export function JournalAnalytics() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-1">Journal Analytics</h2>
        <p className="text-neutral-500">Insights from your personal reflections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sentiment Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <FileText className="size-5 text-indigo-500" />
            <h3 className="text-neutral-900">Sentiment Distribution</h3>
          </div>

          <div className="h-64 flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
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

          <div className="space-y-3">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-neutral-700 text-sm">{item.name}</span>
                </div>
                <span className="text-neutral-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Word Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-5 text-teal-600" />
            <h3 className="text-neutral-900">Common Emotions</h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-8 bg-neutral-50 rounded-xl min-h-[240px]">
            {emotionalWords.map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.2 }}
                style={{
                  fontSize: `${item.size}px`,
                  color: item.color,
                  cursor: 'pointer',
                }}
                className="select-none transition-transform"
              >
                {item.word}
              </motion.span>
            ))}
          </div>

          <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
            <p className="text-teal-900 text-sm">
              Most used word this week: <span className="font-semibold">grateful</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Timeline of Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
      >
        <h3 className="text-neutral-900 mb-6">Recent Journal Entries</h3>

        <div className="space-y-3">
          {journalEntries.map((entry, index) => {
            const sentimentColors = {
              positive: 'bg-green-50 border-green-200 text-green-700',
              neutral: 'bg-neutral-50 border-neutral-200 text-neutral-700',
              negative: 'bg-red-50 border-red-200 text-red-700',
            };

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 text-neutral-500 text-sm">{entry.date}</div>
                  <div className="w-1 h-8 bg-neutral-200 rounded-full" />
                  <span className="text-neutral-900">{entry.title}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs border capitalize ${sentimentColors[entry.sentiment as keyof typeof sentimentColors]
                    }`}
                >
                  {entry.sentiment}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
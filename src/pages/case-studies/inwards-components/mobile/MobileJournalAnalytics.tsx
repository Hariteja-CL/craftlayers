import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const sentimentData = [
  { name: 'Positive', value: 67, color: '#86efac' },
  { name: 'Neutral', value: 23, color: '#d4d4d8' },
  { name: 'Negative', value: 10, color: '#fca5a5' },
];

const emotionalWords = [
  { word: 'grateful', size: 24, color: '#10b981' },
  { word: 'peaceful', size: 20, color: '#14b8a6' },
  { word: 'happy', size: 18, color: '#22c55e' },
  { word: 'anxious', size: 16, color: '#f59e0b' },
  { word: 'hopeful', size: 16, color: '#6366f1' },
  { word: 'calm', size: 14, color: '#14b8a6' },
  { word: 'content', size: 14, color: '#10b981' },
  { word: 'tired', size: 12, color: '#a3a3a3' },
];

const journalEntries = [
  { date: 'Feb 20', title: 'Feeling accomplished', sentiment: 'positive' },
  { date: 'Feb 19', title: 'Work stress', sentiment: 'negative' },
  { date: 'Feb 18', title: 'Nice walk in park', sentiment: 'positive' },
  { date: 'Feb 17', title: 'Regular day', sentiment: 'neutral' },
  { date: 'Feb 16', title: 'Time with friends', sentiment: 'positive' },
];

interface MobileJournalAnalyticsProps {
  onBack?: () => void;
}

export function MobileJournalAnalytics({ onBack }: MobileJournalAnalyticsProps) {
  return (
    <div className="w-full max-w-[390px] mx-auto bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-neutral-200">
        <button onClick={onBack} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
          <ChevronLeft className="size-5 text-neutral-900" />
        </button>
        <div>
          <h4 className="text-neutral-900">Journal Analytics</h4>
          <p className="text-neutral-500 text-xs">Your emotional insights</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        {/* Sentiment Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="size-4 text-orange-500" />
            <p className="text-neutral-900 text-sm">Sentiment Distribution</p>
          </div>

          <div className="h-[160px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
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
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-neutral-700 text-xs">{item.name}</span>
                </div>
                <span className="text-neutral-900 text-sm">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Word Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <p className="text-neutral-900 text-sm mb-4">Common Emotions</p>

          <div className="flex flex-wrap items-center justify-center gap-3 py-6 bg-neutral-50 rounded-xl min-h-[140px]">
            {emotionalWords.map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  fontSize: `${item.size}px`,
                  color: item.color,
                }}
                className="select-none"
              >
                {item.word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Journal Timeline */}
        <div>
          <p className="text-neutral-700 text-sm mb-3 px-1">Recent Entries</p>

          <div className="space-y-2">
            {journalEntries.map((entry, index) => {
              const sentimentColors = {
                positive: 'bg-green-50 border-green-200 text-green-700',
                neutral: 'bg-neutral-50 border-neutral-200 text-neutral-700',
                negative: 'bg-red-50 border-red-200 text-red-700',
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-white p-3 rounded-xl border border-neutral-200 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-900 text-sm mb-0.5">{entry.title}</p>
                      <p className="text-neutral-500 text-xs">{entry.date}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs border capitalize whitespace-nowrap ${sentimentColors[entry.sentiment as keyof typeof sentimentColors]
                        }`}
                    >
                      {entry.sentiment}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const sentimentData = [
  { name: 'Positive', value: 67, color: '#22c55e' },
  { name: 'Neutral', value: 23, color: '#a3a3a3' },
  { name: 'Negative', value: 10, color: '#ef4444' },
];

const weeklySentimentData = [
  { week: 'Week 1', positive: 55, neutral: 30, negative: 15 },
  { week: 'Week 2', positive: 62, neutral: 25, negative: 13 },
  { week: 'Week 3', positive: 58, neutral: 28, negative: 14 },
  { week: 'Week 4', positive: 67, neutral: 23, negative: 10 },
];

const emotionSpikes = [
  { id: 1, date: 'Feb 19', emotion: 'Anxiety', intensity: 'High', trigger: 'Work presentation', context: 'Mentioned fear of public speaking' },
  { id: 2, date: 'Feb 17', emotion: 'Joy', intensity: 'High', trigger: 'Family gathering', context: 'Spent quality time with loved ones' },
  { id: 3, date: 'Feb 14', emotion: 'Frustration', intensity: 'Medium', trigger: 'Project setback', context: 'Team communication issues' },
  { id: 4, date: 'Feb 10', emotion: 'Gratitude', intensity: 'High', trigger: 'Therapy breakthrough', context: 'New coping strategy learned' },
];

const emotionalWords = [
  { word: 'grateful', size: 36, color: '#22c55e', frequency: 24 },
  { word: 'anxious', size: 32, color: '#f59e0b', frequency: 18 },
  { word: 'happy', size: 30, color: '#3b82f6', frequency: 16 },
  { word: 'peaceful', size: 28, color: '#8b5cf6', frequency: 14 },
  { word: 'stressed', size: 26, color: '#ef4444', frequency: 12 },
  { word: 'hopeful', size: 28, color: '#10b981', frequency: 14 },
  { word: 'tired', size: 22, color: '#f97316', frequency: 9 },
  { word: 'calm', size: 26, color: '#6366f1', frequency: 12 },
  { word: 'overwhelmed', size: 24, color: '#dc2626', frequency: 10 },
  { word: 'content', size: 24, color: '#14b8a6', frequency: 10 },
  { word: 'worried', size: 20, color: '#ea580c', frequency: 8 },
  { word: 'relaxed', size: 22, color: '#059669', frequency: 9 },
];

export function SentimentAnalysis() {
  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-2">Journal Sentiment Analysis</h2>
        <p className="text-neutral-600">Deep dive into emotional patterns from patient journal entries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sentiment Pie Chart */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="size-5 text-purple-500" />
            <h3 className="text-neutral-900">Overall Sentiment Distribution</h3>
          </div>

          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
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

          <div className="mt-4 space-y-3">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-neutral-900 text-sm">{item.name}</span>
                </div>
                <span className="text-neutral-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Sentiment Summary */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-5 text-green-500" />
            <h3 className="text-neutral-900">Weekly Sentiment Trends</h3>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="week" stroke="#737373" style={{ fontSize: '14px' }} />
                <YAxis
                  stroke="#737373"
                  style={{ fontSize: '14px' }}
                  label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                />
                <Bar dataKey="positive" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                <Bar dataKey="neutral" stackId="a" fill="#a3a3a3" radius={[0, 0, 0, 0]} />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-900 text-sm mb-1">Positive Trend Detected</p>
            <p className="text-green-700 text-sm">
              Positive sentiment increased by 12% over the last month, indicating improved emotional well-being.
            </p>
          </div>
        </div>
      </div>

      {/* Word Cloud Visualization */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 mb-8">
        <h3 className="text-neutral-900 mb-6">Emotional Word Cluster</h3>

        <div className="flex flex-wrap items-center justify-center gap-4 py-12 min-h-[320px] bg-neutral-50 rounded-xl">
          {emotionalWords.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.15 }}
              className="cursor-pointer transition-transform"
            >
              <span
                style={{
                  fontSize: `${item.size}px`,
                  color: item.color,
                }}
                className="select-none"
              >
                {item.word}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {emotionalWords.slice(0, 4).map((word, index) => (
            <div key={index} className="p-3 bg-neutral-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: word.color }} />
                <span className="text-neutral-900 text-sm capitalize">{word.word}</span>
              </div>
              <p className="text-neutral-500 text-xs">{word.frequency} mentions</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion Spikes List */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="size-5 text-orange-500" />
          <h3 className="text-neutral-900">Notable Emotion Spikes</h3>
        </div>

        <div className="space-y-4">
          {emotionSpikes.map((spike) => {
            const isNegative = ['Anxiety', 'Frustration'].includes(spike.emotion);
            const bgColor = isNegative ? 'bg-red-50' : 'bg-green-50';
            const borderColor = isNegative ? 'border-red-200' : 'border-green-200';
            const textColor = isNegative ? 'text-red-900' : 'text-green-900';
            const subTextColor = isNegative ? 'text-red-700' : 'text-green-700';

            return (
              <motion.div
                key={spike.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border ${borderColor} ${bgColor}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className={`${textColor} mb-1`}>{spike.emotion}</h4>
                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                      <span>{spike.date}</span>
                      <span>•</span>
                      <span className={spike.intensity === 'High' ? 'text-red-600' : 'text-yellow-600'}>
                        {spike.intensity} Intensity
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-neutral-500 text-sm">Trigger: </span>
                    <span className={`${subTextColor} text-sm`}>{spike.trigger}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-sm">Context: </span>
                    <span className={`${subTextColor} text-sm`}>{spike.context}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

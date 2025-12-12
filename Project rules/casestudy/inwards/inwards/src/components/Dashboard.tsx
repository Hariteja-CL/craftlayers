import { Flame, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const moodScore = 78;
  const userName = 'Sarah';
  
  const streakDays = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: true },
    { day: 'F', completed: true },
    { day: 'S', completed: false },
    { day: 'S', completed: false },
  ];

  const sentiment = {
    positive: 67,
    neutral: 23,
    negative: 10,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-1">Good Morning, {userName}</h2>
        <p className="text-neutral-500">Here's your wellness summary for today</p>
      </div>

      {/* Layout: 1 large card top */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-neutral-900 mb-1">Today's Mood</h3>
              <p className="text-neutral-500 text-sm">How you're feeling right now</p>
            </div>
            <div className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-lg">
              Great Progress
            </div>
          </div>

          <div className="flex items-center justify-center">
            {/* Radial Mood Indicator */}
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#f5f5f5"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#6366f1"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - moodScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl mb-2">😊</span>
                <h1 className="text-neutral-900 mb-1">{moodScore}</h1>
                <span className="text-neutral-500 text-sm">Mood Score</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Layout: 2 small cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Meditation Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Flame className="size-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-neutral-900">Meditation Streak</h3>
              <p className="text-neutral-500 text-sm">5 days in a row</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {streakDays.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${
                    item.completed
                      ? 'bg-indigo-500 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {item.day}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Journal Sentiment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-50 rounded-lg">
              <BookOpen className="size-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-neutral-900">Journal Sentiment</h3>
              <p className="text-neutral-500 text-sm">This week's emotions</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-700 text-sm">Positive</span>
              <span className="text-neutral-900">{sentiment.positive}%</span>
            </div>
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all"
                style={{ width: `${sentiment.positive}%` }}
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-700 text-sm">Neutral</span>
              <span className="text-neutral-900">{sentiment.neutral}%</span>
            </div>
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-400 rounded-full transition-all"
                style={{ width: `${sentiment.neutral}%` }}
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-700 text-sm">Negative</span>
              <span className="text-neutral-900">{sentiment.negative}%</span>
            </div>
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full transition-all"
                style={{ width: `${sentiment.negative}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Layout: 1 long card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Sparkles className="size-6 text-indigo-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 mb-2">Recommended for You</h3>
              <p className="text-neutral-600 text-sm mb-4 max-w-2xl">
                Based on your recent mood patterns, we recommend trying a 10-minute guided meditation
                focused on stress relief and mindfulness.
              </p>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-sm">
                Start Session
              </button>
            </div>
          </div>
          <div className="px-3 py-1 bg-white rounded-lg text-neutral-600 text-xs">
            10 min
          </div>
        </div>
      </motion.div>
    </div>
  );
}
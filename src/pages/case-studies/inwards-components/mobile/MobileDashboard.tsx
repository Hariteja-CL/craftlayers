import { Settings, User, Flame, Clock, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileDashboardProps {
  onNavigateToMood?: () => void;
  onNavigateToMeditation?: () => void;
  onNavigateToJournal?: () => void;
  onNavigateToRecommendations?: () => void;
}

export function MobileDashboard({
  onNavigateToMood,
  onNavigateToMeditation,
  onNavigateToJournal,
  onNavigateToRecommendations
}: MobileDashboardProps) {
  const moodScore = 78;
  const userName = 'Hariteja';

  const streakDays = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: true },
    { day: 'F', completed: true },
    { day: 'S', completed: false },
    { day: 'S', completed: false },
  ];

  const totalMinutes = 285;

  const sentiment = {
    positive: 67,
    neutral: 23,
    negative: 10,
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <User className="size-5 text-white" />
          </div>
          <div>
            <p className="text-neutral-900 text-sm">Welcome back</p>
            <p className="text-neutral-500 text-xs">Monday, Feb 20</p>
          </div>
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
          <Settings className="size-5 text-neutral-600" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-5">
        {/* Greeting */}
        <div>
          <h4 className="text-neutral-900 mb-1">Good Morning, {userName}</h4>
          <p className="text-neutral-600 text-sm">Here's your wellness summary</p>
        </div>

        {/* Mood Indicator Card */}
        <motion.button
          onClick={onNavigateToMood}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="w-full text-left bg-white p-5 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all"
        >
          <p className="text-neutral-900 text-sm mb-4">Today's Mood</p>

          <div className="flex flex-col items-center py-6">
            {/* Circular Progress */}
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#f5f5f5"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#FF9933"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - moodScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl mb-1">😊</span>
                <p className="text-neutral-900 text-2xl">{moodScore}</p>
              </div>
            </div>

            <div className="px-4 py-2 bg-orange-50 rounded-lg">
              <p className="text-orange-700 text-sm">Feeling Calm</p>
            </div>
          </div>
        </motion.button>

        {/* Meditation Streak */}
        <motion.button
          onClick={onNavigateToMeditation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="w-full text-left bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Flame className="size-4 text-orange-500" />
            </div>
            <div>
              <p className="text-neutral-900 text-sm">Meditation Streak</p>
              <p className="text-neutral-500 text-xs">5 days in a row</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            {streakDays.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs transition-all ${item.completed
                      ? 'bg-orange-500 text-white'
                      : 'bg-neutral-100 text-neutral-400'
                    }`}
                >
                  {item.day}
                </div>
              </div>
            ))}
          </div>
        </motion.button>

        {/* Total Minutes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="size-4 text-orange-500" />
              </div>
              <div>
                <p className="text-neutral-900 text-sm">Total Minutes</p>
                <p className="text-neutral-500 text-xs">This month</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-neutral-900 text-2xl">{totalMinutes}</p>
              <p className="text-neutral-500 text-xs">minutes</p>
            </div>
          </div>
        </motion.div>

        {/* Journal Sentiment Summary */}
        <motion.button
          onClick={onNavigateToJournal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="w-full text-left bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="size-4 text-blue-600" />
            </div>
            <p className="text-neutral-900 text-sm">Journal Sentiment</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-600">Positive</span>
              <span className="text-neutral-900">{sentiment.positive}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${sentiment.positive}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-600">Neutral</span>
              <span className="text-neutral-900">{sentiment.neutral}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-400 rounded-full"
                style={{ width: `${sentiment.neutral}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-neutral-600">Negative</span>
              <span className="text-neutral-900">{sentiment.negative}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full"
                style={{ width: `${sentiment.negative}%` }}
              />
            </div>
          </div>
        </motion.button>

        {/* Recommendation of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white rounded-lg shadow-sm flex-shrink-0">
              <Sparkles className="size-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-neutral-900 text-sm mb-1">Recommended for You</p>
              <p className="text-neutral-600 text-xs mb-3">
                Try a 10-minute guided meditation for stress relief
              </p>
              <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition-colors">
                Start Session
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Trophy, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const meditationData = [
  { date: 'Jan 1', minutes: 10 },
  { date: 'Jan 2', minutes: 15 },
  { date: 'Jan 3', minutes: 12 },
  { date: 'Jan 4', minutes: 20 },
  { date: 'Jan 5', minutes: 18 },
  { date: 'Jan 6', minutes: 25 },
  { date: 'Jan 7', minutes: 15 },
  { date: 'Jan 8', minutes: 30 },
  { date: 'Jan 9', minutes: 20 },
  { date: 'Jan 10', minutes: 22 },
  { date: 'Jan 11', minutes: 28 },
  { date: 'Jan 12', minutes: 25 },
  { date: 'Jan 13', minutes: 30 },
  { date: 'Jan 14', minutes: 35 },
];

const achievements = [
  { id: 1, title: '7-Day Streak', icon: '🔥', unlocked: true },
  { id: 2, title: '100 Minutes', icon: '⏰', unlocked: true },
  { id: 3, title: 'Early Bird', icon: '🌅', unlocked: true },
  { id: 4, title: '30-Day Streak', icon: '🏆', unlocked: false },
];

export function MeditationInsights() {
  const totalMinutes = 285;
  const currentStreak = 7;
  const longestStreak = 12;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-1">Meditation Insights</h2>
        <p className="text-neutral-500">Your mindfulness practice at a glance</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Minutes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Clock className="size-5 text-indigo-500" />
            </div>
            <h3 className="text-neutral-900">Total Minutes</h3>
          </div>
          <div className="flex items-end gap-2">
            <h1 className="text-neutral-900">{totalMinutes}</h1>
            <span className="text-neutral-500 text-xl mb-2">min</span>
          </div>
          <p className="text-neutral-500 text-sm mt-2">This month</p>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Flame className="size-5 text-orange-500" />
            </div>
            <h3 className="text-neutral-900">Current Streak</h3>
          </div>
          <div className="flex items-end gap-2">
            <h1 className="text-neutral-900">{currentStreak}</h1>
            <span className="text-neutral-500 text-xl mb-2">days</span>
          </div>
          <p className="text-neutral-500 text-sm mt-2">Keep it going!</p>
        </motion.div>

        {/* Longest Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Target className="size-5 text-teal-600" />
            </div>
            <h3 className="text-neutral-900">Longest Streak</h3>
          </div>
          <div className="flex items-end gap-2">
            <h1 className="text-neutral-900">{longestStreak}</h1>
            <span className="text-neutral-500 text-xl mb-2">days</span>
          </div>
          <p className="text-neutral-500 text-sm mt-2">Personal best</p>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm mb-6"
      >
        <h3 className="text-neutral-900 mb-6">Last 14 Days</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={meditationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#a3a3a3"
                style={{ fontSize: '12px' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#a3a3a3"
                style={{ fontSize: '14px' }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Achievement Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="size-5 text-yellow-500" />
          <h3 className="text-neutral-900">Achievements</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border text-center transition-all ${achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                  : 'bg-neutral-50 border-neutral-200 opacity-60'
                }`}
            >
              <div className="text-4xl mb-3">{achievement.icon}</div>
              <h4 className="text-neutral-900 text-sm mb-1">{achievement.title}</h4>
              {achievement.unlocked ? (
                <span className="text-yellow-600 text-xs">Unlocked</span>
              ) : (
                <span className="text-neutral-500 text-xs">Locked</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
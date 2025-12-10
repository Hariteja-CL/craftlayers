import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, Flame, Clock, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const meditationData = [
  { date: '8', minutes: 10 },
  { date: '9', minutes: 15 },
  { date: '10', minutes: 12 },
  { date: '11', minutes: 20 },
  { date: '12', minutes: 18 },
  { date: '13', minutes: 25 },
  { date: '14', minutes: 15 },
  { date: '15', minutes: 30 },
  { date: '16', minutes: 20 },
  { date: '17', minutes: 22 },
  { date: '18', minutes: 28 },
  { date: '19', minutes: 25 },
  { date: '20', minutes: 30 },
  { date: '21', minutes: 35 },
];

const achievements = [
  { id: 1, title: '7-Day Streak', icon: '🔥', unlocked: true },
  { id: 2, title: '100 Minutes', icon: '⏰', unlocked: true },
  { id: 3, title: 'Early Bird', icon: '🌅', unlocked: true },
  { id: 4, title: '30-Day Streak', icon: '🏆', unlocked: false },
];

interface MobileMeditationInsightsProps {
  onBack?: () => void;
}

export function MobileMeditationInsights({ onBack }: MobileMeditationInsightsProps) {
  const totalMinutes = 285;
  const currentStreak = 7;

  return (
    <div className="w-full max-w-[390px] mx-auto bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-neutral-200">
        <button onClick={onBack} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
          <ChevronLeft className="size-5 text-neutral-900" />
        </button>
        <div>
          <h4 className="text-neutral-900">Meditation Insights</h4>
          <p className="text-neutral-500 text-xs">Your practice stats</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        {/* Metric Card - Total Minutes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-xl shadow-sm text-white"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="size-5" />
            <p className="text-sm opacity-90">Total Minutes</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-5xl">{totalMinutes}</p>
            <span className="text-xl opacity-90 mb-2">min</span>
          </div>
          <p className="text-sm opacity-75 mt-2">This month</p>
        </motion.div>

        {/* Streak Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 rounded-xl">
                <Flame className="size-5 text-orange-500" />
              </div>
              <div>
                <p className="text-neutral-900 text-sm">Current Streak</p>
                <p className="text-neutral-500 text-xs">Keep it going!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-neutral-900 text-3xl">{currentStreak}</p>
              <p className="text-neutral-500 text-xs">days</p>
            </div>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <p className="text-neutral-900 text-sm mb-4">Last 14 Days Activity</p>

          <div className="h-[180px] w-full -mx-2">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={meditationData}>
                <XAxis
                  dataKey="date"
                  stroke="#a3a3a3"
                  style={{ fontSize: '10px' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#a3a3a3"
                  style={{ fontSize: '10px' }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="minutes" fill="#FF9933" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="size-4 text-yellow-500" />
            <p className="text-neutral-900 text-sm">Achievements</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl border text-center transition-all ${achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-neutral-50 border-neutral-200 opacity-60'
                  }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-neutral-900 text-xs mb-1">{achievement.title}</p>
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
    </div>
  );
}
import { Play, FileText, Wind, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const recommendations = [
  {
    id: 1,
    type: 'meditation',
    icon: Play,
    title: 'Morning Mindfulness',
    description: 'Start your day with a 10-minute guided meditation focused on gratitude and positive intention.',
    duration: '10 min',
    color: 'indigo',
  },
  {
    id: 2,
    type: 'journal',
    icon: FileText,
    title: 'Reflective Journaling',
    description: 'What are three things that brought you joy this week? Take a moment to write about them.',
    duration: '15 min',
    color: 'teal',
  },
  {
    id: 3,
    type: 'breathing',
    icon: Wind,
    title: '4-7-8 Breathing Exercise',
    description: 'Reduce stress and anxiety with this simple breathing technique. Perfect for a midday reset.',
    duration: '5 min',
    color: 'purple',
  },
];

const tasks = [
  { id: 1, task: 'Complete morning meditation', completed: true },
  { id: 2, task: 'Log today\'s mood', completed: true },
  { id: 3, task: 'Journal about gratitude', completed: false },
  { id: 4, task: 'Evening breathing exercise', completed: false },
];

export function Recommendations() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-1">Personalized Recommendations</h2>
        <p className="text-neutral-500">Activities designed just for you based on your wellness journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          const colorMap = {
            indigo: {
              bg: 'bg-indigo-50',
              border: 'border-indigo-200',
              icon: 'bg-indigo-100 text-indigo-600',
              button: 'bg-indigo-500 hover:bg-indigo-600',
            },
            teal: {
              bg: 'bg-teal-50',
              border: 'border-teal-200',
              icon: 'bg-teal-100 text-teal-600',
              button: 'bg-teal-600 hover:bg-teal-700',
            },
            purple: {
              bg: 'bg-purple-50',
              border: 'border-purple-200',
              icon: 'bg-purple-100 text-purple-600',
              button: 'bg-purple-500 hover:bg-purple-600',
            },
          };

          const colors = colorMap[rec.color as keyof typeof colorMap];

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className={`${colors.bg} border ${colors.border} p-6 rounded-2xl shadow-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${colors.icon} rounded-xl`}>
                  <Icon className="size-6" />
                </div>
                <span className="px-3 py-1 bg-white rounded-lg text-neutral-600 text-xs">
                  {rec.duration}
                </span>
              </div>

              <h3 className="text-neutral-900 mb-2">{rec.title}</h3>
              <p className="text-neutral-600 text-sm mb-6">{rec.description}</p>

              <button className={`w-full px-4 py-3 ${colors.button} text-white rounded-xl transition-colors text-sm`}>
                Start Now
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Tasks for Today */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <CheckSquare className="size-5 text-indigo-500" />
          <h3 className="text-neutral-900">Tasks for Today</h3>
        </div>

        <div className="space-y-3">
          {tasks.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${item.completed
                  ? 'bg-neutral-50 border-neutral-200'
                  : 'bg-white border-neutral-200 hover:border-indigo-300'
                }`}
            >
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${item.completed
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-neutral-300 hover:border-indigo-400'
                  }`}
              >
                {item.completed && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`flex-1 ${item.completed
                    ? 'text-neutral-500 line-through'
                    : 'text-neutral-900'
                  }`}
              >
                {item.task}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700 text-sm">Daily Progress</span>
            <span className="text-indigo-600">2/4 completed</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: '50%' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
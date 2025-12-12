import { ChevronLeft, Play, FileText, Wind, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';

const recommendations = [
  {
    id: 1,
    icon: Play,
    title: 'Morning Mindfulness',
    description: 'Start your day with a guided meditation focused on gratitude.',
    duration: '10 min',
    color: 'orange',
  },
  {
    id: 2,
    icon: FileText,
    title: 'Reflective Journaling',
    description: 'Write about three things that brought you joy this week.',
    duration: '15 min',
    color: 'blue',
  },
  {
    id: 3,
    icon: Wind,
    title: '4-7-8 Breathing',
    description: 'Reduce stress with this simple breathing technique.',
    duration: '5 min',
    color: 'orange',
  },
];

const tasks = [
  { id: 1, task: 'Complete morning meditation', completed: true },
  { id: 2, task: 'Log today\'s mood', completed: true },
  { id: 3, task: 'Journal about gratitude', completed: false },
  { id: 4, task: 'Evening breathing exercise', completed: false },
];

interface MobileRecommendationsProps {
  onBack?: () => void;
}

export function MobileRecommendations({ onBack }: MobileRecommendationsProps) {
  return (
    <div className="w-full max-w-[390px] mx-auto bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-neutral-200">
        <button onClick={onBack} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
          <ChevronLeft className="size-5 text-neutral-900" />
        </button>
        <div>
          <h4 className="text-neutral-900">Recommendations</h4>
          <p className="text-neutral-500 text-xs">Personalized for you</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        {/* Recommendation Cards */}
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          const colorMap = {
            orange: {
              bg: 'bg-orange-50',
              border: 'border-orange-200',
              icon: 'bg-orange-100 text-orange-600',
              button: 'bg-orange-500 active:bg-orange-600',
            },
            blue: {
              bg: 'bg-blue-50',
              border: 'border-blue-200',
              icon: 'bg-blue-100 text-blue-600',
              button: 'bg-blue-600 active:bg-blue-700',
            },
          };

          const colors = colorMap[rec.color as keyof typeof colorMap];

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${colors.bg} border ${colors.border} p-4 rounded-xl shadow-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 ${colors.icon} rounded-lg`}>
                  <Icon className="size-5" />
                </div>
                <span className="px-2.5 py-1 bg-white rounded-lg text-neutral-600 text-xs">
                  {rec.duration}
                </span>
              </div>

              <p className="text-neutral-900 text-sm mb-1">{rec.title}</p>
              <p className="text-neutral-600 text-xs mb-4 leading-relaxed">{rec.description}</p>

              <button className={`w-full px-4 py-2.5 ${colors.button} text-white rounded-lg transition-colors text-sm`}>
                Start Now
              </button>
            </motion.div>
          );
        })}

        {/* Tasks for Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="size-4 text-indigo-500" />
            <p className="text-neutral-900 text-sm">Tasks for Today</p>
          </div>

          <div className="space-y-2.5">
            {tasks.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  item.completed
                    ? 'bg-neutral-50 border-neutral-200'
                    : 'bg-white border-neutral-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    item.completed
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-neutral-300'
                  }`}
                >
                  {item.completed && (
                    <svg
                      className="w-3 h-3 text-white"
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
                  className={`flex-1 text-sm ${
                    item.completed
                      ? 'text-neutral-500 line-through'
                      : 'text-neutral-900'
                  }`}
                >
                  {item.task}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-700 text-xs">Daily Progress</span>
              <span className="text-indigo-600 text-sm">2/4</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: '50%' }} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
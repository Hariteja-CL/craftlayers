import { User, Stethoscope, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  onSelectRole: (role: 'user' | 'therapist') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-neutral-900 mb-4">Welcome to Inwards</h1>
          <p className="text-neutral-600 text-xl">
            Your comprehensive wellness platform
          </p>
          <p className="text-neutral-500 mt-2">
            Please select your role to continue
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Card */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => onSelectRole('user')}
            className="bg-white p-8 rounded-2xl border-2 border-neutral-200 hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                <User className="size-8 text-indigo-500" />
              </div>
              <ArrowRight className="size-6 text-neutral-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-neutral-900 mb-3">User Dashboard</h2>
            <p className="text-neutral-600 mb-6">
              Access your personal wellness journey, track mood patterns, meditation progress,
              and journal insights.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span>Mood tracking & trends</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span>Meditation insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span>Journal analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span>Daily recommendations</span>
              </div>
            </div>
          </motion.button>

          {/* Therapist Card */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => onSelectRole('therapist')}
            className="bg-white p-8 rounded-2xl border-2 border-neutral-200 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
                <Stethoscope className="size-8 text-purple-500" />
              </div>
              <ArrowRight className="size-6 text-neutral-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-neutral-900 mb-3">Therapist Dashboard</h2>
            <p className="text-neutral-600 mb-6">
              Monitor patient progress, review wellness metrics, and provide personalized care
              recommendations.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span>Patient overview</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span>Progress tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span>Clinical insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span>Care management</span>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-neutral-500 text-sm mt-8"
        >
          Secure • Private • HIPAA Compliant
        </motion.p>
      </div>
    </div>
  );
}

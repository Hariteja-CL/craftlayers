import { motion } from 'motion/react';
import { User, Stethoscope, ArrowRight, Activity, TrendingUp, Shield } from 'lucide-react';

interface MainLandingPageProps {
  onSelectUser: () => void;
  onSelectTherapist: () => void;
}

export function MainLandingPage({ onSelectUser, onSelectTherapist }: MainLandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50/30 to-neutral-50">
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Activity className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-neutral-900 mb-4">Inwards Wellness Platform</h1>
          <p className="text-neutral-600 text-xl max-w-2xl mx-auto">
            A comprehensive mental health platform connecting users and therapists through data-driven insights
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* User Dashboard CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg hover:shadow-2xl transition-all p-8 h-full">
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="size-10 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-neutral-900 mb-3">User Dashboard</h2>
                  <p className="text-neutral-600 mb-6">
                    Track your wellness journey with personalized insights, mood trends, meditation progress, and journal analytics on mobile.
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="size-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-700 text-sm">Mood & emotional tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="size-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-700 text-sm">Meditation insights & streaks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="size-4 text-blue-600" />
                      </div>
                      <span className="text-neutral-700 text-sm">Mobile-first 390px design</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={onSelectUser}
                  className="w-full px-6 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group-hover:gap-4"
                >
                  <span className="text-lg">View User Dashboard</span>
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Therapist Dashboard CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group"
          >
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg hover:shadow-2xl transition-all p-8 h-full">
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Stethoscope className="size-10 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-neutral-900 mb-3">Therapist Dashboard</h2>
                  <p className="text-neutral-600 mb-6">
                    Monitor patient wellness, analyze emotional trends, manage sessions, and take clinical actions with comprehensive insights.
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="size-4 text-orange-600" />
                      </div>
                      <span className="text-neutral-700 text-sm">Patient overview & risk alerts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="size-4 text-orange-600" />
                      </div>
                      <span className="text-neutral-700 text-sm">Emotional timeline analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="size-4 text-orange-600" />
                      </div>
                      <span className="text-neutral-700 text-sm">Clinical actions & notes</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={onSelectTherapist}
                  className="w-full px-6 py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group-hover:gap-4"
                >
                  <span className="text-lg">View Therapist Dashboard</span>
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200 p-6 text-center">
              <p className="text-4xl text-neutral-900 mb-2">5</p>
              <p className="text-neutral-600 text-sm">User Screens</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200 p-6 text-center">
              <p className="text-4xl text-neutral-900 mb-2">5</p>
              <p className="text-neutral-600 text-sm">Therapist Screens</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200 p-6 text-center">
              <p className="text-4xl text-neutral-900 mb-2">390px</p>
              <p className="text-neutral-600 text-sm">Mobile Optimized</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-neutral-200 p-6 text-center">
              <p className="text-4xl text-neutral-900 mb-2">100%</p>
              <p className="text-neutral-600 text-sm">Production Ready</p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-neutral-500 text-sm">
            Built with React, Tailwind CSS, Motion, and Recharts • CraftLayers Design System
          </p>
        </motion.div>
      </div>
    </div>
  );
}
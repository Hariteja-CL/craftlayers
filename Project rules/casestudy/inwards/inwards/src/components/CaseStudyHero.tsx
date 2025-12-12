import { ArrowRight, User, Stethoscope, Sparkles, BarChart3, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface CaseStudyHeroProps {
  onOpenUserDashboard: () => void;
  onOpenTherapistDashboard: () => void;
}

export function CaseStudyHero({ onOpenUserDashboard, onOpenTherapistDashboard }: CaseStudyHeroProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-neutral-900">Inwards</h1>
              <p className="text-neutral-500 text-xs">Case Study</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
              Live Prototypes
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6">
              <Sparkles className="size-4 text-indigo-600" />
              <span className="text-indigo-600 text-sm">Mental Wellness Intelligence Platform</span>
            </div>

            <h1 className="text-neutral-900 mb-6 max-w-4xl mx-auto">
              Inwards — Mental Wellness Ecosystem
            </h1>

            <p className="text-neutral-600 text-xl max-w-3xl mx-auto leading-relaxed">
              A dual-experience system designed to empower users and enable psychiatrists with
              emotional insights, journaling analytics, and guided wellness journeys.
            </p>
          </motion.div>

          {/* Preview Frames */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* User Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              onClick={onOpenUserDashboard}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden hover:border-indigo-500 hover:shadow-2xl transition-all">
                {/* Preview Header */}
                <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <User className="size-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-neutral-900">User Dashboard</h3>
                        <p className="text-neutral-600 text-sm">Personal Wellness Experience</p>
                      </div>
                    </div>
                    <ArrowRight className="size-5 text-neutral-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <BarChart3 className="size-4" />
                    <span>5 Interactive Pages</span>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6 bg-gradient-to-br from-neutral-50 to-white min-h-[320px]">
                  <div className="space-y-4">
                    {/* Mock Dashboard Elements */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 bg-white rounded-xl border border-neutral-200 p-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg mb-2" />
                        <div className="h-2 bg-neutral-200 rounded w-16" />
                      </div>
                      <div className="h-20 bg-white rounded-xl border border-neutral-200 p-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg mb-2" />
                        <div className="h-2 bg-neutral-200 rounded w-16" />
                      </div>
                      <div className="h-20 bg-white rounded-xl border border-neutral-200 p-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg mb-2" />
                        <div className="h-2 bg-neutral-200 rounded w-16" />
                      </div>
                    </div>

                    <div className="h-40 bg-white rounded-xl border border-neutral-200 p-4">
                      <div className="h-2 bg-neutral-200 rounded w-32 mb-4" />
                      <div className="flex items-end gap-2 h-24">
                        <div className="flex-1 bg-indigo-200 rounded-t" style={{ height: '60%' }} />
                        <div className="flex-1 bg-indigo-300 rounded-t" style={{ height: '75%' }} />
                        <div className="flex-1 bg-indigo-400 rounded-t" style={{ height: '85%' }} />
                        <div className="flex-1 bg-indigo-500 rounded-t" style={{ height: '90%' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-white rounded-xl border border-neutral-200 p-3">
                        <div className="h-2 bg-neutral-200 rounded w-20 mb-2" />
                        <div className="h-2 bg-neutral-200 rounded w-12" />
                      </div>
                      <div className="h-16 bg-white rounded-xl border border-neutral-200 p-3">
                        <div className="h-2 bg-neutral-200 rounded w-20 mb-2" />
                        <div className="h-2 bg-neutral-200 rounded w-12" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Footer */}
                <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-600">
                      Mood Tracking
                    </span>
                    <span className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-600">
                      Meditation Stats
                    </span>
                    <span className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-600">
                      Journal Analytics
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Therapist Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8 }}
              onClick={onOpenTherapistDashboard}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden hover:border-purple-500 hover:shadow-2xl transition-all">
                {/* Preview Header */}
                <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Stethoscope className="size-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-neutral-900">Therapist Dashboard</h3>
                        <p className="text-neutral-600 text-sm">Clinical Intelligence Portal</p>
                      </div>
                    </div>
                    <ArrowRight className="size-5 text-neutral-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <BarChart3 className="size-4" />
                    <span>5 Clinical Views</span>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6 bg-gradient-to-br from-neutral-50 to-white min-h-[320px]">
                  <div className="space-y-4">
                    {/* Mock Patient Table */}
                    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                      <div className="grid grid-cols-4 gap-2 p-3 bg-neutral-50 border-b border-neutral-200">
                        <div className="h-2 bg-neutral-300 rounded w-16" />
                        <div className="h-2 bg-neutral-300 rounded w-20" />
                        <div className="h-2 bg-neutral-300 rounded w-12" />
                        <div className="h-2 bg-neutral-300 rounded w-14" />
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-4 gap-2 p-3 border-b border-neutral-100">
                          <div className="h-2 bg-neutral-200 rounded w-20" />
                          <div className="h-2 bg-neutral-200 rounded w-16" />
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-1.5 bg-neutral-200 rounded-full" />
                            <div className="w-6 h-1.5 bg-purple-400 rounded-full" />
                          </div>
                          <span className="px-2 py-0.5 bg-green-100 rounded text-xs w-12 h-4" />
                        </div>
                      ))}
                    </div>

                    {/* Mock Chart */}
                    <div className="h-32 bg-white rounded-xl border border-neutral-200 p-4">
                      <div className="h-2 bg-neutral-200 rounded w-40 mb-3" />
                      <div className="flex items-end gap-1 h-20">
                        {[45, 52, 48, 58, 62, 67, 72].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-purple-400 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mock Alert Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-14 bg-red-50 rounded-xl border border-red-200 p-2">
                        <div className="h-2 bg-red-400 rounded w-20 mb-1" />
                        <div className="h-1.5 bg-red-300 rounded w-24" />
                      </div>
                      <div className="h-14 bg-yellow-50 rounded-xl border border-yellow-200 p-2">
                        <div className="h-2 bg-yellow-400 rounded w-20 mb-1" />
                        <div className="h-1.5 bg-yellow-300 rounded w-24" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Footer */}
                <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-600">
                      Patient Overview
                    </span>
                    <span className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-600">
                      Risk Monitoring
                    </span>
                    <span className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-neutral-600">
                      Clinical Actions
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h3 className="text-neutral-700 max-w-2xl mx-auto">
              Explore both perspectives — experience how wellness data transforms into insights.
            </h3>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onOpenUserDashboard}
              className="group flex items-center gap-3 px-8 py-4 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 hover:shadow-xl transition-all"
            >
              <User className="size-5" />
              <span>Open User Dashboard</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenTherapistDashboard}
              className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-700 rounded-2xl hover:border-purple-500 hover:shadow-xl transition-all"
            >
              <Stethoscope className="size-5" />
              <span>Open Therapist Dashboard</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-neutral-900 mb-4">Built with CraftLayers Design System</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              A comprehensive wellness platform following enterprise design standards with responsive
              layouts, accessible components, and seamless user experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Interactive Analytics',
                description: 'Real-time charts and data visualizations using Recharts with responsive containers',
                color: 'indigo',
              },
              {
                icon: Brain,
                title: 'Dual Perspectives',
                description: 'Separate interfaces for users and therapists with role-specific insights and actions',
                color: 'purple',
              },
              {
                icon: Sparkles,
                title: 'Modern Design',
                description: 'Clean aesthetics with 16px radius, 32px spacing, and smooth hover animations',
                color: 'pink',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`size-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

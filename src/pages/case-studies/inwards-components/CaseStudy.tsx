import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Brain,
  Shield,
  Sparkles,
  CheckCircle,
  Target,
} from "lucide-react";

interface CaseStudyProps {
  onViewPrototype: () => void;
  onViewUserDashboard: () => void;
  onViewTherapistDashboard: () => void;
}

export function CaseStudy({
  onViewPrototype,
  onViewUserDashboard,
  onViewTherapistDashboard,
}: CaseStudyProps) {
  const appScreens = [
    {
      id: 1,
      title: "Mood Tracking",
      color: "from-orange-400 to-orange-500",
    },
    {
      id: 2,
      title: "Meditation",
      color: "from-blue-400 to-blue-500",
    },
    {
      id: 3,
      title: "Journal",
      color: "from-purple-400 to-purple-500",
    },
    {
      id: 4,
      title: "Analytics",
      color: "from-green-400 to-green-500",
    },
    {
      id: 5,
      title: "Recommendations",
      color: "from-pink-400 to-pink-500",
    },
    {
      id: 6,
      title: "Progress",
      color: "from-indigo-400 to-indigo-500",
    },
  ];

  const userScreens = [
    {
      id: 1,
      title: "Dashboard Home",
      desc: "Wellness summary at a glance",
    },
    {
      id: 2,
      title: "Mood Trends",
      desc: "Emotional patterns over time",
    },
    {
      id: 3,
      title: "Journal Analytics",
      desc: "Sentiment insights",
    },
  ];

  const therapistScreens = [
    {
      id: 1,
      title: "Patient Overview",
      desc: "Risk scores and compliance",
    },
    {
      id: 2,
      title: "Emotional Timeline",
      desc: "Mood progression tracking",
    },
    {
      id: 3,
      title: "Actions Panel",
      desc: "Intervention tools",
    },
  ];

  const decisions = [
    {
      icon: Target,
      title: "Role-Based Architecture",
      points: [
        "Separate optimized experiences for users and therapists",
        "Mobile-first (390px) for users, desktop-optimized for specialists",
        "Context-appropriate navigation patterns for each role",
      ],
    },
    {
      icon: Brain,
      title: "Data Visualization Strategy",
      points: [
        "Clear sentiment analysis with color-coded insights",
        "Interactive charts using Recharts with explicit pixel dimensions",
        "Progressive disclosure: overview on dashboard, details on drill-down",
      ],
    },
    {
      icon: Shield,
      title: "Privacy-First Design",
      points: [
        "Therapist access limited to aggregated patient data",
        "Clear visual hierarchy for sensitive information",
        "Role-based permissions reflected in UI architecture",
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-neutral-900 mb-6">
            Inwards Wellness Platform
          </h1>
          <p className="text-neutral-600 text-xl max-w-[800px] mx-auto">
            Designing a role-based mental wellness platform that
            connects users with therapists through actionable
            insights and real-time monitoring.
          </p>
        </motion.div>
      </section>

      {/* Problem Summary */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-neutral-900 mb-8">
            The Challenge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl border border-neutral-200"
            >
              <ul className="space-y-3 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">
                    •
                  </span>
                  <span>
                    Users need a simple way to track mood,
                    meditation, and journaling without feeling
                    overwhelmed
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">
                    •
                  </span>
                  <span>
                    Therapists require real-time patient
                    insights but lack tools for efficient
                    monitoring across multiple patients
                  </span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl border border-neutral-200"
            >
              <ul className="space-y-3 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">
                    •
                  </span>
                  <span>
                    Existing platforms treat all users the same,
                    missing the distinct needs of individuals
                    vs. care providers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">
                    •
                  </span>
                  <span>
                    Data visualization must balance detail for
                    therapists with simplicity for users
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Users & Context */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-neutral-900 mb-8">
            Users & Context
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Persona Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl">
                  H
                </div>
                <div>
                  <h3 className="text-neutral-900 mb-1">
                    Hariteja
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    Working Professional, 28
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Target className="size-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700 text-sm">
                    Track daily mood patterns to manage work
                    stress
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="size-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700 text-sm">
                    Build consistent meditation habits on-the-go
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="size-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700 text-sm">
                    Journal insights without complex analysis
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Context Block */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                  DM
                </div>
                <div>
                  <h3 className="text-neutral-900 mb-1">
                    Dr. Martinez
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    Licensed Therapist
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Target className="size-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700 text-sm">
                    Monitor 20+ patients efficiently with risk
                    alerts
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="size-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700 text-sm">
                    Identify emotional trends before sessions
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="size-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700 text-sm">
                    Make data-driven intervention decisions
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Experience (Existing Screens) */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="mb-8">
            <h2 className="text-neutral-900 mb-3">
              App Experience
            </h2>
            <p className="text-neutral-600">
              Base experience that sets the foundation
            </p>
          </div>

          {/* Horizontal Scrolling Row */}
          <div className="overflow-x-auto pb-6 -mx-8 px-8">
            <div className="flex gap-6 w-max">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-shrink-0"
              >
                <img
                  src="figma:asset/222a962d5cca7401a3be29223b4221f9c3b2be01.png"
                  alt="Beginner's Mind Introduction meditation screen"
                  className="h-[480px] w-auto"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex-shrink-0"
              >
                <img
                  src="figma:asset/24a0a3bd547143f4d55f1ee9a4f29508fd7e37c2.png"
                  alt="Training Statistics screen showing activity breakdown"
                  className="h-[480px] w-auto"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0"
              >
                <img
                  src="figma:asset/71e765a5007bc7b8c8d3ef79a33cc195bc0d31cf.png"
                  alt="Journal entry screen with mood tracking"
                  className="h-[480px] w-auto"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Expansion */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-neutral-900 mb-12">
            Platform Expansion
          </h2>

          {/* User Dashboard Subsection */}
          <div className="mb-16">
            <div className="mb-8">
              <h3 className="text-neutral-900 mb-2">
                Platform Expansion
              </h3>
              <p className="text-neutral-600">
                Two role-based experiences optimized for their
                unique workflows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-orange-500 transition-all"
              >
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="size-7 text-orange-500" />
                </div>
                <h3 className="text-neutral-900 mb-2">
                  User Dashboard
                </h3>
                <p className="text-neutral-600 text-sm mb-6">
                  Mobile-optimized personal wellness tracking at
                  390px width
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-orange-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Dashboard Home with wellness summary
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-orange-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Mood Trends with emotional patterns
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-orange-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Journal Analytics with sentiment insights
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-orange-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Meditation insights and recommendations
                    </p>
                  </div>
                </div>

                <button
                  onClick={onViewUserDashboard}
                  className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all text-sm"
                >
                  View Dashboard
                </button>
              </motion.div>

              {/* Therapist Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-orange-500 transition-all"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="size-7 text-blue-500" />
                </div>
                <h3 className="text-neutral-900 mb-2">
                  Therapist Dashboard
                </h3>
                <p className="text-neutral-600 text-sm mb-6">
                  Desktop-optimized clinical monitoring and
                  patient management
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-blue-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Patient overview with risk scores
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-blue-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Emotional timeline tracking
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-blue-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Journal sentiment analysis tools
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="size-3 text-blue-500" />
                    </div>
                    <p className="text-neutral-700 text-sm">
                      Actions panel for interventions
                    </p>
                  </div>
                </div>

                <button
                  onClick={onViewTherapistDashboard}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-sm"
                >
                  View Dashboard
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Decisions */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-neutral-900 mb-12">
            Key Decisions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {decisions.map((decision, index) => {
              const Icon = decision.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="size-6 text-orange-500" />
                  </div>
                  <h3 className="text-neutral-900 mb-4">
                    {decision.title}
                  </h3>
                  <ul className="space-y-3">
                    {decision.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-neutral-700 text-sm"
                      >
                        <span className="text-orange-500 mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-neutral-900 mb-8">Outcome</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-200"
            >
              <CheckCircle className="size-8 text-green-500 mb-4" />
              <p className="text-neutral-700">
                Clear role separation improved usability for
                both user types without compromising data access
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200"
            >
              <CheckCircle className="size-8 text-blue-500 mb-4" />
              <p className="text-neutral-700">
                Mobile-first user dashboard enables consistent
                tracking while therapist desktop view supports
                clinical workflows
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-200"
            >
              <CheckCircle className="size-8 text-purple-500 mb-4" />
              <p className="text-neutral-700">
                Scalable design system with orange primary color
                maintains brand consistency across all
                touchpoints
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reflection */}
      <section className="bg-neutral-900 py-16">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-white mb-6">Reflection</h2>
          <p className="text-neutral-300 text-lg max-w-[800px]">
            Building Inwards reinforced the importance of
            role-based design in healthcare products. By
            treating users and therapists as distinct personas
            with unique needs, we created focused experiences
            that respect each role's context and constraints.
            The decision to optimize mobile for users and
            desktop for therapists wasn't arbitrary—it reflected
            real usage patterns and professional workflows. This
            case study demonstrates how thoughtful architecture
            and visual design can balance simplicity for
            individuals with powerful tools for care providers.
          </p>
        </div>
      </section>
    </div>
  );
}
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Brain,
    Shield,
    CheckCircle,
    Target,
    User,
    Stethoscope,
    TrendingUp,
    Activity,
    Smartphone,
    ArrowRight
} from "lucide-react";

export default function InwardsCaseStudy() {
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
        <div className="w-full min-h-screen bg-white pb-24">

            {/* Back Navigation */}
            <div className="container mx-auto px-6 py-8">
                <Link to="/work/design" className="inline-flex items-center text-content-secondary hover:text-primary-500 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Design Layer
                </Link>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-12 lg:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 max-w-4xl mx-auto"
                >
                    <div className="inline-block mb-6 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-semibold border border-orange-100">
                        UX / UI Case Study
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                        Inwards Wellness Platform
                    </h1>
                    <p className="text-neutral-600 text-xl md:text-2xl leading-relaxed">
                        Designing a role-based mental wellness platform that
                        connects users with therapists through actionable
                        insights and real-time monitoring.
                    </p>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50"
                >
                    {/* Buttons removed - moved to separate section */}
                    <img
                        src="/assets/inwards/hero-image.png"
                        alt="Inwards Platform Hero"
                        className="w-full h-auto object-cover"
                    />
                </motion.div>
            </section>

            {/* Problem Summary */}
            <section className="bg-neutral-50 py-16 lg:py-24">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-12">
                        The Challenge
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm"
                        >
                            <h3 className="text-xl font-bold mb-4">User Needs</h3>
                            <ul className="space-y-4 text-neutral-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>
                                        Users need a simple way to track mood,
                                        meditation, and journaling without feeling
                                        overwhelmed.
                                    </span>
                                </li>
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm"
                        >
                            <h3 className="text-xl font-bold mb-4">Therapist Needs</h3>
                            <ul className="space-y-4 text-neutral-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>
                                        Therapists require real-time patient
                                        insights but lack tools for efficient
                                        monitoring across multiple patients.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>
                                        Data visualization must balance detail for
                                        therapists with simplicity for users.
                                    </span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Users & Context */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-12">
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
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    H
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">
                                        Hariteja
                                    </h3>
                                    <p className="text-neutral-600 text-sm">
                                        Working Professional, 28
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-neutral-700 flex items-start gap-2">
                                    <Target className="w-5 h-5 text-orange-500 mt-0.5" />
                                    Track daily mood patterns to manage work stress.
                                </p>
                                <p className="text-neutral-700 flex items-start gap-2">
                                    <Target className="w-5 h-5 text-orange-500 mt-0.5" />
                                    Build consistent meditation habits on-the-go.
                                </p>
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
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    Dr
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">
                                        Dr. Martinez
                                    </h3>
                                    <p className="text-neutral-600 text-sm">
                                        Licensed Therapist
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-neutral-700 flex items-start gap-2">
                                    <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                                    Monitor 20+ patients efficiently with risk alerts.
                                </p>
                                <p className="text-neutral-700 flex items-start gap-2">
                                    <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                                    Make data-driven intervention decisions.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* App Experience (Placeholder for Images) */}
            <section className="bg-neutral-50 py-16 lg:py-24">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                            App Experience
                        </h2>
                        <p className="text-xl text-neutral-600">
                            Base experience that sets the foundation
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl overflow-hidden shadow-xl border border-neutral-200"
                    >
                        {/* Using final image as the main showcase since individual screens are missing */}
                        <img
                            src="/assets/inwards/final-image.png"
                            alt="App Experience Overview"
                            className="w-full h-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Platform Expansion */}
            <section className="py-16 lg:py-24 bg-white border-t border-neutral-100">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                            Platform Expansion
                        </h2>
                        <p className="text-neutral-500 max-w-3xl leading-relaxed">
                            These dashboards are re-designed conceptual versions created for case-study explanation only and do not reflect the original NDA-protected product.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* User Dashboard Card */}
                        {/* User Dashboard Card */}
                        <Link
                            to="/work/design/inwards/demo/user"
                            className="p-8 rounded-3xl border border-neutral-200 shadow-lg bg-white flex flex-col h-full hover:shadow-xl transition-shadow duration-300 block text-left group"
                        >
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                                <User className="size-8 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">User Dashboard</h3>
                            <p className="text-neutral-600 mb-8 leading-relaxed">
                                Track your wellness journey with personalized insights, mood trends, meditation progress, and journal analytics on mobile.
                            </p>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="size-4 text-orange-600" />
                                    </div>
                                    <span className="text-neutral-700 font-medium">Mood & emotional tracking</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <Activity className="size-4 text-orange-600" />
                                    </div>
                                    <span className="text-neutral-700 font-medium">Meditation insights & streaks</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <Smartphone className="size-4 text-orange-600" />
                                    </div>
                                    <span className="text-neutral-700 font-medium">Mobile-first 390px design</span>
                                </li>
                            </ul>

                            <div
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                View User Dashboard
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Therapist Dashboard Card */}
                        <Link
                            to="/work/design/inwards/demo/therapist"
                            className="p-8 rounded-3xl border border-neutral-200 shadow-lg bg-white flex flex-col h-full hover:shadow-xl transition-shadow duration-300 block text-left group"
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <Stethoscope className="size-8 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Therapist Dashboard</h3>
                            <p className="text-neutral-600 mb-8 leading-relaxed">
                                Monitor patient wellness, analyze emotional trends, manage sessions, and take clinical actions with comprehensive insights.
                            </p>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="size-4 text-blue-600" />
                                    </div>
                                    <span className="text-neutral-700 font-medium">Patient overview & risk alerts</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Activity className="size-4 text-blue-600" />
                                    </div>
                                    <span className="text-neutral-700 font-medium">Emotional timeline analysis</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Shield className="size-4 text-blue-600" />
                                    </div>
                                    <span className="text-neutral-700 font-medium">Clinical actions & notes</span>
                                </li>
                            </ul>

                            <div
                                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                View Therapist Dashboard
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Key Decisions */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-12">
                        Key Decisions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {decisions.map((decision, index) => {
                            const Icon = decision.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                                        <Icon className="size-6 text-orange-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-4">
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
            <section className="bg-neutral-900 py-16 lg:py-24 text-white">
                <div className="container mx-auto px-6 max-w-[1200px] text-center">
                    <h2 className="text-3xl font-bold mb-8 text-neutral-300">Outcome</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
                            <p className="text-lg">Clear role separation improved usability for both user types.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <CheckCircle className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                            <p className="text-lg">Mobile-first user dashboard enables consistent tracking.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <CheckCircle className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                            <p className="text-lg">Scalable design system with orange primary color.</p>
                        </div>
                    </div>

                    <div className="mt-16 pt-16 border-t border-white/20">
                        <h3 className="text-2xl font-bold mb-6 text-neutral-300">Reflection</h3>
                        <p className="text-neutral-300 text-lg max-w-3xl mx-auto leading-relaxed">
                            "Building Inwards reinforced the importance of role-based design in healthcare products. By treating users and therapists as distinct personas with unique needs, we created focused experiences that respect each role's context and constraints."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

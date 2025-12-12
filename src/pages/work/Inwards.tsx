import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { LotusPlayerMockup } from '../../components/work/LotusPlayerMockup';
import { DesignerNoteChip } from '../../components/ui/DesignerNoteChip';
import { InteractiveChip } from '../../components/ui/InteractiveChip';

function CalloutItem({ text }: { text: string }) {
    return (
        <div className="flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-primary-main-500 shrink-0 mt-0.5" />
            <p className="text-content-secondary leading-relaxed">{text}</p>
        </div>
    )
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export function Inwards() {
    const navigate = useNavigate();

    return (
        <article className="pb-20">
            {/* Case Study Hero */}
            <section className="bg-surface-subtle border-b border-border-muted pt-12 pb-20">
                <div className="container mx-auto px-6 max-w-container">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-content-secondary hover:text-primary-main-400 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="flex flex-col md:flex-row gap-8 items-start justify-between mb-12"
                    >
                        <div className="max-w-2xl">
                            <Badge variant="warning" className="mb-4">Mental Health SaaS</Badge>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-content-primary mb-6 leading-tight">
                                Inwards
                            </h1>
                            <p className="text-xl text-content-secondary leading-relaxed">
                                A nice CBT-based journaling app connecting users with therapists through data-driven insights.
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Timeline</h4>
                                <p className="text-content-secondary">3 Months (2024)</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">My Role</h4>
                                <p className="text-content-secondary">Product Designer</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Tools</h4>
                                <p className="text-content-secondary">Figma, React</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-content-primary mb-1">Platform</h4>
                                <p className="text-content-secondary">iOS, Web</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="rounded-2xl overflow-hidden border border-border-muted shadow-lg bg-white"
                    >
                        <img
                            src="/assets/images/inwards-hero.png"
                            alt="Inwards App Showcase"
                            className="w-full h-auto object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Content Container - Constrained Width for Readability */}
            <div className="container mx-auto px-6 max-w-3xl mt-20 space-y-24">

                {/* The Challenge */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="space-y-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
                        <p className="text-lg text-content-secondary leading-relaxed">
                            Mental health apps often feel either too clinical (alienating users) or too abstract (useless for therapists).
                            <br /><br />
                            The goal was to build a dual-interface system: A warm, safe space for users to track mood, and a data-rich dashboard for therapists to monitor patient progress.
                        </p>
                    </div>

                    {/* Dual User Type Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-orange-50 border-orange-100 p-6">
                            <h3 className="font-bold text-lg text-orange-800 mb-4 flex items-center gap-2">
                                For Users (Patients)
                            </h3>
                            <ul className="space-y-3">
                                {['Simple mood tracking', 'Private journaling', 'CBT exercises'].map(item => (
                                    <li key={item} className="flex gap-2 items-start text-orange-900/80 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        <Card className="bg-blue-50 border-blue-100 p-6">
                            <h3 className="font-bold text-lg text-blue-800 mb-4 flex items-center gap-2">
                                For Therapists
                            </h3>
                            <ul className="space-y-3">
                                {['Patient risk monitoring', 'Trend analysis', 'Session preparation'].map(item => (
                                    <li key={item} className="flex gap-2 items-start text-blue-900/80 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </motion.section>





                {/* Solution Breakdown - Part 1: Motivation */}
                <section className="py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 flex justify-center lg:justify-end">
                            <div className="transform scale-90 lg:scale-100 origin-top">
                                <LotusPlayerMockup />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Motivating to Meditate</h2>
                                <p className="text-lg text-content-secondary leading-relaxed">
                                    Meditation apps often fail because they feel like homework. We gamified the experience by visualizing progress as a blooming lotus – a subtle but powerful reinforcement loop.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <CalloutItem text="Low barrier to entry with guided 5-minute sessions." />
                                <CalloutItem text="Visual rewards that grow with your streak." />
                                <CalloutItem text="Immediate feedback layout for dopamine reinforcement." />
                            </div>
                            <div className="pt-6">
                                <DesignerNoteChip avatarSrc="/assets/images/profile.png" label="Designer Note" className="mb-4" />
                                <p className="text-content-secondary italic text-sm border-l-2 border-orange-200 pl-4 py-1">
                                    "We ditched the standard 'media player' controls for something more organic. Playback isn't just a timer; it's a living session."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Breakdown - Part 2: Accountability */}
                <section className="py-12 bg-surface-subtle -mx-6 px-6 lg:-mx-24 lg:px-24 rounded-[3rem]">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Accountability of Emotional Behaviors</h2>
                                <p className="text-lg text-content-secondary leading-relaxed">
                                    Users can choose to share specific mood logs with their therapist. This transparency creates a safety net, allowing professionals to intervene when trends dip into 'High Risk' territory.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <CalloutItem text="Selective sharing maintains user agency and trust." />
                                <CalloutItem text="Automated risk flags for keywords in journal entries." />
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-border-muted transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Abstract representation of a Journal Entry */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <span className="font-bold text-gray-900">Today's Journal</span>
                                    <Badge variant="warning">Shared</Badge>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    "I felt overwhelmed by the noise today. I tried the breathing exercise but..."
                                </p>
                                <div className="h-32 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                                    <span className="text-xs text-gray-400 font-medium">Voice Memo Attached</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Breakdown - Part 3: Self Assessment */}
                <section className="py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 bg-gray-50 p-8 rounded-[3rem] border border-gray-100 flex items-center justify-center min-h-[400px]">
                            <div className="text-center space-y-4">
                                <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                                    <Badge variant="success" className="text-lg px-4 py-1">Wellness Score: 8.5/10</Badge>
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <div className="h-32 w-4 bg-orange-100 rounded-full relative overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-orange-400 h-[60%]"></div>
                                    </div>
                                    <div className="h-32 w-4 bg-orange-100 rounded-full relative overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-orange-400 h-[40%]"></div>
                                    </div>
                                    <div className="h-32 w-4 bg-orange-100 rounded-full relative overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-orange-400 h-[75%]"></div>
                                    </div>
                                    <div className="h-32 w-4 bg-orange-100 rounded-full relative overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-orange-400 h-[85%]"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 font-medium mt-4">Weekly Mood Trends</p>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Self Assessment & Growth</h2>
                                <p className="text-lg text-content-secondary leading-relaxed">
                                    Beyond daily logging, we provide tools for users to step back and see the bigger picture. Self-assessment modules help users recognize patterns in their own behavior.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <CalloutItem text="Weekly check-ins to recalibrate goals." />
                                <CalloutItem text="Visualizing emotional growth over time." />
                                <CalloutItem text="Exportable reports for external therapy sessions." />
                            </div>
                        </div>
                    </div>
                </section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <h2 className="text-3xl font-bold mb-12 text-center">Interactive Prototypes</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* User Dashboard */}
                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group cursor-pointer"
                            onClick={() => navigate('/work/inwards/user')}
                        >
                            <div className="rounded-[2rem] overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all relative aspect-[4/3] mb-6 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <Button variant="solid" className="rounded-full px-8">Launch User App</Button>
                                </div>
                                {/* Clean Circle Graphic */}
                                <div className="w-16 h-16 rounded-full border-[1.5px] border-orange-200" />
                                <InteractiveChip className="absolute top-4 right-4" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-main-600 transition-colors">User Dashboard</h3>
                            <p className="text-content-secondary text-lg">Mobile-first view for daily journaling and mood logging.</p>
                        </motion.div>

                        {/* Therapist Dashboard */}
                        <motion.div
                            variants={fadeUp}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group cursor-pointer"
                            onClick={() => navigate('/work/inwards/therapist')}
                        >
                            <div className="rounded-[2rem] overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all relative aspect-[4/3] mb-6 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <Button variant="solid" className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 border-transparent">Launch Pro Dashboard</Button>
                                </div>
                                {/* Clean Circle Graphic */}
                                <div className="w-16 h-16 rounded-full border-[1.5px] border-blue-200" />
                                <InteractiveChip className="absolute top-4 right-4" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Therapist Dashboard</h3>
                            <p className="text-content-secondary text-lg">Desktop-optimized view for patient management and analytics.</p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Design Process / Static Images */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="space-y-12"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">App Experience</h2>
                        <p className="text-content-secondary text-lg">
                            Visualizing the flow from onboarding to daily usage.
                        </p>
                    </div>
                    <img
                        src="/assets/images/inwards-final.png"
                        alt="App Screens"
                        className="w-full rounded-2xl border border-border-muted shadow-sm"
                        loading="lazy"
                    />
                </motion.section>

            </div>

            {/* Reflection - Full Width Exception */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="w-full bg-gray-900 py-24 text-white mt-24"
            >
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-8 text-white">Reflection</h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Building Inwards reinforced the importance of role-based design in healthcare products. By treating
                        users and therapists as distinct personas with unique needs, we created focused experiences that
                        respect each role's context and constraints. The decision to optimize mobile for users and desktop
                        for therapists wasn't arbitrary—it reflected real usage patterns and professional workflows.
                    </p>
                </div>
            </motion.section>
        </article >
    );
}

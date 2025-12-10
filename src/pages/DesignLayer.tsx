import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function DesignLayer() {
    return (
        <div className="container mx-auto px-6 py-24 max-w-[1440px]">
            {/* Back Navigation */}
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-orange-500 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
            </div>

            {/* Header Section */}
            <div className="mb-16 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                    Design <span className="text-orange-500">Layer</span>
                </h1>
                <p className="text-xl text-slate-600">
                    Human-centered architecture for enterprise platforms.
                    Merging aesthetics with complex logic.
                </p>
            </div>

            {/* Case Studies Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Inwards Case Study Card */}
                <Link to="/work/design/inwards" className="group block">
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300"
                    >
                        {/* Card Image */}
                        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                            <img
                                src="/assets/inwards/hero-image.png"
                                alt="Inwards Wellness Platform"
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-wider">
                                <span>UX Case Study</span>
                                <span>•</span>
                                <span>Wellness</span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                                Inwards Wellness
                            </h3>

                            <p className="text-slate-600 line-clamp-2">
                                A role-based mental wellness platform connecting users with therapists through actionable insights.
                            </p>

                            <div className="mt-4 flex items-center text-orange-500 font-medium text-sm group-hover:gap-2 transition-all">
                                View Case Study <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Placeholder for future case studies */}
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-600">Coming Soon</h4>
                        <p className="text-sm text-slate-500">More design stories are in the making.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

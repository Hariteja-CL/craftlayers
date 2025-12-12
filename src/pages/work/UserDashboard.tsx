import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LotusPlayerMockup } from '../../components/work/LotusPlayerMockup';

type LayerType = 'UX' | 'AI' | 'Security';

export function UserDashboard() {
    const [activeLayer, setActiveLayer] = useState<LayerType>('UX');

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden">

            {/* Nav */}

            <Link to="/work/inwards" className="fixed top-6 left-6 md:top-8 md:left-8 z-[60] flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm border border-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Case Study
            </Link>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-7xl relative z-10">

                {/* Left Side: DS Rules (Visible on UX Layer) */}
                <AnimatePresence>
                    {activeLayer === 'UX' && (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-64 md:w-80 p-6 rounded-3xl border-2 border-orange-400 bg-white shadow-xl z-50 hidden md:block"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">DS Rules</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                The design should be <span className="font-semibold text-gray-900">white & clean</span> to maintain scanability and significance following WCAG rules.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Center: The Artifact */}
                <div className="relative z-10 scale-90 md:scale-100 transition-transform duration-500">
                    <LotusPlayerMockup className="shadow-2xl shadow-gray-200/50" />

                    {/* Mobile Only: Layer Label */}
                    <div className="md:hidden text-center mt-8 font-bold text-gray-400">
                        Viewing: {activeLayer} Layer
                    </div>
                </div>

                {/* Right Side: UX Rules (Visible on UX Layer) */}
                <AnimatePresence>
                    {activeLayer === 'UX' && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-80 p-6 rounded-3xl border-2 border-orange-400 bg-white shadow-xl z-50 hidden md:block"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">UX Rules</h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-700 mb-1">Minimalism</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        The card should be minimalist, providing small but important data with few details.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-700 mb-1">View Details</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        Expand version of the card with more data on interaction.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-700 mb-1">Action Hierarchy</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        CTA is on top to accommodate quick action against disasters.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {/* Placeholder for other layers to show system is extensible */}

                </AnimatePresence>
            </div>

            {/* Bottom: Layer Switcher */}
            <div className="flex gap-0 bg-gray-100 p-1.5 rounded-full mt-12 md:mt-16 relative z-20">
                {(['UX', 'AI', 'Security'] as LayerType[]).map((layer) => (
                    <div className="relative" key={layer}>
                        {/* Tooltip for inactive layers */}


                        <button
                            onClick={() => {
                                if (layer === 'UX') setActiveLayer(layer);
                            }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative group ${activeLayer === layer
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                                } ${layer !== 'UX' ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                            {layer} Layer
                            {/* Hover Trigger for Tooltip (CSS-based) for simpler handling */}
                            {(layer === 'AI' || layer === 'Security') && (
                                <div className="absolute inset-0 z-50 peer" />
                            )}
                        </button>

                        {/* Peer-based Tooltip Implementation for cleaner hover */}
                        {(layer === 'AI' || layer === 'Security') && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 peer-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 transform translate-y-2 peer-hover:translate-y-0">
                                <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl relative">
                                    Coming Soon...
                                    <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}

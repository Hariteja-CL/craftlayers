import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface PasswordGateProps {
    children: React.ReactNode;
    scope: string; // Unique ID for the protected area (e.g. "casestudy" vs "dashboard")
}

export function PasswordGate({ children, scope }: PasswordGateProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Scoped Persistence: Checks only the key for this specific page/scope
        const storageKey = `access_${scope}`;
        const unlocked = sessionStorage.getItem(storageKey);
        if (unlocked === 'true') {
            setIsUnlocked(true);
        }
    }, [scope]);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Design2025') {
            const storageKey = `access_${scope}`;
            sessionStorage.setItem(storageKey, 'true');
            setIsUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    return (
        <div className="relative min-h-screen">
            <AnimatePresence>
                {!isUnlocked && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 text-white"
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-neutral-950 to-neutral-950" />
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

                        <div className="relative z-10 w-full max-w-md p-8 text-center">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8 flex justify-center"
                            >
                                <div className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl shadow-indigo-500/20">
                                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold tracking-tight mb-2 text-white"
                            >
                                Confidential Project
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-neutral-400 mb-8 text-sm leading-relaxed"
                            >
                                This case study contains proprietary IP. <br />
                                Please enter the access key to continue.
                            </motion.p>

                            <motion.form
                                onSubmit={handleUnlock}
                                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-lg transition-opacity opacity-0 group-hover:opacity-100" />

                                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden transition-colors focus-within:border-indigo-500/50 focus-within:bg-white/10">
                                    <Lock className="w-4 h-4 text-neutral-500 ml-4" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError(false);
                                        }}
                                        placeholder="Enter Access Key"
                                        className="w-full bg-transparent border-none text-white placeholder-neutral-600 px-4 py-3 focus:outline-none text-sm font-medium tracking-widest"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 mr-2 text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.form>

                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-400 text-xs mt-3 font-medium flex items-center justify-center gap-1.5"
                                    >
                                        <Lock className="w-3 h-3" />
                                        Access Denied. Please try again.
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isUnlocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {children}
                </motion.div>
            )}
        </div>
    );
}

import { motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

interface ChatButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
                pointer-events-auto
                flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl transition-all duration-300
                ${isOpen 
                    ? 'cl-bg-neutral-surface-level-2 cl-text-neutral-text-high-contrast border cl-border-border-color-default' 
                    : 'cl-bg-brand-primary-base cl-text-brand-primary-on-base border-none'
                }
            `}
        >
            <div className="relative w-5 h-5">
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <MessageSquare className="w-5 h-5" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <X className="w-5 h-5" />
                </motion.div>
            </div>
            {!isOpen && (
                <span className="text-sm font-bold tracking-tight">Ask about my work</span>
            )}
        </motion.button>
    );
}

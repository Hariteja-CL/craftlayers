import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Message } from './ChatWidget';
import { Send, X, Sparkles } from 'lucide-react';

interface ChatPanelProps {
    messages: Message[];
    isThinking: boolean;
    onSendMessage: (msg: string) => void;
    onQuickAction: (action: string) => void;
    onClose: () => void;
}

const QUICK_ACTIONS = [
    "Explain your workflow",
    "Show Enculture project",
    "How do you use AI?",
    "How can I contact you?"
];

export function ChatPanel({ messages, isThinking, onSendMessage, onQuickAction, onClose }: ChatPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = inputRef.current?.value;
        if (value) {
            onSendMessage(value);
            inputRef.current!.value = '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="pointer-events-auto w-[380px] h-[550px] mb-4 overflow-hidden rounded-[32px] border cl-border-border-color-default cl-bg-neutral-surface-level-0 shadow-2xl flex flex-col"
        >
            {/* Header */}
            <div className="p-6 border-b cl-border-border-color-default cl-bg-neutral-surface-level-1 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl cl-bg-brand-primary-base flex items-center justify-center cl-text-white shadow-brand-primary-surface">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold cl-text-primary">Assistant to Hari</h3>
                        <p className="text-[10px] cl-text-neutral-text-medium-contrast font-bold uppercase tracking-wider">AI Powered</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 cl-text-neutral-text-low-contrast hover:cl-bg-neutral-surface-level-2 rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-6 cl-bg-neutral-surface-level-0 scroll-smooth"
            >
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`
                            max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed
                            ${msg.role === 'user' 
                                ? 'cl-bg-brand-primary-base cl-text-white rounded-tr-none shadow-sm' 
                                : 'cl-bg-neutral-surface-level-1 cl-text-neutral-text-high-contrast rounded-tl-none border cl-border-default'
                            }
                        `}>
                            {msg.content}
                        </div>
                        <div className="flex items-end gap-2 text-[10px] mt-1 opacity-40 px-1">
                            {msg.role === 'assistant' && <Sparkles className="w-3 h-3 cl-text-brand-primary-base" />}
                            {msg.role === 'assistant' ? 'Assistant to Hari' : 'User'}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div className="flex flex-col items-start animate-pulse">
                        <div className="cl-bg-neutral-surface-level-1 cl-text-neutral-text-medium-contrast rounded-2xl rounded-tl-none px-4 py-3 text-[13px] border cl-border-default">
                            Thinking...
                        </div>
                    </div>
                )}

                {/* Quick Actions (Only shown if few messages) */}
                {messages.length < 3 && !isThinking && (
                    <div className="pt-4 grid grid-cols-1 gap-2">
                        {QUICK_ACTIONS.map((action) => (
                            <button
                                key={action}
                                onClick={() => onQuickAction(action)}
                                className="text-left px-4 py-2.5 rounded-xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 cl-text-neutral-text-medium-contrast text-xs font-bold hover:cl-bg-brand-primary-base hover:cl-text-white hover:border-transparent transition-all duration-200"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t cl-border-border-color-default cl-bg-neutral-surface-level-1">
                <div className="relative group flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask about workflow, case studies..."
                        className="flex-grow px-4 py-3 bg-white cl-text-primary rounded-xl text-sm border-2 cl-border-border-color-default focus:border-brand-primary-base focus:outline-none transition-all placeholder:text-gray-400"
                    />
                    <button 
                        type="submit"
                        disabled={isThinking}
                        className="p-3 cl-bg-brand-primary-base cl-text-white rounded-xl hover:cl-bg-brand-primary-interaction disabled:opacity-50 transition-all shadow-md group-focus-within:shadow-brand-primary-surface"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

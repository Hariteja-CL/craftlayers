import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatPanel } from './ChatPanel';
import { ChatButton } from './ChatButton';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    intent?: 'chat' | 'lead' | 'demo';
}

export type LeadStep = 'none' | 'problem' | 'email' | 'additional';

const STORAGE_KEY = 'hariteja_chat_session';
const MESSAGES_KEY = 'hariteja_chat_messages';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string>('');
    const [isThinking, setIsThinking] = useState(false);
    const [leadStep, setLeadStep] = useState<LeadStep>('none');

    // Initialize session and history
    useEffect(() => {
        let sid = localStorage.getItem(STORAGE_KEY);
        if (!sid) {
            sid = crypto.randomUUID();
            localStorage.setItem(STORAGE_KEY, sid);
        }
        setSessionId(sid);

        const savedMessages = localStorage.getItem(MESSAGES_KEY);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Initial intro message
            const intro: Message = {
                id: 'intro',
                role: 'assistant',
                content: "Hi — I’m the assistant to Hari. I can help you understand his work, projects, and how he builds products using AI-assisted workflows.",
                timestamp: Date.now()
            };
            setMessages([intro]);
        }
    }, []);

    // Persist messages
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim() || isThinking) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        try {
            const response = await fetch(import.meta.env.VITE_CHAT_API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_CHAT_API_KEY
                },
                body: JSON.stringify({
                    message: content,
                    session_id: sessionId
                })
            });

            if (!response.ok) throw new Error('API failed');

            const data = await response.json();
            
            const assistMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                timestamp: Date.now(),
                intent: data.intent
            };

            setMessages(prev => [...prev, assistMsg]);

            if (data.intent === 'lead' && leadStep === 'none') {
                setLeadStep('problem');
                // Initiate lead flow
                const leadIntro: Message = {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    content: "What are you looking to build?",
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, leadIntro]);
            } else if (leadStep === 'problem') {
                setLeadStep('email');
                const leadEmail: Message = {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    content: "Want me to share this with Hari? Drop your email.",
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, leadEmail]);
            } else if (leadStep === 'email') {
                setLeadStep('additional');
                const leadFinal: Message = {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    content: "Anything else you'd like to add?",
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, leadFinal]);
            } else if (leadStep === 'additional') {
                setLeadStep('none');
            }

        } catch (err) {
            const failMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Something went wrong. You can reach Hari directly at hariteja@craftlayers.com",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, failMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleQuickAction = (action: string) => {
        handleSendMessage(action);
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <ChatPanel 
                        messages={messages}
                        isThinking={isThinking}
                        onSendMessage={handleSendMessage}
                        onQuickAction={handleQuickAction}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
            
            <ChatButton isOpen={isOpen} onClick={toggleChat} />
        </div>
    );
}

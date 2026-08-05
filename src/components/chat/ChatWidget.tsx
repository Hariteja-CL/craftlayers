import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ChatPanel } from './ChatPanel';
import { ChatButton } from './ChatButton';
import { isAssistantSuppressed, resolvePageContext } from './pageContext';

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
    const location = useLocation();
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

        // Resolved per send, so it always reflects the route the visitor is on.
        const pageContext = resolvePageContext(location.pathname);

        try {
            const apiUrl = import.meta.env.VITE_B_GATEWAY_URL;
            const apiKey = import.meta.env.VITE_B_GATEWAY_AUTH;

            if (!apiUrl || apiUrl === 'undefined') {
                console.error('B_GATEWAY_URL is missing. Please check your .env or Vercel settings.');
                throw new Error('Configuration error');
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || ''
                },
                body: JSON.stringify({
                    message: content,
                    session_id: sessionId,
                    // Tells the gateway which approved knowledge document to
                    // consult. Omitted entirely on routes with no mapping.
                    ...(pageContext ? { page_context: pageContext } : {})
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

    // Temporary: hide the launcher where the gateway would answer from the
    // wrong case study. Checked after all hooks so hook order stays stable.
    // See isAssistantSuppressed() for the removal condition.
    if (isAssistantSuppressed(location.pathname)) return null;

    return (
        <div data-chat-launcher className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
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

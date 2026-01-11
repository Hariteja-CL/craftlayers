import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { toast } from 'sonner';
import { z } from 'zod';
import { ActionPlanWidget } from './ActionPlanWidget';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    toolInvocations?: ToolInvocation[];
}

interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    args: any;
    state: 'result' | 'call';
    result?: any;
}

interface InterventionChatProps {
    currentData: any;
    // Optional props for controlled state (persistence)
    messages?: Message[];
    setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
}

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const SUGGESTION_CHIPS = [
    { label: '🔥 Focus on Burnout', value: 'Prioritize tasks that reduce burnout risk.' },
    { label: '🎨 Design Dept Only', value: 'Filter specific actions for the Design department.' },
    { label: '⚡ Quick Wins', value: 'Show only high-impact, low-effort tasks.' },
];

const openai = createOpenAI({
    apiKey: API_KEY || 'dummy-key', // Prevent crash if key is empty
});

export function InterventionChat({ currentData, messages: externalMessages, setMessages: setExternalMessages }: InterventionChatProps) {
    const [localMessages, setLocalMessages] = useState<Message[]>([]);
    const messages = externalMessages || localMessages;
    const setMessages = setExternalMessages || setLocalMessages;

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    const runSimulationFallback = async (existingMessageId?: string) => {
        console.log("⚠️ Starting Simulation Fallback...");
        const simulationTool = {
            toolCallId: 'mock-' + Date.now(),
            toolName: 'suggest_intervention_plan',
            args: {},
            state: 'result' as const,
            result: {
                analysis_briefing: "Current metrics indicate a critical risk in the Design department due to sustained high workload and low psychological safety. The following interventions focus on immediate friction reduction and trust-building rituals to stabilize velocity.",
                items: [
                    { id: '1', title: 'Design Sprint Retro', description: 'Rationale: Mitigate burnout by addressing project stressors identified in feedback loop.', team: 'Design', estimatedImpact: 'High' },
                    { id: '2', title: 'Workload Balancing', description: 'Rationale: Redistribution of tasks to align with capacity thresholds.', team: 'Design', estimatedImpact: 'High' }
                ]
            }
        };

        if (existingMessageId) {
            // Update the existing "Thinking..." bubble
            setMessages(prev => prev.map(m =>
                m.id === existingMessageId
                    ? { ...m, content: '', toolInvocations: [simulationTool] }
                    : m
            ));
        } else {
            // Create new one if none exists
            setMessages(prev => [...prev, {
                id: Date.now().toString() + '-sim',
                role: 'assistant',
                content: '',
                toolInvocations: [simulationTool]
            }]);
        }
        setIsLoading(false);
    };

    const generateResponse = async (history: Message[]) => {
        setIsLoading(true);
        // define ID and add placeholder IMMEDIATELY so user sees "Thinking..."
        const assistantMessageId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9) + '-ai';
        setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

        // 🛑 STRICT MODE: Check for valid API Key before attempting call
        if (!API_KEY || API_KEY === 'dummy-key') {
            console.warn("⚠️ No valid API Key found. Skipping OpenAI call and using Simulation Mode.");
            // Slight delay to simulate "thinking"
            setTimeout(async () => {
                await runSimulationFallback(assistantMessageId);
            }, 1500);
            return;
        }

        // Create controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        console.log("🚀 REAL AI MODE: Calling OpenAI API...");

        try {
            const { textStream, toolCalls, toolResults } = await streamText({
                model: openai('gpt-4o-mini'),
                messages: history.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
                tools: {
                    // ... tools config ...
                    suggest_intervention_plan: tool({
                        description: 'Generate a list of intervention actions based on the analysis.',
                        parameters: z.object({
                            analysis_briefing: z.string().describe('A concise, strategic psychological analysis of WHY these interventions are needed. Focus on root causes (e.g., Burnout, Trust) based on the data.'),
                            items: z.array(z.object({
                                id: z.string().describe('Unique ID (e.g. action-1)'),
                                title: z.string().describe('Action title'),
                                department: z.string().describe('Target department'),
                                rationale: z.string().describe('Why this helps'),
                                effort: z.enum(['Low', 'Medium', 'High']).describe('Effort level'),
                                impact: z.enum(['High', 'Medium', 'Low']).describe('Impact level'),
                            })).describe('Array of intervention actions'),
                        }),
                        execute: async (args) => {
                            console.log("🛠️ Tool Executed with args:", args);
                            // MAP new strictly-typed fields to legacy UI props
                            const mappedItems = args.items.map(item => ({
                                id: item.id,
                                title: item.title,
                                description: item.rationale, // Mapping rationale -> description
                                team: item.department,       // Mapping department -> team
                                estimatedImpact: item.impact // Mapping impact -> estimatedImpact
                            }));
                            return {
                                analysis_briefing: args.analysis_briefing,
                                items: mappedItems
                            };
                        },
                    }),
                },
                temperature: 0,
                // @ts-ignore - Required for client-side API calls
                dangerouslyAllowBrowser: true,
                abortSignal: controller.signal,
            });

            let fullContent = '';

            for await (const textPart of textStream) {
                fullContent += textPart;
                setMessages(prev =>
                    prev.map(m => m.id === assistantMessageId ? { ...m, content: fullContent } : m)
                );
            }

            // Clear timeout if stream completes (though minimal effect on logic flow)
            clearTimeout(timeoutId);

            // ... rest of logic ...



            const calls = await toolCalls;
            if (calls.length > 0) {
                console.log("✅ Tool called by AI");
                const results = await toolResults;
                const toolInvocations: ToolInvocation[] = calls.map(call => {
                    const resultPart = results.find(r => (r as any).toolCallId === (call as any).toolCallId);
                    const result = (resultPart as any)?.result;
                    return {
                        toolCallId: (call as any).toolCallId,
                        toolName: (call as any).toolName,
                        args: (call as any).args,
                        state: result ? 'result' : 'call',
                        result: result
                    };
                });

                // Attach tool invocations
                setMessages(prev =>
                    prev.map(m => m.id === assistantMessageId ? { ...m, toolInvocations } : m)
                );
            } else {
                // FALLBACK: If AI didn't call the tool
                console.warn("⚠️ AI failed to call tool. Triggering Simulation Fallback.");
                // Update IN PLACE
                await runSimulationFallback(assistantMessageId);
            }

        } catch (error) {
            console.error('❌ Chat error:', error);
            // 1. Show Toast
            toast.error('AI Connection unstable. Switching to On-Device Simulation.');

            // 2. Update IN PLACE (No Flicker)
            await runSimulationFallback(assistantMessageId);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Prevent re-initialization if history exists (Persistence & Strict Mode fix)
        if (messages.length > 0) return;

        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // STRICT SYSTEM PROMPT - ENCULTURE RULE BOOK COMPLIANT
        const systemPrompt: Message = {
            id: 'system-init',
            role: 'system',
            content: `
You are the "Enculture Action Engine," a Senior Strategic Culture Advisor.
Your GOAL is to transform raw department data into a prescriptive JSON Action Plan.

### 1. IDENTITY & LOGIC
* **Role:** You are an expert in Organizational Psychology and UX.
* **Core Task:** Monitor the "Department Data" table for "Cultural Misalignments" (e.g., Low Psychological Safety, High Burnout).
* **The "Why":** You don't just report numbers; you prescribe **solutions** to fix them.

### 2. CRITICAL RULES (THE "FLIGHT MANUAL")
* **ZERO CHAT MODE:** You are a Logic Engine, not a Chatbot. Do not output conversational text like "Here is your plan."
* **MANDATORY TOOL USE:** You MUST call the tool "suggest_intervention_plan" immediately.
* **PRIVACY FIREWALL:** You are analyzing aggregated department metrics. Never ask for individual names.

### 3. DYNAMIC BEHAVIOR (USER OVERRIDES)
* **The Baseline:** Start by analyzing the lowest scoring metrics in the provided JSON data: ${JSON.stringify(currentData)}.
* **The Constraint (Crucial):** If the user provides a specific instruction (e.g., "Make it budget-friendly", "Focus on Remote Teams"), **YOU MUST PRIORITIZE THIS INSTRUCTION.**
    * *Example:* If user says "Low Budget," discard expensive ideas (Retreats) and replace them with free ones (Peer Feedback).
* **ID Rotation:** When regenerating a plan based on user feedback, **ALWAYS** generate new unique IDs for the items (e.g., "action-v2-1") to force the UI to re-render.

### 4. OUTPUT QUALITY STANDARDS
* **Titles:** Must be punchy and action-oriented (e.g., "Async Check-ins" instead of "Consider having meetings later").
* **Rationale:** Explain *why* this specific action solves the specific data problem.
* **Impact/Effort:** Assess realistic effort levels based on the action type.
      `
        };

        // Persist system prompt in state so it survives in history
        setMessages([systemPrompt]);
        generateResponse([systemPrompt]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleChipClick = (value: string) => {
        if (isLoading) return;
        const userMsg: Message = { id: Date.now().toString() + '-user', role: 'user', content: value };
        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        generateResponse(newHistory);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString() + '-user',
            role: 'user',
            content: input
        };

        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        setInput('');

        generateResponse(newHistory);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Simulation Mode Indicator */}
            {(!API_KEY || API_KEY === 'dummy-key') && (
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-between text-xs text-amber-800">
                    <span className="font-medium flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Simulation Mode Active
                    </span>
                    <span className="opacity-75">AI features simulated for demo purposes</span>
                </div>
            )}
            <div className="flex-1 space-y-6 p-4 overflow-y-auto" ref={scrollRef}>
                {messages.filter(m => m.role !== 'system').map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'
                            }`}
                    >
                        <div className={`p-2 rounded-full flex-shrink-0 w-8 h-8 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-neutral-900 text-white'
                            }`}>
                            {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>

                        <div className={`text-sm leading-relaxed max-w-[90%] ${msg.role === 'user'
                            ? 'bg-neutral-900 text-white px-4 py-3 rounded-2xl rounded-tr-sm'
                            : 'text-neutral-800'
                            }`}>
                            {/* Text Content */}
                            {msg.content && (
                                <div className={msg.role === 'assistant' ? 'bg-neutral-50 px-4 py-3 rounded-2xl rounded-tl-sm border border-neutral-100 mb-2' : ''}>
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{line}</p>
                                    ))}
                                </div>
                            )}

                            {/* Loading State for Tools */}
                            {isLoading && !msg.content && (!msg.toolInvocations || msg.toolInvocations.length === 0) && msg.role === 'assistant' && (
                                <div className="flex items-center gap-2 text-neutral-400 italic text-xs py-2">
                                    <Sparkles className="w-3 h-3 animate-spin" />
                                    Designing intervention strategy...
                                </div>
                            )}

                            {msg.toolInvocations?.map((tool) => (
                                <div key={tool.toolCallId} className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
                                    {tool.toolName === 'suggest_intervention_plan' && tool.result && (
                                        <div className="space-y-4">
                                            {/* Analysis Briefing - Structured Reasoning */}
                                            {tool.result.analysis_briefing && (
                                                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-xs uppercase tracking-wider">
                                                        <Sparkles className="w-3 h-3" />
                                                        Strategic Analysis
                                                    </div>
                                                    <p className="text-sm text-indigo-800 leading-relaxed text-justify">
                                                        {tool.result.analysis_briefing}
                                                    </p>
                                                </div>
                                            )}

                                            <ActionPlanWidget tasks={tool.result.items || []} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-neutral-400 pl-12 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        Analyzing aggregated data...
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-white space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {SUGGESTION_CHIPS.map((chip) => (
                        <button
                            key={chip.label}
                            onClick={() => handleChipClick(chip.value)}
                            disabled={isLoading}
                            className="whitespace-nowrap px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs rounded-full transition-colors border border-neutral-200 disabled:opacity-50"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Refine the plan..."
                        className="flex-1 pl-4 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

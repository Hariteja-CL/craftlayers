/**
 * Intervention-planning model call, moved off the browser.
 *
 * Previously InterventionChat.tsx built an OpenAI client in the browser with
 * `dangerouslyAllowBrowser` and a VITE_-prefixed key, which put a spendable
 * credential in the public bundle. The key now lives in server-only env.
 *
 * This endpoint REQUIRES a dashboard session. That is not incidental: an
 * unauthenticated model proxy is just a slower way to let strangers spend the
 * account's credit.
 *
 * BEHAVIOUR CHANGE: the browser used to stream tokens as they arrived. This
 * returns one JSON response instead. Proxying a stream while still surfacing
 * tool calls is materially more code, and the caller already renders a
 * "thinking" placeholder and falls back to a local simulation, so the visible
 * difference is that text appears at once rather than progressively.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { hasValidSession } from './_lib/session.js';

const MAX_MESSAGES = 40;

const interventionTool = tool({
    description: 'Generate a list of intervention actions based on the analysis.',
    parameters: z.object({
        analysis_briefing: z
            .string()
            .describe('A concise, strategic psychological analysis of WHY these interventions are needed. Focus on root causes (e.g., Burnout, Trust) based on the data.'),
        items: z
            .array(
                z.object({
                    id: z.string().describe('Unique ID (e.g. action-1)'),
                    title: z.string().describe('Action title'),
                    department: z.string().describe('Target department'),
                    rationale: z.string().describe('Why this helps'),
                    effort: z.enum(['Low', 'Medium', 'High']).describe('Effort level'),
                    impact: z.enum(['High', 'Medium', 'Low']).describe('Impact level'),
                })
            )
            .describe('Array of intervention actions'),
    }),
    // Field mapping stays identical to the previous client-side version so
    // ActionPlanWidget keeps receiving the shape it already expects.
    execute: async (args) => ({
        analysis_briefing: args.analysis_briefing,
        items: args.items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.rationale,
            team: item.department,
            estimatedImpact: item.impact,
        })),
    }),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!hasValidSession(req.headers.cookie)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        // 503 tells the caller to use its simulation fallback, which is the
        // same path the old code took when the key was absent.
        console.error('intervention: OPENAI_API_KEY is not set');
        return res.status(503).json({ error: 'Model unavailable' });
    }

    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : null;
    if (!incoming || incoming.length === 0 || incoming.length > MAX_MESSAGES) {
        return res.status(400).json({ error: 'Invalid messages' });
    }

    const messages = incoming
        .filter((m: unknown): m is { role: string; content: string } =>
            !!m && typeof (m as { content?: unknown }).content === 'string' &&
            ['user', 'assistant', 'system'].includes((m as { role?: unknown }).role as string)
        )
        .map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
        }));

    if (messages.length === 0) return res.status(400).json({ error: 'Invalid messages' });

    try {
        const openai = createOpenAI({ apiKey });
        const result = await generateText({
            model: openai('gpt-4o-mini'),
            messages,
            tools: { suggest_intervention_plan: interventionTool },
            temperature: 0,
            abortSignal: AbortSignal.timeout(20_000),
        });

        const calls = (result.toolCalls ?? []) as Array<Record<string, unknown>>;
        const results = (result.toolResults ?? []) as Array<Record<string, unknown>>;

        const toolInvocations = calls.map((call) => {
            const match = results.find((r) => r.toolCallId === call.toolCallId);
            return {
                toolCallId: call.toolCallId,
                toolName: call.toolName,
                args: call.args,
                state: match?.result ? 'result' : 'call',
                result: match?.result,
            };
        });

        return res.status(200).json({ text: result.text, toolInvocations });
    } catch (err) {
        console.error('intervention: model call failed', err instanceof Error ? err.message : 'unknown');
        return res.status(502).json({ error: 'Model request failed' });
    }
}

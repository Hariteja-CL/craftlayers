/**
 * Public chat proxy.
 *
 * The browser used to call the gateway directly with `x-api-key`, which put
 * the gateway credential in the bundle. The browser now calls this endpoint
 * with no credential at all and the key stays in server-only env.
 *
 * NOTE ON B_GATEWAY_URL: a URL is not really a secret — anyone can watch the
 * network tab of the old build, and it may still be in deployment history.
 * It is kept server-side anyway because that is now the trust boundary:
 * routing the call through here is what lets us apply origin checks and rate
 * limiting at all. Treat the URL as non-sensitive; treat B_GATEWAY_AUTH as
 * sensitive.
 *
 * This endpoint is deliberately unauthenticated — it serves public visitors —
 * so it is shielded from becoming an open relay by three cheap checks: a
 * same-origin requirement, a rate limit, and a strict allow-list of forwarded
 * fields. None of these is airtight on its own.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clientKey } from './_lib/session';
import { rateLimit } from './_lib/rateLimit';

const MAX_REQUESTS = 20;
const WINDOW_MS = 5 * 60 * 1000;
const MAX_MESSAGE_CHARS = 4000;

/** Requests from another site's page are rejected. This does not stop a
 *  scripted client that omits or forges the header — it stops casual
 *  embedding and drive-by abuse from a browser. */
function isSameOrigin(req: VercelRequest): boolean {
    const host = req.headers.host;
    if (!host) return false;
    const source = (req.headers.origin as string) || (req.headers.referer as string);
    // Non-browser callers send neither. Allow them through to the rate
    // limiter rather than hard-failing, since curl is not the threat here.
    if (!source) return true;
    try {
        return new URL(source).host === host;
    } catch {
        return false;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!isSameOrigin(req)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const limit = rateLimit(`chat:${clientKey(req.headers['x-forwarded-for'])}`, MAX_REQUESTS, WINDOW_MS);
    if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfter));
        return res.status(429).json({ error: 'Too many requests' });
    }

    const url = process.env.B_GATEWAY_URL;
    const key = process.env.B_GATEWAY_AUTH;
    if (!url || !key) {
        console.error('chat: B_GATEWAY_URL or B_GATEWAY_AUTH is not set');
        return res.status(503).json({ error: 'Chat is unavailable' });
    }

    const message = typeof req.body?.message === 'string' ? req.body.message : '';
    if (!message.trim() || message.length > MAX_MESSAGE_CHARS) {
        return res.status(400).json({ error: 'Invalid message' });
    }

    // Allow-list, not pass-through: whatever else the client sends is dropped
    // so this cannot be used to smuggle fields into the gateway.
    const payload: Record<string, unknown> = { message };
    if (typeof req.body?.session_id === 'string') payload.session_id = req.body.session_id;
    if (typeof req.body?.page_context === 'string') payload.page_context = req.body.page_context;

    try {
        const upstream = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': key },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(20_000),
        });

        if (!upstream.ok) {
            // Upstream status and body are not forwarded: they can carry
            // provider detail that does not belong in a public response.
            console.error('chat: upstream responded', upstream.status);
            return res.status(502).json({ error: 'Chat is unavailable' });
        }

        return res.status(200).json(await upstream.json());
    } catch (err) {
        console.error('chat: upstream request failed', err instanceof Error ? err.message : 'unknown');
        return res.status(502).json({ error: 'Chat is unavailable' });
    }
}

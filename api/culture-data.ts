/**
 * Culture-dashboard dataset, served only to an authenticated session.
 *
 * This data used to be a `const` inside CultureDashboard.tsx, which meant it
 * shipped in the public JavaScript bundle no matter what the UI gate did.
 * Moving it here is the point of the change: the browser now has nothing to
 * render until the server has checked the session cookie.
 *
 * The figures themselves are illustrative, built for a concept prototype.
 * They are not real employee data.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasValidSession } from './_lib/session';

const DEPARTMENT_METRICS = [
    { id: '1', department: 'Engineering', headcount: 24, sentiment: 62, topThemes: ['Legacy Code', 'Siloed Teams', 'Knowledge Gap'] },
    { id: '2', department: 'Design', headcount: 12, sentiment: 42, topThemes: ['Burnout', 'Feedback Loops', 'Overtime'] },
    { id: '3', department: 'Product Management', headcount: 8, sentiment: 78, topThemes: ['Strategy Clarity', 'Alignment'] },
    { id: '4', department: 'Sales & Marketing', headcount: 18, sentiment: 55, topThemes: ['Budget Cuts', 'Travel Freeze', 'Morale'] },
    { id: '5', department: 'Customer Support', headcount: 15, sentiment: 88, topThemes: ['Autonomy', 'Mastery'] },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!hasValidSession(req.headers.cookie)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ data: DEPARTMENT_METRICS });
}

import { useCallback, useEffect, useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, LogOut } from 'lucide-react';

/**
 * Server-authenticated gate for private dashboard routes.
 *
 * This replaces the previous PasswordGate, which compared a hard-coded string
 * in the browser and recorded success in sessionStorage. That gate hid
 * components; it did not protect anything. The password shipped in the public
 * bundle and the flag could be set from the console.
 *
 * What actually protects the dashboard now is that its data lives behind
 * /api/culture-data, which returns 401 without a valid session cookie. This
 * component is only the sign-in surface — forcing it to render `children`
 * would still show an empty dashboard, because the browser has no data until
 * the server hands it over.
 *
 * The session cookie is HttpOnly, so this component can never read it. The
 * only way to learn whether a session exists is to ask the server, which is
 * what the GET below does.
 */

type Status = 'checking' | 'locked' | 'unlocked';

export function DashboardGate({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<Status>('checking');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/auth', { credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : { authenticated: false }))
            .then((d) => {
                if (!cancelled) setStatus(d.authenticated ? 'unlocked' : 'locked');
            })
            .catch(() => {
                if (!cancelled) setStatus('locked');
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (submitting) return;
            setSubmitting(true);
            setError(null);
            try {
                const res = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ password }),
                });
                if (res.ok) {
                    setPassword('');
                    setStatus('unlocked');
                } else if (res.status === 429) {
                    setError('Too many attempts. Try again later.');
                } else {
                    // Deliberately identical for every rejection reason.
                    setError('Access denied.');
                }
            } catch {
                setError('Access denied.');
            } finally {
                setSubmitting(false);
            }
        },
        [password, submitting]
    );

    const handleLogout = useCallback(async () => {
        await fetch('/api/auth', { method: 'DELETE', credentials: 'same-origin' }).catch(() => { });
        setStatus('locked');
    }, []);

    if (status === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
                <p className="text-sm">Checking access…</p>
            </div>
        );
    }

    if (status === 'locked') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
                <div className="w-full max-w-md text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="p-4 rounded-full bg-white/5 border border-white/10">
                            <ShieldCheck aria-hidden="true" className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight mb-2">Private dashboard</h1>
                    <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
                        This area is restricted. Sign in to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="relative">
                        <label htmlFor="dashboard-password" className="sr-only">
                            Access key
                        </label>
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50">
                            <Lock aria-hidden="true" className="w-4 h-4 text-neutral-500 ml-4" />
                            <input
                                id="dashboard-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Enter access key"
                                className="w-full bg-transparent border-none text-white placeholder-neutral-600 px-4 py-3 focus:outline-none text-sm tracking-widest"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                aria-label="Sign in"
                                className="p-2 mr-2 text-neutral-400 hover:text-white disabled:opacity-40"
                            >
                                <ArrowRight aria-hidden="true" className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* aria-live so the rejection is announced, not just shown. */}
                    <p aria-live="polite" className="mt-3 min-h-[1.25rem] text-xs font-medium text-red-400">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleLogout}
                className="fixed top-24 right-6 z-40 inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur hover:bg-white"
            >
                <LogOut aria-hidden="true" className="w-3.5 h-3.5" />
                Sign out
            </button>
            {children}
        </div>
    );
}

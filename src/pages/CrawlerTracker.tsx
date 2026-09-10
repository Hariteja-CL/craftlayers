import { useEffect, useState } from 'react';
import { DashboardGate } from '../components/auth/DashboardGate';

/**
 * Internal crawler tracker.
 *
 * Every number here comes from real request data captured in middleware.
 * There is no sample data and no placeholder state that invents traffic — if
 * the store is unprovisioned or empty, the page says so plainly rather than
 * rendering an empty chart that reads as "no crawlers came".
 *
 * The page is careful about one claim in particular: a user-agent is
 * self-reported and forgeable, so every identity shown is what the client
 * called itself, not a verified fact. The header says this once, in plain
 * language, so the tables below cannot be misread as proof of identity.
 */

type Category = 'search' | 'ai' | 'social' | 'monitoring' | 'unknown';

interface Stats {
    configured: boolean;
    totals: { requests: number; families: number; byCategory: Record<Category, number> };
    families: { family: string; category: Category; count: number; lastSeen: number }[];
    topPages: { path: string; count: number }[];
    recent: { at: number; path: string; family: string; category: Category; userAgent?: string }[];
    firstSeen: number | null;
}

const CATEGORY_LABELS: Record<Category, string> = {
    search: 'Search crawler',
    ai: 'AI crawler',
    social: 'Social / link preview',
    monitoring: 'Monitoring / tooling',
    unknown: 'Unknown bot',
};

function formatWhen(ms: number): string {
    return new Date(ms).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function Tile({ label, value, note }: { label: string; value: string | number; note?: string }) {
    return (
        <div className="cl-surface-card border cl-border-border-color-default cl-radius-lg p-5">
            <div className="cl-text-050 cl-weight-medium cl-text-neutral-text-low-contrast uppercase tracking-widest mb-2">
                {label}
            </div>
            <div className="cl-text-500 cl-weight-bold cl-text-neutral-text-high-contrast">{value}</div>
            {note && <div className="cl-text-050 cl-text-neutral-text-low-contrast mt-1">{note}</div>}
        </div>
    );
}

/** Meaning is carried by the text, never by colour alone. */
function CategoryTag({ category }: { category: Category }) {
    return (
        <span className="inline-block cl-bg-neutral-surface-level-2 cl-text-neutral-text-medium-contrast cl-text-050 cl-weight-medium px-2 py-0.5 cl-radius-full whitespace-nowrap">
            {CATEGORY_LABELS[category] ?? category}
        </span>
    );
}

/**
 * The raw user-agent, collapsed.
 *
 * It is the only field that can identify an unrecognised bot, and it is also
 * long, ugly and written by the client — so it is available on demand and
 * never on sight. Unknown rows get the louder label because those are the ones
 * worth opening; a known crawler's string is there for the rarer question of
 * whether something calling itself Googlebot really said what Googlebot says.
 */
function UserAgent({ value, prominent }: { value: string; prominent: boolean }) {
    return (
        <details className="mt-1 w-full">
            <summary
                className={`cl-text-050 cursor-pointer cl-focus-ring ${
                    prominent
                        ? 'cl-text-neutral-text-medium-contrast'
                        : 'cl-text-neutral-text-low-contrast'
                }`}
            >
                {prominent ? 'Show user-agent' : 'user-agent'}
            </summary>
            <code className="block mt-1 p-2 cl-text-050 cl-text-neutral-text-medium-contrast cl-bg-neutral-surface-level-2 cl-radius-md break-all whitespace-pre-wrap">
                {value}
            </code>
        </details>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="cl-text-300 cl-weight-bold cl-text-neutral-text-high-contrast mb-4">{title}</h2>
            {children}
        </section>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return <p className="cl-text-100 cl-text-neutral-text-low-contrast">{children}</p>;
}

function TrackerBody() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/crawler-stats', { credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
            .then((d: Stats) => !cancelled && setStats(d))
            .catch(() => !cancelled && setError('Could not load crawler statistics.'));
        return () => {
            cancelled = true;
        };
    }, []);

    if (error) return <Empty>{error}</Empty>;
    if (!stats) return <Empty>Loading…</Empty>;

    if (!stats.configured) {
        return (
            <div className="cl-surface-card border cl-border-border-color-default cl-radius-lg p-6">
                <h2 className="cl-text-300 cl-weight-bold cl-text-neutral-text-high-contrast mb-3">
                    No storage provisioned yet
                </h2>
                <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175">
                    Capture is deployed and running, but no Blob credentials were found, so nothing is being
                    written. Connect a Vercel Blob store to this project — that provisions either{' '}
                    <code>BLOB_STORE_ID</code> (OIDC) or <code>BLOB_READ_WRITE_TOKEN</code>, and either one is
                    enough — then redeploy. Data starts from that moment; there is no backfill.
                </p>
            </div>
        );
    }

    const { totals, families, topPages, recent, firstSeen } = stats;
    const unknown = families.filter((f) => f.category === 'unknown');

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <Tile label="Crawler requests" value={totals.requests} />
                <Tile label="Crawler families" value={totals.families} />
                <Tile label="AI crawler" value={totals.byCategory.ai} />
                <Tile label="Search crawler" value={totals.byCategory.search} />
            </div>

            <Section title="Crawlers seen">
                {families.length === 0 ? (
                    <Empty>No crawler requests recorded yet.</Empty>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full cl-text-100 text-left">
                            <thead className="cl-text-neutral-text-low-contrast">
                                <tr>
                                    <th className="py-2 pr-4 font-medium">Family (claimed)</th>
                                    <th className="py-2 pr-4 font-medium">Category</th>
                                    <th className="py-2 pr-4 font-medium">Requests</th>
                                    <th className="py-2 font-medium">Last seen</th>
                                </tr>
                            </thead>
                            <tbody className="cl-text-neutral-text-medium-contrast">
                                {families.map((f) => (
                                    <tr key={f.family} className="border-t cl-border-border-color-default">
                                        <td className="py-2 pr-4 cl-text-neutral-text-high-contrast">{f.family}</td>
                                        <td className="py-2 pr-4"><CategoryTag category={f.category} /></td>
                                        <td className="py-2 pr-4">{f.count}</td>
                                        <td className="py-2 whitespace-nowrap">{formatWhen(f.lastSeen)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>

            <Section title="Most crawled pages">
                {topPages.length === 0 ? (
                    <Empty>Nothing recorded yet.</Empty>
                ) : (
                    <ul className="space-y-2">
                        {topPages.map((p) => (
                            <li
                                key={p.path}
                                className="flex items-baseline justify-between gap-4 border-b cl-border-border-color-default pb-2"
                            >
                                <span className="cl-text-100 cl-text-neutral-text-high-contrast break-all">{p.path}</span>
                                <span className="cl-text-100 cl-text-neutral-text-low-contrast shrink-0">{p.count}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Section>

            <Section title="Unknown bot activity">
                {unknown.length === 0 ? (
                    <Empty>No unrecognised bots so far.</Empty>
                ) : (
                    <ul className="space-y-2">
                        {unknown.map((f) => (
                            <li key={f.family} className="cl-text-100 cl-text-neutral-text-medium-contrast">
                                {f.family} — {f.count} request{f.count === 1 ? '' : 's'}, last seen{' '}
                                {formatWhen(f.lastSeen)}
                            </li>
                        ))}
                    </ul>
                )}
            </Section>

            <Section title="Recent activity">
                {recent.length === 0 ? (
                    <Empty>Nothing recorded yet.</Empty>
                ) : (
                    <ul className="space-y-2">
                        {recent.map((h, i) => (
                            <li
                                key={`${h.at}-${i}`}
                                className="border-b cl-border-border-color-default pb-2 cl-text-100"
                            >
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <span className="cl-text-neutral-text-low-contrast whitespace-nowrap">
                                        {formatWhen(h.at)}
                                    </span>
                                    <span className="cl-text-neutral-text-high-contrast">{h.family}</span>
                                    <CategoryTag category={h.category} />
                                    <span className="cl-text-neutral-text-medium-contrast break-all">
                                        {h.path}
                                    </span>
                                </div>
                                {h.userAgent && (
                                    <UserAgent value={h.userAgent} prominent={h.category === 'unknown'} />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </Section>

            <p className="cl-text-050 cl-text-neutral-text-low-contrast">
                {firstSeen
                    ? `Observation window starts ${formatWhen(firstSeen)}. There is no data from before capture was deployed.`
                    : 'Capture is running. No crawler requests have been recorded yet.'}
            </p>
        </>
    );
}

export function CrawlerTracker() {
    return (
        <DashboardGate>
            <div className="pb-20">
                <header className="max-w-3xl pt-8 pb-10">
                    <p className="cl-text-075 cl-weight-medium cl-text-neutral-text-low-contrast uppercase tracking-widest mb-4">
                        Internal
                    </p>
                    <h1 className="cl-text-600 cl-weight-bold cl-text-neutral-text-high-contrast mb-6">
                        Crawler tracker
                    </h1>
                    <p className="cl-text-200 cl-text-neutral-text-medium-contrast cl-leading-175">
                        Which automated clients request pages on this site, captured at the edge. Identities are{' '}
                        <strong>claimed, not verified</strong> — a user-agent is self-reported and anyone can
                        call themselves Googlebot. This shows crawling, not indexing and not search ranking;
                        for those, use Google Search Console.
                    </p>
                </header>
                <TrackerBody />
            </div>
        </DashboardGate>
    );
}

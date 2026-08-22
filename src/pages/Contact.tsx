import { useState } from 'react';
import { Check, Copy, Download, MapPin } from 'lucide-react';

/**
 * Contact — replaces the inline "Coming Soon" stub.
 *
 * Deliberately form-free. A form would need a backend, validation, spam
 * handling and a privacy notice; a copyable address and a LinkedIn link are
 * more reliable and give the visitor a path that cannot silently fail.
 */

const EMAIL = 'haritejanandipati@gmail.com';

const TOPICS = [
    'Senior product-design roles',
    'Enterprise SaaS products',
    'Analytics and dashboard experiences',
    'AI-enabled product workflows',
    'Design systems and governance',
    'Privacy-aware UX',
];

export function Contact() {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard can be blocked; the mailto link below still works.
        }
    };

    return (
        <div className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-4xl mx-auto px-6">

                <header className="pt-12">
                    <h1 className="text-4xl md:text-6xl font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.1]">
                        Get in touch
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-relaxed font-medium max-w-3xl">
                        Working on a complex enterprise product, an analytics experience or an AI-enabled
                        workflow? I'd be glad to talk it through.
                    </p>
                </header>

                {/* Topics */}
                <section className="pt-14">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-5">
                        Happy to talk about
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2.5">
                        {TOPICS.map((t) => (
                            <li key={t} className="flex gap-3 text-base cl-text-neutral-text-medium-contrast">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full cl-bg-brand-primary-base mt-2.5 shrink-0" />
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Ways to reach */}
                <section className="pt-14">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] cl-text-neutral-text-low-contrast mb-5">
                        Ways to reach me
                    </h2>

                    <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest cl-text-neutral-text-low-contrast mb-1">Email</p>
                                <a
                                    href={`mailto:${EMAIL}`}
                                    className="text-lg font-semibold cl-text-neutral-text-high-contrast hover:cl-text-brand-primary-base transition-colors cl-focus-ring rounded"
                                >
                                    {EMAIL}
                                </a>
                            </div>
                            <button
                                type="button"
                                onClick={copyEmail}
                                className="inline-flex items-center gap-2 rounded-lg border cl-border-border-color-strong px-4 py-2 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                            >
                                {copied ? <Check aria-hidden="true" className="w-4 h-4" /> : <Copy aria-hidden="true" className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy address'}
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t cl-border-border-color-default flex flex-wrap gap-3">
                            <a
                                href="https://linkedin.com/in/hariteja-nandipati"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                            >
                                Connect on LinkedIn
                            </a>
                            <a
                                href="/Hariteja-Nandipati-Resume.pdf"
                                download="Hariteja-Nandipati-Resume.pdf"
                                className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-sm font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                            >
                                <Download aria-hidden="true" className="w-4 h-4" />
                                Download résumé
                            </a>
                        </div>
                    </div>

                    <p className="mt-5 inline-flex items-center gap-2 text-sm cl-text-neutral-text-medium-contrast">
                        <MapPin aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast" />
                        Hyderabad, India
                    </p>
                </section>

                {/* Private walkthrough */}
                <section className="pt-14">
                    <div
                        style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                        className="border-l-2 pl-6"
                    >
                        <h2 className="text-base font-bold cl-text-neutral-text-high-contrast mb-2">
                            Confidential work
                        </h2>
                        <p className="text-base cl-text-neutral-text-medium-contrast leading-relaxed max-w-2xl">
                            Some of the work is published in sanitised form, with synthetic examples in place of
                            client data. The full evidence behind those cases — the real figures, findings and
                            decisions — can be discussed privately in an interview.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

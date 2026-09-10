import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import { ArrowRight } from 'lucide-react';

/**
 * /work/design — the public case.
 *
 * Nine sections to eight, 732 words to 694 — on the rule that the public page
 * proves judgement and the protected layer carries the operating detail.
 *
 * The word count barely moves, and that is the honest result rather than a
 * disappointing one. Roughly 200 words of industry commentary and restated
 * summary came out; roughly 160 words of product context, constraint and
 * limitation went in, because the page previously named no product, no
 * constraint and no measurement boundary at all. The page is not shorter so
 * much as it is now about something.
 *
 * WHAT LEFT, AND WHY.
 *
 * The opening section argued that AI makes system maturity more important.
 * True, and said by everyone; it spent the reader's first screen on an
 * industry claim rather than on this product. "What this demonstrates" was a
 * bulleted restatement of the three sections above it. Both are gone.
 *
 * WHAT IS MARKED TO MOVE, NOT DELETED.
 *
 * The rule anatomy, the implementation chain, the token architecture, the AI
 * constraints and the review procedures are named in the closing section and
 * live nowhere in this file. When the protected layer is built, that is the
 * content it takes — none of it has to be recovered from git first.
 *
 * PROVENANCE NOTE. The product context here (EnCulture at NHR Technologies,
 * governing Assessments, Multi-Rater and Culture Intelligence) matches the
 * evidence library and the homepage card. The previous version of this page
 * carried no product context at all and closed by saying CraftLayers was the
 * primary consumer of the system. Those are different claims; this page now
 * states the approved one, and keeps the part of the old caveat that is
 * independently true — nothing here is a measured organisational outcome.
 */

const PROSE = 'text-[17px] md:text-lg leading-[1.75] cl-text-neutral-text-medium-contrast max-w-[65ch]';
const LABEL = 'text-xs font-bold uppercase tracking-[0.18em] cl-text-neutral-text-medium-contrast';
const QUOTE =
    'mt-8 border-l-2 pl-6 text-lg md:text-xl font-medium cl-text-neutral-text-high-contrast leading-[1.6]';

const OWNED = [
    [
        'Product and UX principles',
        'The decisions that kept recurring, written so they could be applied without asking what was originally meant.',
    ],
    [
        'Reusable product patterns',
        'The shared expression of those decisions across all three product environments.',
    ],
    [
        'Design-system governance',
        'Deciding what becomes a rule, what stays a local choice, and how a disagreement between the two gets resolved.',
    ],
    [
        'Implementation review',
        'Staying close enough to production to see where the built experience had drifted from what was agreed.',
    ],
];

function Section({ id, label, title, children }: {
    id: string; label: string; title: string; children: React.ReactNode;
}) {
    return (
        <section className="pt-20 md:pt-24">
            <p className={`${LABEL} mb-4`}>{label}</p>
            <h2 id={id} className="text-2xl md:text-[2.1rem] font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.2] scroll-mt-28 max-w-[26ch]">
                {title}
            </h2>
            <div className="mt-6">{children}</div>
        </section>
    );
}

export function DesignLayers() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen pb-24">
            <div className="max-w-3xl mx-auto px-6">

                <header className="pt-10">
                    <div className="mb-8">
                        <Breadcrumbs items={[
                            { label: 'Home', path: '/' },
                            { label: 'Work', path: '/work' },
                            { label: 'Turning Design Decisions into Implementation Rules' },
                        ]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="solid">System story</Badge>
                        <Badge variant="secondary">Design Systems</Badge>
                        <Badge variant="secondary">Product Systems</Badge>
                        <Badge variant="secondary">AI-enabled Delivery</Badge>
                    </div>

                    <h1 className="text-[2.5rem] md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.08] tracking-tight">
                        Turning Design Decisions into Implementation Rules
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-[1.55] font-medium max-w-[48ch]">
                        One UX decision, three products, and the difference between agreeing something and
                        being able to build against it.
                    </p>
                    <p className="mt-5 text-sm cl-text-neutral-text-low-contrast">
                        Public summary · EnCulture at NHR Technologies
                    </p>
                </header>

                {/* 1 · Product context, and the constraint that follows from it */}
                <Section id="context" label="01 · Context" title="Three products, one set of decisions">
                    <p className={PROSE}>
                        EnCulture at NHR Technologies is a B2B culture analytics platform made of three product
                        environments — Assessments, Multi-Rater and Culture Intelligence. They share users,
                        they share vocabulary, and they were built on different implementation foundations.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        That last part is the constraint the rest of this follows from. Standardising the
                        underlying stack was not on the table, so whatever kept the three products coherent had
                        to work across foundations that were not going to converge.
                    </p>
                </Section>

                {/* 2 · The problem */}
                <Section id="problem" label="02 · The problem" title="The same decision, implemented three ways">
                    <p className={PROSE}>
                        Not for want of agreement. Decisions were made, and then made again — they lived in
                        design files and in conversations, which is to say they lived nowhere a team could build
                        against. Six months later the same question came back, and whoever answered it that time
                        answered it slightly differently.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Handoff did not fix this, and could not. A handoff transfers a screen. It does not
                        transfer the judgement behind the screen, so the next person implementing something
                        similar inherits an example rather than a reason.
                    </p>
                </Section>

                {/* 3 · Role */}
                <Section id="owned" label="03 · My role" title="What I owned">
                    <dl className="space-y-6">
                        {OWNED.map(([t, d]) => (
                            <div key={t}>
                                <dt className="text-lg font-bold cl-text-neutral-text-high-contrast">{t}</dt>
                                <dd className={`${PROSE} mt-1.5`}>{d}</dd>
                            </div>
                        ))}
                    </dl>
                </Section>

                {/* 4 · The decision */}
                <Section id="decision" label="04 · The decision" title="A decision is not finished until it can be built against">
                    <p className={PROSE}>
                        The change was not a better component library. It was treating a recurring decision as
                        unfinished until it existed as a rule, in shared language, that someone could apply
                        without me in the room.
                    </p>

                    <p style={{ borderColor: 'var(--cl-color-brand-primary-base)' }} className={`${QUOTE} max-w-[46ch]`}>
                        We are not maintaining a Figma file. We are maintaining the experience of a product.
                    </p>

                    <div className="mt-10">
                        <h3 className="text-xl font-bold cl-text-neutral-text-high-contrast">No silent drift</h3>
                        <p className={`${PROSE} mt-2`}>
                            Design and engineering can challenge a rule when technical, accessibility,
                            performance or product constraints require it. What matters is that the outcome
                            becomes an explicit shared decision rather than an undocumented difference between
                            design and production. Governance here means the disagreement is visible — not that
                            the rule always wins.
                        </p>
                    </div>
                </Section>

                {/* 5 · What changed — visual 1, the worked example */}
                <Section id="changed" label="05 · What changed" title="One decision, expressed in the product">
                    <figure className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <dl className="space-y-5">
                            <div>
                                <dt className={LABEL}>Decision</dt>
                                <dd className="mt-1.5 text-lg cl-text-neutral-text-high-contrast leading-relaxed">
                                    The primary action should remain visually obvious.
                                </dd>
                            </div>
                            <div>
                                <dt className={LABEL}>Governed rule</dt>
                                <dd className="mt-1.5 text-lg font-semibold cl-text-neutral-text-high-contrast leading-relaxed">
                                    One primary action per view.
                                </dd>
                            </div>
                            <div>
                                <dt className={LABEL}>Across the products</dt>
                                <dd className="mt-1.5 text-[17px] cl-text-neutral-text-medium-contrast leading-relaxed">
                                    Components carry a consistent primary and secondary hierarchy, so attention
                                    lands in one place instead of being split between competing calls to action.
                                </dd>
                            </div>
                        </dl>
                    </figure>
                    <p className={`${PROSE} mt-6`}>
                        The decision is not a styling preference. It is a judgement about attention, in a form
                        someone else can apply — in any of the three products, without having to ask what was
                        originally meant.
                    </p>
                </Section>

                {/* 6 · Evidence and outcome — visual 2, the loop */}
                <Section id="outcome" label="06 · Outcome" title="How a decision stays decided">
                    <figure className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-6 md:p-8">
                        <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
                            {['Evidence', 'Decision', 'Governed rule', 'Products'].map((s, i, arr) => (
                                <li key={s} className="flex items-center gap-3">
                                    <span className="rounded-full border cl-border-border-color-default cl-bg-neutral-surface-level-0 px-4 py-2 text-[15px] font-semibold cl-text-neutral-text-high-contrast">
                                        {s}
                                    </span>
                                    {i < arr.length - 1 && <ArrowRight aria-hidden="true" className="w-4 h-4 cl-text-neutral-text-low-contrast" />}
                                </li>
                            ))}
                        </ol>
                        <figcaption className="mt-5 text-[15px] leading-relaxed cl-text-neutral-text-medium-contrast">
                            What people do with the shipped product becomes evidence again, and feeds the next
                            decision.
                        </figcaption>
                    </figure>
                    <p className={`${PROSE} mt-6`}>
                        The result is a principle-driven governance model: recurring design decisions become
                        shared rules across the three products, rather than being re-argued per product per
                        quarter.
                    </p>
                    <p style={{ borderColor: 'var(--cl-color-brand-primary-base)' }} className={`${QUOTE} max-w-[52ch]`}>
                        AI accelerates repetitive production work. Product and design decisions stay
                        human-owned, and AI-assisted implementation works inside those constraints rather than
                        around them.
                    </p>
                </Section>

                {/* 7 · Limitations */}
                <Section id="limitations" label="07 · Limitations" title="What this does not prove">
                    <p className={PROSE}>
                        No adoption figure or organisational-impact measurement is attached to this work. What
                        it demonstrates is system thinking, implementation alignment and application across
                        three products — not a business outcome.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Anyone claiming a design system moved a business metric should be able to show the
                        measurement. I cannot, so I do not.
                    </p>
                </Section>

                {/* 8 · Deeper detail. The CTA points at /contact, which is a real
                    route — there is no access flow yet and this page does not
                    pretend otherwise. The list here is also the manifest for the
                    protected layer when it is built. */}
                <Section id="deeper" label="08 · Going deeper" title="The detailed case study">
                    <p className={PROSE}>
                        The full model behind this — the rule anatomy, the implementation chain, the token
                        architecture, the AI constraints and the review procedures — includes internal product
                        material. Detailed project evidence is available for hiring and review conversations.
                    </p>
                    <div className="mt-7">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                        >
                            Get in touch
                            <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
                    </div>
                </Section>
            </div>
        </article>
    );
}

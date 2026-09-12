import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Badge } from '../../components/ui/Badge';
import { CaseStudyJumpNav } from '../../components/case-study/CaseStudyJumpNav';
import {
    CaseMeta,
    Compare,
    DecisionLoop,
    Fanout,
    Flow,
    Ladder,
    Panel,
    Points,
    QuadMap,
    Statement,
} from '../../components/case-study/CaseStudyBeats';
import { ArrowRight } from 'lucide-react';

/**
 * /work/design-system-governance — long-form field note.
 *
 * A different format from the three public cases. Those answer "is this person
 * relevant to my role?" in sixty seconds. This one answers "how does this
 * person think?" over about ten minutes, and it is written as a story —
 * what I expected, what I found, what failed, what changed — rather than as a
 * case-study template.
 *
 * DELIBERATELY GENERIC. The employer and the three products are named
 * elsewhere on this site; this note is not about a project, it is about a
 * method, and it reads better without them. No internal token prefix, theme
 * name, file path, selector, threshold or count appears anywhere in it.
 *
 * THE HONESTY CONSTRAINTS, because they are easy to erode later:
 *   · no metric, no date, no adoption figure, no organisation-wide claim
 *   · the AI-versus-repository moment is one incident, not a standing process
 *   · the colour ambiguity is the category of failure, not an invented anecdote
 *   · the five questions are named as retrospective articulation
 *   · the system-gap register is confirmed practice and stated plainly
 *   · proposed layers are labelled NOT BUILT and must stay that way
 *
 * Prose is short-measure throughout (max-w-[68ch]); every chapter is broken by
 * a diagram, a pull quote or a structured block, because the failure mode for
 * a 2,700-word page is a wall nobody scrolls.
 */

const PROSE = 'text-[17px] md:text-lg leading-[1.75] cl-text-neutral-text-medium-contrast max-w-[68ch]';
const MICRO = 'text-[11px] font-bold uppercase tracking-[0.22em]';

const JUMP_TARGETS = [
    { id: 'machine', label: 'The audit' },
    { id: 'governance', label: 'Turning point' },
    { id: 'interrogate', label: 'Figma → CSS' },
    { id: 'gaps', label: 'Governance' },
    { id: 'exists', label: 'What exists' },
];

/** Three interfaces to one system. Page-local: used once, and generalising a
 *  three-column comparison before a second page needs it would be premature. */
function TriPanel({ items }: { items: { name: string; role: string }[] }) {
    return (
        <ul className="grid gap-4 md:grid-cols-3">
            {items.map((i) => (
                <li
                    key={i.name}
                    className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-0 p-5"
                >
                    <p className="text-lg font-bold cl-text-neutral-text-high-contrast">{i.name}</p>
                    <p className="mt-2 text-[15px] cl-text-neutral-text-medium-contrast leading-snug">{i.role}</p>
                </li>
            ))}
        </ul>
    );
}

function Chapter({ id, label, title, children }: {
    id: string; label: string; title: string; children: React.ReactNode;
}) {
    return (
        <section className="pt-20 md:pt-24">
            <p className={`${MICRO} cl-text-neutral-text-low-contrast mb-4`}>{label}</p>
            <h2
                id={id}
                className="text-2xl md:text-[2.1rem] font-bold cl-text-neutral-text-high-contrast tracking-tight leading-[1.2] scroll-mt-28 max-w-[26ch]"
            >
                {title}
            </h2>
            <div className="mt-7">{children}</div>
        </section>
    );
}

/** "What I expected / What I found" — the story beat that does the most work
 *  for a scanning reader, so it gets a shape of its own. */
function ExpectedFound({ expected, found }: { expected: string; found: string }) {
    return (
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border cl-border-border-color-default cl-bg-neutral-surface-level-1 p-5">
                <p className={`${MICRO} cl-text-neutral-text-low-contrast mb-2`}>What I expected</p>
                <p className="text-[16px] cl-text-neutral-text-high-contrast leading-snug">{expected}</p>
            </div>
            <div
                style={{ borderColor: 'var(--cl-color-brand-primary-base)' }}
                className="rounded-2xl border-2 cl-bg-neutral-surface-level-1 p-5"
            >
                <p className={`${MICRO} cl-text-brand-primary-base mb-2`}>What I found</p>
                <p className="text-[16px] cl-text-neutral-text-high-contrast leading-snug">{found}</p>
            </div>
        </div>
    );
}

export function DesignSystemGovernance() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <article className="cl-bg-neutral-surface-level-0 min-h-screen pb-28">
            <div className="max-w-3xl mx-auto px-6">

                {/* ── Hero ───────────────────────────────────────── */}
                <header className="pt-10">
                    <div className="mb-8">
                        <Breadcrumbs items={[
                            { label: 'Home', path: '/' },
                            { label: 'Work', path: '/work' },
                            { label: 'A Design System Is Not a Gallery' },
                        ]} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge variant="solid">Field note</Badge>
                        <Badge variant="secondary">Design systems &amp; AI</Badge>
                        <Badge variant="outline">Generalised · no confidential detail</Badge>
                    </div>

                    <h1 className="text-[2.5rem] md:text-6xl font-bold cl-text-neutral-text-high-contrast leading-[1.08] tracking-tight">
                        A Design System Is Not a Gallery
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl cl-text-neutral-text-medium-contrast leading-[1.55] font-medium max-w-[52ch]">
                        How my thinking about design systems, governance and product rules changed while
                        working through AI-assisted product development.
                    </p>

                    <p className="mt-8 text-[15px] italic cl-text-neutral-text-medium-contrast leading-relaxed max-w-[64ch] border-l-2 cl-border-border-color-strong pl-5">
                        This is not a traditional UX case study. It is a record of how my thinking about design
                        systems changed while working through AI-assisted product development, implementation
                        drift, and the need for shared product rules.
                    </p>

                    <div className="mt-9">
                        <CaseMeta
                            items={[
                                ['Type', 'Design systems · product architecture · AI-assisted workflows'],
                                ['Role', 'Senior UX Designer / Senior Product Designer'],
                                ['Focus', 'Rules, governance, implementation, AI-assisted product creation'],
                            ]}
                        />
                    </div>

                    <p className="mt-6 text-[13px] cl-text-neutral-text-low-contrast leading-relaxed max-w-[68ch]">
                        Some product details, implementation names, token names, and domain-specific examples
                        have been generalized to protect confidential information while preserving the
                        underlying design decisions, architecture, and process.
                    </p>

                    <div className="mt-8">
                        <CaseStudyJumpNav items={JUMP_TARGETS} />
                    </div>
                </header>

                {/* ── Why this matters ───────────────────────────── */}
                <Chapter id="why" label="Opening" title="Why this matters to my work">
                    <p className={PROSE}>
                        I work on complex product systems where design decisions have to survive across product,
                        UX, engineering, and increasingly AI-assisted workflows. Most of what I do is not drawing
                        screens. It is deciding what has to be true about a product, and then making that decision
                        durable enough that other people — and now other tools — can build from it without asking
                        me.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        This is the story of how I learned that the hard part isn't writing the decision down.
                        It's writing it down in a form that can't be misread.
                    </p>
                </Chapter>

                {/* ── Opening scene ──────────────────────────────── */}
                <Chapter id="start" label="Chapter one" title="I was asked what AI could change. I started in the wrong place.">
                    <p className={PROSE}>
                        During an AI-readiness exploration, I was asked to look at what AI could change in the
                        product, and how we might make the experience easier to work with in AI-assisted
                        workflows.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        I started where most product designers would. Whiteboarding opportunities. Mapping
                        workflows. Asking where AI could genuinely help rather than where we could bolt an AI
                        feature onto something and call it modern.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        The deeper I went, the more that framing felt wrong. The most important AI problem was not
                        sitting inside a feature. It was sitting underneath the product.
                    </p>

                    <div className="mt-10">
                        <Statement>
                            Everyone was technically using the brand. Nobody was using the same product language.
                        </Statement>
                        <p className="mt-4 text-[15px] italic cl-text-neutral-text-low-contrast max-w-[52ch] pl-6">
                            That sentence took me months to arrive at. This is how I got there.
                        </p>
                    </div>
                </Chapter>

                {/* ── The audit ──────────────────────────────────── */}
                <Chapter id="machine" label="Chapter two" title="Reading my own design system the way a machine would">
                    <p className={PROSE}>
                        So I went back to the system I had been building — and tried to read it from a completely
                        different perspective. Not as the person who knew why every decision existed. As a machine
                        encountering those decisions for the first time.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        This is the part I want to be precise about, because it's easy to mistake for an audit of
                        somebody else's work. It wasn't. I had been creating and evolving this system. I knew the
                        reasoning behind every rule in it, because in most cases the reasoning was mine. What
                        changed was not the system. It was the standard I was holding it to.
                    </p>

                    <div className="mt-10">
                        <Panel
                            tone="problem"
                            label="The questions that got uncomfortable"
                            caption="I could answer every one of these. That was the problem — I could answer them because I had been in the room."
                        >
                            <Points
                                items={[
                                    'Which colour is brand, and which one carries system state?',
                                    'Which one means something analytical?',
                                    'When two tokens look like they mean the same thing, which is authoritative?',
                                    'What is a tool supposed to do when the component it needs does not exist?',
                                ]}
                            />
                        </Panel>
                    </div>

                    <div className="mt-10">
                        <ExpectedFound
                            expected="A documentation gap. Something to write down more clearly."
                            found="An interpretation gap. The system was legible to people who already knew the answers."
                        />
                    </div>

                    <div className="mt-10">
                        <Compare
                            left={{
                                label: 'A human designer reads an ambiguous rule',
                                headline: '“I know what they probably meant.”',
                                items: ['Resolves it silently', 'Moves on', 'Never records the decision'],
                            }}
                            right={{
                                label: 'A coding agent reads the same rule',
                                headline: '“There are several valid options. Choose one.”',
                                items: ['Picks one', 'Commits confidently', 'Does not ask'],
                                tone: 'problem',
                            }}
                        />
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        Neither is wrong. But only one of them scales. Ambiguity that a person resolves silently
                        becomes dangerous the moment something automates it.
                    </p>
                </Chapter>

                {/* ── First assumption ───────────────────────────── */}
                <Chapter id="assumption" label="Chapter three" title="My first assumption was too simple">
                    <p className={PROSE}>
                        My first instinct was the obvious one: the rules already exist, so expose the system to the
                        tool and let it use them. I tested that — AI-assisted implementation against the
                        design-system foundations — and watched what came out.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Colour is where the assumption broke, and it broke cleanly.
                    </p>

                    <div className="mt-10">
                        <Panel
                            tone="problem"
                            caption="Because I knew the product, I could infer the right meaning from context without noticing I was doing it. A coding agent could not."
                        >
                            <Fanout
                                source={{ label: 'One colour in the system', value: 'Which meaning?' }}
                                outcomes={[
                                    { name: 'Brand emphasis', note: 'Product identity' },
                                    { name: 'Positive analytical value', note: 'A reading in a chart' },
                                    { name: 'Successful system state', note: 'An action completed' },
                                ]}
                            />
                        </Panel>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        The agent would choose something visually reasonable — a colour that looked correct on the
                        screen — while making the wrong semantic decision underneath. That is a worse failure than
                        an ugly result, because it passes review. Nothing looks broken. The meaning is just quietly
                        wrong.
                    </p>

                    <div className="mt-10">
                        <Statement>
                            Access to the design system was not the same as understanding the design system.
                        </Statement>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        That sentence took me a while to accept, because it meant the work ahead was not
                        integration work. A visual system can be complete and still carry implicit decisions,
                        overlapping meanings, weak semantic boundaries, and behaviour that lives in people's heads
                        rather than in the system. None of that shows up when you look at a component library. All
                        of it shows up when something tries to build from it.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        The colour problem is also where the eventual answer came from. But I didn't know that
                        yet. At this point I only knew the system couldn't tell the difference — and neither could
                        anything reading it.
                    </p>
                </Chapter>

                {/* ── Governance turning point ───────────────────── */}
                <Chapter id="governance" label="Chapter four" title="When more people could generate UI, consistency became a governance problem">
                    <p className={PROSE}>
                        Then the scale of the problem changed, and not because of anything I did. As AI-assisted
                        prototyping spread beyond the design team, people could put together a working prototype in
                        an afternoon. That is genuinely good — the distance between an idea and something you can
                        react to collapsed.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        But the outputs did not look like each other.
                    </p>

                    <div className="mt-10">
                        <Panel
                            tone="problem"
                            caption="Same logo. Same brand colours. Unmistakably different products."
                        >
                            <Fanout
                                source={{ label: 'One brand', value: 'Same logo, same colours' }}
                                outcomes={[
                                    { name: 'Prototype A', note: 'Its own spacing, its own states' },
                                    { name: 'Prototype B', note: 'Its own component language' },
                                    { name: 'Prototype C', note: 'Its own interpretation of the brand' },
                                ]}
                            />
                        </Panel>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        Then the feedback started arriving in UX. <em>This looks good. Can we use this? I like this
                        version better. Why doesn't our product look like this?</em>
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Those are fair questions. They are also unanswerable one at a time, because each one is
                        really asking <em>which version of us is the real one?</em>
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        I spent a while treating this as a UI consistency problem, which is the trap. It was not a
                        consistency problem. It was a governance problem that had simply become visible because
                        generation got cheap.
                    </p>
                </Chapter>

                {/* ── Library → decision ─────────────────────────── */}
                <Chapter id="library" label="Chapter five" title="I stopped treating the design system as a library">
                    <p className={PROSE}>
                        That was the turning point, and it was philosophical before it was practical. If anyone in
                        the organisation can generate an interface, the design system cannot stay a thing that only
                        designers know how to navigate. A library assumes a browser — someone who opens it,
                        understands the conventions, and picks correctly. That assumption breaks the moment the
                        thing doing the picking has never been in the room.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        So the unit of the system had to change. Not <strong>component</strong>. <strong
                        className="cl-text-neutral-text-high-contrast">Decision</strong>.
                    </p>

                    <div className="mt-10">
                        <Panel
                            label="A decision has to travel"
                            caption="Each step narrows interpretation. Implementation is where a decision either survives or quietly doesn't."
                        >
                            <Ladder
                                steps={[
                                    { name: 'UX principle', line: 'What we believe.' },
                                    { name: 'Product rule', line: 'What that means here.' },
                                    { name: 'Semantic decision', line: 'What it is called, and what it is for.' },
                                    { name: 'Token, pattern or component', line: 'What makes it buildable.' },
                                    { name: 'Implementation', line: 'Where it survives — or quietly does not.' },
                                ]}
                            />
                        </Panel>
                    </div>

                    <div className="mt-10">
                        <Statement>A principle nobody can build against is only a preference.</Statement>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        Rules at this level have to answer to more than visual taste. They carry UX principles,
                        product goals, accessibility expectations, brand intent, interaction behaviour, responsive
                        behaviour and implementation constraints — at once. That's what makes them expensive to
                        write and worth having.
                    </p>
                </Chapter>

                {/* ── Figma → CSS discovery ──────────────────────── */}
                <Chapter id="interrogate" label="Chapter six" title="I needed a language I could interrogate">
                    <p className={PROSE}>
                        I want to be honest about how this part went, because the tidy version would be a lie. I
                        did not start out thinking <em>the answer is CSS and Markdown.</em> I arrived there by
                        running out of alternatives.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        The foundations already lived in Figma variables — built and evolved over time. The obvious
                        first move was to get them out into something structured, so I exported them into
                        structured data. What came back was a large machine-readable representation of everything.
                        Primitives, semantic tokens, scales, layout values, component values, states. All of it
                        correct. All of it there.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        And I couldn't think in it.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        I could read any individual entry perfectly well. What I couldn't see was how the system
                        <em> held together</em> — how one rule propagated through the product, which decisions
                        depended on which, or where two entries quietly contradicted each other. The format was
                        faithful and almost useless for reasoning.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        So I started interrogating it. I used AI tools to ask questions of the export that I
                        couldn't answer by reading it: what does this value actually affect, what else changes if
                        this changes, where is this rule ambiguous, what would you assume here if nobody told you.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        That turned out to be the real work — not the tooling, but what the questions forced. Every
                        time I couldn't get a clean answer, it was because a decision existed in my head and not in
                        the system.
                    </p>

                    <div className="mt-10">
                        <Panel
                            label="How the layers were actually found"
                            caption="Not a plan. A sequence of dead ends, each one narrowing what the next representation had to do."
                        >
                            <Flow
                                steps={[
                                    { name: 'Figma foundations' },
                                    { name: 'Structured export' },
                                    { name: 'Hard to reason about', weak: true },
                                    { name: 'Interrogate with AI' },
                                    { name: 'Implicit → explicit rules' },
                                    { name: 'CSS: inspect & execute' },
                                    { name: 'Markdown: intent' },
                                ]}
                                weakLabel="dead end"
                            />
                        </Panel>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        CSS emerged from that, rather than being chosen for it. It was the representation where I
                        could see relationships — follow a rule across the whole system and watch where it held and
                        where it frayed. Designers can read the values. Developers already consume it. Semantics
                        become auditable.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Markdown came later, and for a different reason. CSS could express what a rule <em>was</em>.
                        It could not express why the rule existed, when it changed, or what to do when it didn't
                        cover your case. That intent needed somewhere to live too.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        This is the part people misread, so I'll be direct: none of this was CSS replacing Figma.
                        Figma remained the design surface — visual design, composition, interaction intent, the
                        place designers actually collaborate. CSS and Markdown solved different problems.
                    </p>

                    <div className="mt-10">
                        <Statement>
                            Figma is one interface to the design system. It should not be the only interface to the
                            design system.
                        </Statement>
                    </div>
                </Chapter>

                {/* ── Architecture emerges ───────────────────────── */}
                <Chapter id="architecture" label="Chapter seven" title="One rule at a time, the architecture emerged">
                    <p className={PROSE}>
                        Colour was the first place I applied this properly, and it's still the example I reach for
                        — because it's where the assumption had failed. A single green could mean a successful
                        system action. Or a positive analytical value. Or a score tier. Or simply brand.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Those are four different jobs. Collapsing them into one palette means a chart inherits the
                        emotional weight of a system alert — and a dashboard starts telling a leader to worry about
                        the wrong thing.
                    </p>

                    <div className="mt-10">
                        <Panel label="Four palettes, four jobs" caption="Separated deliberately, each with a prohibition attached.">
                            <QuadMap
                                items={[
                                    { name: 'Brand', role: 'Product identity, navigation, primary actions.', never: 'analytical meaning' },
                                    { name: 'Semantic UI', role: 'Interface structure and interaction states.', never: 'data values' },
                                    { name: 'System state', role: 'Success, warning, error — things the system is telling you.', never: 'chart segments' },
                                    { name: 'Data visualisation', role: 'Analytical meaning in charts and readings.', never: 'system status' },
                                ]}
                            />
                        </Panel>
                    </div>

                    <div className="mt-10">
                        <Statement>Analytical meaning is not system state.</Statement>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        As I worked through the rules, my checks gradually became a repeatable set of questions. I
                        didn't write them down as a framework at the time — this is me naming afterwards what I was
                        actually doing.
                    </p>

                    <Points
                        ordered
                        items={[
                            'Where can this be used?',
                            'Why does it exist?',
                            'When does the rule change?',
                            'What must not use it?',
                            'What happens if the system cannot express the need?',
                        ]}
                    />

                    <p className={`${PROSE} mt-8`}>
                        Question four is the one teams skip, and it does the most work — a rule without a
                        prohibition is a suggestion. Question five is the one that turned out to matter most later.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        The same checks went through typography, spacing, density, radius, component states,
                        responsive behaviour, accessibility, layout and visualisation. Slowly, the answers stopped
                        being a set of rules and started being an architecture.
                    </p>
                </Chapter>

                {/* ── Three interfaces ───────────────────────────── */}
                <Chapter id="interfaces" label="Chapter eight" title="The final output was not another Figma page">
                    <div className="mb-8">
                        <TriPanel
                            items={[
                                { name: 'Figma', role: 'Visual design, composition, collaboration.' },
                                { name: 'CSS', role: 'Executable implementation rules.' },
                                { name: 'Markdown', role: 'Readable intent, guidance and constraints.' },
                            ]}
                        />
                    </div>

                    <p className={PROSE}>
                        Design decisions were increasingly expressed in implementation-readable documentation and
                        rules rather than living only in a design file. That matters because of who can then use
                        them: designers can inspect them, engineers can implement against them, product teams can
                        reference them, and AI tools can consume them — without any of those groups
                        reverse-engineering a Figma file.
                    </p>

                    <div className="mt-10">
                        <Statement>
                            A design decision is not finished when it appears in Figma. It is finished when it
                            survives implementation.
                        </Statement>
                    </div>
                </Chapter>

                {/* ── System gaps ────────────────────────────────── */}
                <Chapter id="gaps" label="Chapter nine" title="Missing became a valid system state">
                    <p className={PROSE}>
                        The hardest governance rule wasn't telling people what to use. It was telling them what to
                        do when the system had no answer.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        That's the moment where systems actually break. Someone needs a state that doesn't exist,
                        they're under deadline, and they solve it locally. It ships. It becomes permanent. Six
                        months later there are three versions of it.
                    </p>

                    <div className="mt-10">
                        <Panel label="The rule" caption="This ran in practice, not just on paper. Missing colours, tokens, components, patterns and rules were logged and reviewed rather than becoming local one-off solutions.">
                            <DecisionLoop
                                need="Someone needs a colour, token, component, pattern or state."
                                question="Does a rule already exist for this?"
                                yesPath={{ label: 'Yes', steps: ['Reuse it.', 'No local variant.', 'No new token.'] }}
                                noPath={{
                                    label: 'No',
                                    steps: [
                                        'Log a system gap.',
                                        'Understand why it is missing.',
                                        'Review it.',
                                        'Extend the shared system if justified.',
                                    ],
                                }}
                                returns="The product stays inside one language, and the system learns what it was missing."
                            />
                        </Panel>
                    </div>

                    <div className="mt-10">
                        <Statement>
                            A missing rule is a system gap, not permission to improvise locally.
                        </Statement>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        That's what protects against token drift, duplicate components, product-specific patches
                        becoming permanent, and — increasingly — an AI tool inventing something plausible because
                        nothing told it not to.
                    </p>
                </Chapter>

                {/* ── AI proposal vs evidence ────────────────────── */}
                <Chapter id="evidence" label="Chapter ten" title="AI output is a proposal. System state is evidence.">
                    <p className={PROSE}>
                        One moment from a migration stuck with me. An AI-generated implementation report described
                        work as complete. The repository said otherwise. The two did not agree.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        I treated the repository as authoritative and stopped the phase rather than accept the
                        report.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        That sounds small. It isn't. The report was coherent, confident and wrong — which is
                        exactly the failure mode you should expect, and exactly the one that's easiest to wave
                        through when you're moving fast and the summary agrees with what you hoped.
                    </p>

                    <div className="mt-10">
                        <Statement tone="insight">
                            AI output is a proposal. Governed system state is evidence.
                        </Statement>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        Using these tools well is mostly about knowing which artefact you're allowed to trust.
                    </p>
                </Chapter>

                {/* ── Many creators ──────────────────────────────── */}
                <Chapter id="creators" label="Chapter eleven" title="One architecture, many creators">
                    <div className="mb-8">
                        <Panel label="Where the architecture sits in the organisation">
                            <Flow
                                steps={[
                                    { name: 'Business idea' },
                                    { name: 'Governed system context' },
                                    { name: 'Rapid POC' },
                                    { name: 'Stakeholder validation' },
                                    { name: 'Product refinement' },
                                    { name: 'UX validation' },
                                    { name: 'Engineering implementation' },
                                ]}
                            />
                        </Panel>
                    </div>

                    <Points
                        items={[
                            <><strong className="cl-text-neutral-text-high-contrast">Leadership</strong> — explore an idea quickly without inventing a new interface language to do it.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Product</strong> — refine value propositions and workflows on the same foundation.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">UX</strong> — spend attention on user needs, behaviour, edge cases, accessibility and interaction quality rather than re-deciding foundational UI.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">Engineering</strong> — build against semantic components, tokens and responsive rules instead of reverse-engineering a design file.</>,
                            <><strong className="cl-text-neutral-text-high-contrast">AI tools</strong> — generate bounded output inside the same constraints.</>,
                        ]}
                    />

                    <p className={`${PROSE} mt-8`}>
                        AI doesn't replace UX in this picture. It shortens the distance between an idea and
                        something testable. What UX does with that shorter distance is the actual opportunity.
                    </p>
                </Chapter>

                {/* ── Where useful ───────────────────────────────── */}
                <Chapter id="useful" label="Chapter twelve" title="Where this becomes useful">
                    <p className={PROSE}>
                        I want to be careful here, because this is where design-system writing usually starts
                        claiming things it can't support. These are capabilities the architecture enables, not
                        outcomes I measured.
                    </p>

                    <div className="mt-8">
                        <Points
                            columns={2}
                            items={[
                                <><strong className="cl-text-neutral-text-high-contrast">Explore faster</strong> — rapid client POCs, product ideation, AI-assisted concepts, stakeholder conversations.</>,
                                <><strong className="cl-text-neutral-text-high-contrast">Build consistently</strong> — UX refinement, engineering implementation, responsive behaviour, accessibility, brand consistency, visualisation rules.</>,
                                <><strong className="cl-text-neutral-text-high-contrast">Scale safely</strong> — multiple products, multiple teams, new joiners, AI coding agents, system-gap governance.</>,
                                <><strong className="cl-text-neutral-text-high-contrast">Learn faster</strong> — client feedback, user testing, iteration, feeding validated patterns back into the system.</>,
                            ]}
                        />
                    </div>

                    <div className="mt-10">
                        <Statement>
                            The value was not that everyone could access the same components. It was that more
                            people could explore, test and build ideas without creating a new product language
                            every time.
                        </Statement>
                    </div>
                </Chapter>

                {/* ── Proof ──────────────────────────────────────── */}
                <Chapter id="proof" label="Chapter thirteen" title="Proving it against implementation">
                    <p className={PROSE}>
                        None of this would be worth writing down if it had stayed a model.
                    </p>
                    <Points
                        items={[
                            'One product became the reference implementation.',
                            'Runtime behaviour was validated; component rules were tested.',
                            'Responsive behaviour and accessibility were checked.',
                            'Migration phases could stop when validation failed — and did.',
                            'Later work reused that reference rather than starting again.',
                        ]}
                    />
                    <div className="mt-10">
                        <Statement>
                            Governance was not theoretical. It was tested against implementation reality.
                        </Statement>
                    </div>
                </Chapter>

                {/* ── Current vs NOT BUILT ───────────────────────── */}
                <Chapter id="exists" label="Chapter fourteen" title="What exists, and what does not">
                    <p className={`${PROSE} mb-8`}>
                        I'd rather be precise about this than impressive.
                    </p>

                    <Compare
                        left={{
                            label: 'What exists',
                            headline: 'Built and in use',
                            items: [
                                'UX principles',
                                'Semantic token architecture',
                                'Semantic colour separation',
                                'Responsive and layout rules',
                                'Component behaviour',
                                'Canonical design-system stylesheet',
                                'Implementation-readable guidance',
                                'System-gap governance',
                                'Agent implementation constraints',
                                'Migration and validation experience',
                            ],
                            tone: 'suggestion',
                        }}
                        right={{
                            label: 'Proposed — NOT BUILT',
                            headline: 'Designed, not delivered',
                            items: [
                                'Generated machine contracts',
                                'Central registry',
                                'Automated validation layer',
                                'Query interface',
                                'Read-only MCP',
                                'Deeper agent integration',
                            ],
                            tone: 'problem',
                        }}
                    />

                    <p className={`${PROSE} mt-8`}>
                        I have opinions about how the right-hand column should work. I have not built it, and this
                        note does not pretend otherwise.
                    </p>
                </Chapter>

                {/* ── Ending ─────────────────────────────────────── */}
                <Chapter id="question" label="Closing" title="The question I ended with">
                    <p className={PROSE}>
                        I started the work asking how AI could fit into the product. I ended with a different
                        question.
                    </p>

                    <div className="mt-10">
                        <Statement>
                            If AI allows almost anyone to create product interfaces, what keeps all of those
                            interfaces part of the same product?
                        </Statement>
                    </div>

                    <p className={`${PROSE} mt-8`}>
                        My answer became the design system — not as a library people browse, but as an architecture
                        of rules that people and tools can build from.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        Figma is one interface to that architecture. CSS makes the rules executable. Markdown makes
                        the intent portable. Governance keeps the system coherent.
                    </p>
                    <p className={`${PROSE} mt-5`}>
                        My role changed with it. I moved from designing components to designing the rules that let
                        product decisions survive across design, product, engineering and automation.
                    </p>

                    <div className="mt-12 pt-10 border-t cl-border-border-color-default">
                        <p className="text-[15px] cl-text-neutral-text-medium-contrast leading-relaxed max-w-[60ch]">
                            The shorter, project-framed version of this work — named products, named employer — is
                            on the case study page.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/work/design"
                                className="inline-flex items-center gap-2 rounded-xl border cl-border-border-color-strong px-5 py-3 text-[15px] font-semibold cl-text-neutral-text-high-contrast hover:cl-bg-neutral-surface-level-2 transition-colors cl-focus-ring"
                            >
                                Read the case study
                                <ArrowRight aria-hidden="true" className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold cl-bg-brand-primary-base cl-text-white hover:cl-bg-brand-primary-interaction transition-colors cl-focus-ring"
                            >
                                Get in touch
                                <ArrowRight aria-hidden="true" className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </Chapter>
            </div>

            <footer className="mt-28 pt-16 border-t cl-border-border-color-default">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] cl-text-neutral-text-low-contrast mb-6">More work</h2>
                    <Link
                        to="/work"
                        className="group inline-flex items-center gap-3 text-2xl md:text-4xl font-bold cl-text-neutral-text-high-contrast hover:cl-text-brand-primary-base transition-colors cl-focus-ring rounded-lg px-2"
                    >
                        Return to Work
                        <ArrowRight aria-hidden="true" className="w-7 h-7 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </footer>
        </article>
    );
}

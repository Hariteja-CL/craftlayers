import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the dashboard-explainability case study.
 *
 * One section per visible section, in the same order — the page maps narration
 * index to section id, so the two files have to be edited together.
 *
 * This is a spoken transposition of the approved page copy, not a second
 * version of the story. It narrates the insight behind each visual rather than
 * the labels inside it; reading a diagram aloud node by node produces a
 * transcript nobody can follow.
 *
 * The same hierarchy the page holds, the narration holds: Read, Interpret,
 * Trust, Act is the model; inspectability is the insight; the four explanation
 * rules support the model and are spoken as support, not announced as a second
 * framework; the card rule is a closing clause.
 *
 * Public-safe: the employer and product environment are named because they are
 * approved public context. The relationship manager is described only by role.
 * No real score, formula, threshold or client name is spoken, and the
 * implementation statuses are spoken in their approved wording.
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'What happened',
        body:
            'Interpreting the dashboard frequently depended on somebody from the product team explaining it. A client-facing relationship manager who used the dashboard operationally was the one surfacing this. She supported clients through participation, reviewed results with them, and kept bringing back the same questions and interpretation gaps from those conversations. So the dashboard had two jobs: help decision-makers understand and act, and help client-facing teams explain the same information consistently. The second was failing, which exposed weaknesses in the first.',
    },
    {
        title: 'Who was reading it',
        body:
            'Not everyone needed the same depth, and treating every reader as if they did was part of the problem. Leadership and senior decision-makers needed the essential signal first. Managers and HR and programme owners needed that signal plus enough context to act at their level. Client-facing operational users needed metric definitions, calculation context, contributing inputs and supporting evidence, because they have to defend the number out loud.',
    },
    {
        title: 'What I observed',
        body:
            'A score with no reasoning attached. A number on a card, and three questions the screen did not answer: what produced this number, what does this colour mean, and why is this action recommended? Someone had to answer them, so the explanation burden had moved out of the product and into a person\'s working day. The weakest signals were not in the layout. They were in the explanation around the metrics, the colours, the evidence and the actions.',
    },
    {
        title: 'What that changed in my understanding',
        body:
            'A reader does not trust a score because it is displayed. Organisations often already use their own models, weightings and rating scales, and a number that disagrees with one has to show its working. Four things have to happen before someone can act on a number. Read: what am I seeing? Interpret: what does it mean? Trust: can I inspect how this was produced? And act: what should happen next? Trust was the stage that was missing. When one stage is weak, readers lean on someone else\'s explanation or decide with incomplete context — a working model from this review, not a general law. Trust is created through inspectability.',
    },
    {
        title: 'What I designed',
        body:
            'Four rules for making a stage hold. Explain the number: what it represents, what contributed, what it means, what action it supports. Explain the colour: brand colour identifies the product, and data colour has to explain the data — semantic consistency, not a mandated palette. Show the evidence: scores and recommendations connect back to contributing metrics, charts and qualitative evidence. And support the decision: why it matters, what to do, who owns it, what makes it defensible. One thing cuts across all four — disclose detail on demand. The default view stays concise and the reasoning stays available. Clarity does not mean showing everything; it means showing the right level at the right moment. Nothing was removed between the dense version of a card and the layered one. The same detail is present, it simply waits until someone asks. At card level the rule is one metric, one insight, one next action. The same logic applies to colour: an evaluative index, a participation state and a categorical distribution are not the same kind of thing, and one universal card treatment would create false meaning. Pending is a state, not a risk.',
    },
    {
        title: 'What was implemented',
        body:
            'The dashboard philosophy was an accepted design direction, and so was the read, interpret, trust, act model. The philosophy was applied across dashboard work as an implemented design solution, and metric, chart and summary-card explanation were implemented in the recommended design. Colour semantics were implemented or incorporated. Adoption, trust and decision quality were not formally measured. The direction received positive response in demos and client-facing reviews, and no formal post-implementation measurement was conducted.',
    },
    {
        title: 'What remains unknown',
        body:
            'No measured business outcome is claimed. What this case demonstrates is explainability, information hierarchy and decision-support reasoning. No formally moderated client-user study was conducted, and client evidence was mediated through the relationship manager rather than gathered directly. No post-implementation measurement exists, so there is no claim of improved trust, adoption or decision quality. The exact implementation scope of some elements still needs verification, and every public example uses synthetic data.',
    },
];

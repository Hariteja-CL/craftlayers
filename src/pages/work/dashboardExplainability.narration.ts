import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the dashboard-explainability case study.
 *
 * One section per visible section, in the same order — the page maps narration
 * index to section id, so the two files have to be edited together.
 *
 * This narrates the INSIGHT BEHIND each visual, not the labels inside it.
 * Reading a diagram aloud node by node produces a transcript nobody can follow
 * and tells a listener nothing the picture did not already say.
 *
 * Public-safe: the employer and product environment are named because they are
 * approved public context, but no client, tenant or participant name appears,
 * no real values, formulas or thresholds, and design artifacts are described as
 * created and accepted, never as measured outcomes.
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'Overview',
        body:
            'Designing dashboards people can read, trust and act on. This is the EnCulture analytics reporting at NHR Technologies — multi-role dashboards where the same screen serves a senior decision-maker who needs a conclusion and a client-facing user who has to explain that conclusion to somebody else. The idea the whole case rests on is simple: a number is not useful if people cannot understand what produced it, what it means, and what they can do next.',
    },
    {
        title: 'The problem',
        body:
            'Decision-makers could read the numbers, but not the reasoning behind them. A culture score would appear on screen and answer none of the three questions a reader actually has: what produced this number, what does this colour mean, and why is this action being recommended. Because the screen did not answer them, a person had to. The explanation burden had moved out of the product and into somebody\'s workflow — usually whoever was standing closest to the client. The weakest layer was never the layout. It was the reasoning around the number.',
    },
    {
        title: 'The decision',
        body:
            'Four things a reader needs, in order. Read: I can see the metric. Interpret: I understand how it was produced. Trust: I can inspect the reasoning. Act: I know what I can do next. Trust was the stage that was missing, and it sits in the middle for a reason — it is what carries somebody from understanding a number to being willing to act on it. Trust is created through inspectability. A reader does not trust a score because it is displayed, and organisations often already use their own models and rating scales, so a number that disagrees with an existing method has to show its working.',
    },
    {
        title: 'One concrete example',
        body:
            'The explanation moved into the component itself. A summary card carries three separate layers of context — what the metric is, how the score was produced, and what a category band means — and they are kept apart deliberately, because one combined tooltip would have to answer three different questions at once. The governing principle is that clarity is not showing everything; it is showing the right level at the right moment. Shown side by side with a version that exposes everything at once, nothing has actually been removed. The same detail is present. It simply waits until somebody asks for it.',
    },
    {
        title: 'Scope',
        body:
            'Analytics user experience, the explainability model, information architecture for the reporting surface, and the product reasoning that connects a number to the decision it is supposed to support.',
    },
    {
        title: 'Evidence',
        body:
            'Product review and artifact review, together with feedback from a client-facing relationship manager who used the product daily. That gave direct evidence from her own use and indirect evidence from her client conversations. It was not a formally moderated client-user study, and it is not described as one.',
    },
    {
        title: 'Response',
        body:
            'The dashboard philosophy was accepted as a design direction and informed later dashboard work, and the recommended direction received positive feedback during demos and client-facing reviews. A high-fidelity concept demonstrated the interaction model; the production implementation used different data and product-specific logic.',
    },
    {
        title: 'Limitations',
        body:
            'No measured business outcome is claimed. What this case demonstrates is explainability, information hierarchy and decision-support reasoning. There was no formally moderated client-user study, client evidence was mediated rather than gathered directly, and no post-implementation measurement exists — so there is no claim of increased trust, increased adoption or improved decision quality. Every public example uses synthetic data. The strongest contribution was not a new layout. It was moving the explanation from a person\'s workflow back into the product, where both the decision-maker and the person explaining the data can reach it.',
    },
];

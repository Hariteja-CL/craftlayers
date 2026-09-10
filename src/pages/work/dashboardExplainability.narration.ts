import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the dashboard-explainability case study.
 *
 * Written by hand rather than scraped from the DOM. It omits breadcrumbs,
 * badges, navigation, button labels, figure captions, synthetic-data labels
 * and collapsed disclosures, so the spoken version is a genuine summary.
 *
 * One section per visible section, in the same order — the page maps narration
 * index to section id, so the two files have to be edited together.
 *
 * Public-safe rules followed throughout: the employer and product environment
 * are named because they are approved public context, but no client, tenant or
 * participant name appears; no real values, formulas or thresholds; design
 * artifacts are described as created and accepted, never as measured outcomes.
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'Overview',
        body:
            'Designing dashboards people can read, trust and act on. A review of the EnCulture analytics dashboards showed that both decision-makers and client-facing teams needed clearer explanations of how metrics, colours, evidence and recommendations were produced. The central question was this: how can an enterprise dashboard help users read, interpret, trust and act without requiring an expert to explain the screen?',
    },
    {
        title: 'Context',
        body:
            'EnCulture at NHR Technologies is a B2B culture analytics platform. Its dashboards are multi-role: the same reporting has to serve a senior decision-maker who needs a conclusion, and a client-facing operational user who has to explain that conclusion to somebody else. Those two readers want different depths of the same screen, and that is the constraint the work turns on.',
    },
    {
        title: 'The explanation burden',
        body:
            'The dashboard had two connected jobs. It had to help decision-makers understand and act on results, and it had to help client-facing teams explain those results consistently and confidently. In practice, interpretation frequently depended on explanation from the product team. That explanation burden had moved out of the product and into a person\'s workflow. The strongest issues identified were not primarily visual. They sat in the explanation layer around metrics, colours, evidence and action.',
    },
    {
        title: 'What I owned',
        body:
            'Analytics user experience, the explainability model, information architecture for the reporting surface, and the product reasoning that connected a metric to a decision. Evidence review came from dashboard and artifact analysis together with feedback from a client-facing relationship manager who used the product daily. That gave direct evidence from her own use and indirect evidence from her client conversations. It was not a formally moderated client-user study, and it is not described as one.',
    },
    {
        title: 'Trust through inspectability',
        body:
            'Four things a dashboard reader needs, in order. Read: what am I seeing? Interpret: what does it mean? Trust: can I inspect how this was produced? Act: what should happen next? Trust sits in the middle because it is what carries someone from understanding a number to being willing to act on it. And trust is created through inspectability. A reader does not trust a score simply because it is displayed. Trust develops when they can inspect how it was calculated, see which inputs contributed, compare it against their own understanding, and see how configuration changes the result. A composite score cannot rely on its label alone, because organisations often already use their own models and rating scales.',
    },
    {
        title: 'What changed',
        body:
            'The explanation moved into the component. A summary card carries three separate layers of context: what the metric is, how the score was produced, and what a category band means. They are kept apart deliberately, because one combined tooltip would have to answer three different questions at once. Four principles came out of this: explain the number, explain the colour, show the evidence, and support the decision. Running across all four is a fifth: disclose detail on demand. Nothing was removed to achieve the simpler view; the same detail is present, it simply waits until someone asks for it.',
    },
    {
        title: 'Response',
        body:
            'The dashboard philosophy was accepted and informed subsequent dashboard work, and the recommended direction received positive feedback during demos and client-facing reviews. A high-fidelity concept demonstrated the interaction model using illustrative content; the production implementation used different data and product-specific logic. No formal post-implementation measurement was conducted.',
    },
    {
        title: 'Limitations',
        body:
            'There was no formally moderated client-user study. Client evidence was mediated through the relationship manager rather than gathered directly. There was no formal post-implementation measurement, so this case makes no claim of increased trust, increased adoption, reduced support requests or improved decision quality. The exact implementation scope of some elements still requires verification, and every example shown publicly uses synthetic data. The strongest contribution was not a new layout. It was moving the explanation from a person\'s workflow back into the product, where both the decision-maker and the person explaining the data can reach it.',
    },
];

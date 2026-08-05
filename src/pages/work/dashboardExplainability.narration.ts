import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the dashboard-explainability case study.
 *
 * Written by hand rather than scraped from the DOM. It omits breadcrumbs,
 * badges, navigation, button labels, figure captions, synthetic-data labels
 * and collapsed disclosures, so the spoken version is a genuine summary.
 *
 * Public-safe rules followed throughout: no client, product or programme name;
 * no participant name; no real values, formulas or thresholds; design artifacts
 * described as created and accepted, never as measured outcomes.
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'Overview',
        body:
            'Designing dashboards people can read, trust and act on. A confidential enterprise dashboard review showed that both decision-makers and client-facing teams needed clearer explanations of how metrics, colours, evidence and recommendations were produced. The central question was this: how can an enterprise dashboard help users read, interpret, trust and act without requiring an expert to explain the screen?',
    },
    {
        title: 'The explanation burden',
        body:
            'The dashboard had two connected jobs. It had to help decision-makers understand and act on results, and it had to help client-facing teams explain those results consistently and confidently. In practice, interpretation frequently depended on explanation from the product team. That explanation burden had moved out of the product and into a person\'s workflow. The strongest issues identified were not primarily visual. They sat in the explanation layer around metrics, colours, evidence and action.',
    },
    {
        title: 'Evidence environment',
        body:
            'The work combined dashboard and artifact analysis with feedback from a client-facing relationship manager who also used the dashboard operationally. She supported clients through survey participation, reviewed results with them, and surfaced the questions and interpretation gaps that arose during those conversations. This provided direct evidence from her own product use and indirect evidence from client interactions. It was not a formally moderated client-user study.',
    },
    {
        title: 'Read, interpret, trust, act',
        body:
            'Four things a dashboard reader needs, in order. Read: what am I seeing? The metric name, unit, score type, response base and a plain-language definition. Interpret: what does it mean? The scale, category boundaries, comparison context, and what good, average or poor looks like. Trust: can I inspect how this was produced? The calculation logic at an appropriate level, the contributing inputs, and the evidence behind the result. Act: what should happen next? The decision implication, the recommended action and who owns it. When one of these stages is weak, dashboard readers are more likely to depend on additional explanation or make decisions with incomplete context.',
    },
    {
        title: 'Trust through inspectability',
        body:
            'This was the central advance in the work. Trust is created through inspectability. A reader does not trust a score simply because it is displayed. Trust develops when they can understand what it represents, inspect how it was calculated, see which inputs contributed, compare it against their own understanding, see why a category or colour was assigned, and understand how configuration changes the result. A composite score cannot rely on its label alone. Organisations may already use their own models, weighting systems and rating scales. Before relying on a displayed result, readers need to know which inputs were used, how they were weighted, how the result was classified, and how customisation changes the outcome.',
    },
    {
        title: 'Design principles',
        body:
            'Four principles came out of the work. Explain the number: every important metric should clarify what it represents, what type of value it is, which inputs contributed, what rating model was used at an appropriate level, what the result means and what action it supports. Explain the colour: brand colour identifies the product, but data colour must explain the data. Each colour needs a defined analytical purpose, consistent meaning, supporting labels and accessible non-colour cues. Show the evidence: scores, summaries and recommendations should connect to their contributing metrics, charts and qualitative evidence, with the question or category context preserved. Support the decision: the dashboard should make clear why the information matters, what decision it supports, what to do next and who owns the action. And running across all four, disclose detail on demand. Clarity does not mean showing everything; it means showing the right level of information at the right moment. Senior decision-makers needed a concise view of the most important signal, while client-facing operational users needed access to the explanation behind it. The summary stays simple, and the reasoning remains available.',
    },
    {
        title: 'Key decisions',
        body:
            'A composite score appeared without clear calculation context, so a label alone did not create trust; the decision was to add a definition, inputs, scale and an explanation of the calculation logic. Clients compared the displayed score against their own rating models, so trust depended on comparability; the decision was to show the methodology and explain how configuration affects results. Brand and data colours were mixed, so product identity colour did not communicate analytical meaning; the decision was to separate brand colour from semantic data colour with consistent rules and legends. Recommendations appeared without visible evidence, making them hard to defend; the decision was to link each recommendation to the metric, chart and qualitative evidence behind it. And because interpretation depended on a person explaining results, the decision was to build explanation directly into cards, charts and summaries.',
    },
    {
        title: 'Implemented direction',
        body:
            'The dashboard philosophy was accepted as a design direction and applied across the dashboard work. The recommended direction covered metric explanation, summary-card explanation, chart semantics, colour logic and evidence traceability, and was carried through to a final recommended design. Some elements are still being verified for exact implementation scope, and that is stated openly rather than smoothed over.',
    },
    {
        title: 'Outcome',
        body:
            'The philosophy was accepted and implemented across the dashboard experience. The recommended direction received positive feedback during demos and client-facing reviews. No formal post-implementation measurement was conducted. That means there is no verified claim of increased trust, increased adoption, reduced support requests or improved decision quality. What can be claimed is a dashboard UX philosophy, a prioritised action plan, implementation-ready recommendations, interaction concepts for metric explanation and evidence traceability, and a clear list of what still needs validation.',
    },
    {
        title: 'Limitations and reflection',
        body:
            'There was no formally moderated client-user study. Client evidence was mediated through the relationship manager rather than gathered directly. There was no formal post-implementation measurement, and the exact implementation scope of some elements still requires verification. All public examples use synthetic data. The reflection is this: the strongest contribution was not a new dashboard layout. It was creating a clearer explanation model for how metrics, charts, evidence and recommendations should help readers move from seeing information to acting on it. That does not establish that the previous layout was correct, and it has not yet been tested in measured use.',
    },
];

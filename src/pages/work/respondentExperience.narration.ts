import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the respondent-experience case study.
 *
 * One section per visible section, in the same order — the page maps narration
 * index to section id, so the two files have to be edited together.
 *
 * This narrates the INSIGHT BEHIND each visual, not the labels inside it.
 * Reading a diagram aloud node by node produces a transcript nobody can follow.
 *
 * Public-safe: the employer and product environment are named because they are
 * approved public context, but no participant, client or tenant name appears,
 * and no pilot figures — invitation counts, participation rates or response
 * counts — are spoken. Those are internal analytics and belong to the
 * protected layer.
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'Overview',
        body:
            'Three questions were not the problem. Trust and communication were. This is the assessment experience inside EnCulture at NHR Technologies — a B2B culture analytics platform where everything downstream, the dashboards and the insight and the recommendations, depends on people answering, and answering honestly. That makes the respondent experience an upstream product problem rather than a survey-design detail.',
    },
    {
        title: 'The problem',
        body:
            'Short does not mean clear. What the product saw was three questions taking under two minutes — low interaction effort, nothing obvious to fix. What the respondent had were three questions of their own: why am I receiving this, is it anonymous, and what happens after I answer? Friction was the assumed cause, and the survey had almost none of it. A one-time form can succeed on novelty. A recurring one has to earn each response, and it competes with the respondent\'s memory of what happened, or did not happen, last time.',
    },
    {
        title: 'The journey',
        body:
            'Following the experience end to end, three of six stages were carrying no weight — and none of them was the form itself. Understanding was weak, because the reminder had quietly become the real entry point rather than the welcome message, and it did not stand on its own. Trust was weak, because anonymity was asserted as a word rather than explained in practice. And feedback was weak, because nothing visible happened after submitting.',
    },
    {
        title: 'The decision',
        body:
            'The problem was reframed. It arrived as a dashboard-value question — the data is thin, so fix the reporting — and it left as an upstream respondent-experience problem. Before, the proposed fix was to make the survey shorter. After, it was to make the purpose, the safety and the follow-through clearer. Three principles follow: explain why, so every reminder stands on its own; establish safety, by showing how grouping and thresholds protect an answer; and close the loop, because a request that shows no consequence has not earned the next one. Underneath all of it sits the harder idea — completion does not automatically equal candour. A survey can be fully completed and still be worth very little.',
    },
    {
        title: 'Scope',
        body:
            'Research and problem diagnosis, behavioural analytics read alongside the qualitative evidence rather than instead of it, and the interaction design of the experience surrounding the form.',
    },
    {
        title: 'Evidence',
        body:
            'Communication review, respondent journey review, interviews and stakeholder evidence, and behavioural analytics. This was early qualitative research intended to surface hypotheses, not a statistically representative study, and it was conducted inside one organisation. It does not explain all survey non-response, and it is not presented as if it does.',
    },
    {
        title: 'Limitations',
        body:
            'This case does not claim that communication changes alone increased participation. What it shows is how the investigation reframed the problem, from questionnaire length to respondent context and trust. The study was early and directional, with a small interview sample and no quantitative validation, conducted in one organisation. Management input was stakeholder feedback rather than a formal interview. Everything proposed is a recommendation: none has shipped and none has post-change measurement, so none is validated.',
    },
];

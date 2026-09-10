import type { NarrationSection } from '../../components/case-study/CaseStudyListenPlayer';

/**
 * Curated narration transcript for the respondent-experience case study.
 *
 * Written by hand rather than scraped from the DOM. One section per visible
 * section, in the same order — the page maps narration index to section id, so
 * the two files have to be edited together.
 *
 * Public-safe rules: the employer and product environment are named because
 * they are approved public context, but no participant, client or tenant name
 * appears, and no pilot figures — invitation counts, participation rates or
 * response counts — are spoken. Those are internal analytics and belong to the
 * protected layer.
 */
export const NARRATION_SECTIONS: NarrationSection[] = [
    {
        title: 'Overview',
        body:
            'Three questions were not the problem. A recurring workplace feedback survey was short, simple and quick to complete, and people still were not answering it. The question this case works on is: what prevents people from repeatedly providing honest feedback, even when a survey is short and easy to complete?',
    },
    {
        title: 'Context',
        body:
            'EnCulture at NHR Technologies is a B2B culture analytics platform, and the assessment experience is where its data comes from. Everything downstream — the dashboards, the insight, the recommendations — depends on people answering, and answering honestly. That makes the respondent experience an upstream product problem rather than a survey-design detail.',
    },
    {
        title: 'The problem',
        body:
            'The instinct was to treat low participation as survey friction: too long, too complex, too frequent. The evidence pointed elsewhere. The survey was three questions and took about two minutes, so friction was not what was stopping people. Underneath the symptom sat something else — a respondent contract. Repeatedly and honest are the demanding words in that question. A one-time form can succeed on novelty. A recurring one has to earn each response, and it competes with the respondent\'s memory of what happened, or did not happen, last time.',
    },
    {
        title: 'What I owned',
        body:
            'Research and problem diagnosis, the respondent experience itself, and the interaction design of the communications around it. The evidence was qualitative and early: stakeholder interviews, management feedback, a review of the welcome and reminder communications, a respondent-journey review, and a review of how roles and reporting connected. Behavioural analytics gave supporting signal on where people dropped away.',
    },
    {
        title: 'The decision',
        body:
            'Five conditions decide whether someone answers again: relevance, effort, safety, impact and ownership. Effort was the only one anybody had been designing for, and it was the only one that was not broken. The second decision follows from the first: completion is not the same as candour. Submission count is not the complete measure of survey quality, because participation, honesty, representation and actionability move independently. A survey can be fully completed and still be worth very little.',
    },
    {
        title: 'What changed',
        body:
            'The problem was reframed. It arrived as a dashboard-value question — the data is thin, so fix the reporting — and it left as an upstream respondent-experience problem. That changed what got worked on. Every reminder had to be independently understandable, because the reminder had become the real entry point rather than the welcome message. Anonymity had to be explained in practice rather than asserted as a word. And the loop had to close visibly, because a recurring request that shows no consequence has not earned the next response.',
    },
    {
        title: 'Evidence',
        body:
            'This was early qualitative research intended to surface hypotheses, not a statistically representative study. It combined a small number of interviews with stakeholder feedback and communication review inside one organisation. It does not explain all survey non-response, and it is not presented as if it does.',
    },
    {
        title: 'Limitations',
        body:
            'The study was early and directional, with a small interview sample and no broad quantitative validation. It was conducted in one organisation. Management input was stakeholder feedback rather than a formal interview. Everything proposed is a recommendation: none has shipped, none has post-change measurement, and so none is validated. The most useful contribution was diagnostic — reframing a dashboard-value problem as an upstream respondent-experience problem, and staying honest about the line between what the evidence confirmed and what it only suggested.',
    },
];
